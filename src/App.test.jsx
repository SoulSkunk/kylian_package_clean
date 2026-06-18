import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import App from "./App";
import { syncUser, loginAdmin, getUsers, deleteUser } from "./api";

vi.mock("./api", () => ({
  syncUser: vi.fn(),
  loginAdmin: vi.fn(),
  getUsers: vi.fn(),
  deleteUser: vi.fn()
}));

describe("App component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue([]);
  });

  it("renders the registration form fields", async () => {
    render(<App />);

    expect(screen.getByLabelText(/^Prénom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Date de naissance$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Ville$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Code postal$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /envoyer/i })).toBeInTheDocument();
  });

  it("disables submit button when form is empty", async () => {
    render(<App />);
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when all fields are filled", async () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByTestId("lastName"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByTestId("email"), { target: { value: "alice.dupont@example.com" } });
    fireEvent.change(screen.getByTestId("birthdate"), { target: { value: "1990-05-20" } });
    fireEvent.change(screen.getByTestId("city"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByTestId("zipcode"), { target: { value: "75001" } });

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).not.toBeDisabled();
  });

  it("saves valid registration data via API and shows success toaster", async () => {
    syncUser.mockResolvedValue({ message: "Success" });
    getUsers.mockResolvedValue([]);

    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByTestId("lastName"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByTestId("email"), { target: { value: "alice.dupont@example.com" } });
    fireEvent.change(screen.getByTestId("birthdate"), { target: { value: "1990-05-20" } });
    fireEvent.change(screen.getByTestId("city"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByTestId("zipcode"), { target: { value: "75001" } });

    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-success")).toBeInTheDocument();
    });

    expect(syncUser).toHaveBeenCalledWith({
      firstName: "Alice",
      lastName: "Dupont",
      email: "alice.dupont@example.com",
      birthdate: "1990-05-20",
      city: "Paris",
      zipcode: "75001",
    });
  });

  it("shows error toaster if API fails", async () => {
    syncUser.mockRejectedValue(new Error("API Error"));
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByTestId("lastName"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByTestId("email"), { target: { value: "alice.dupont@example.com" } });
    fireEvent.change(screen.getByTestId("birthdate"), { target: { value: "1990-05-20" } });
    fireEvent.change(screen.getByTestId("city"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByTestId("zipcode"), { target: { value: "75001" } });

    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-error")).toBeInTheDocument();
      expect(screen.getByTestId("toaster-error")).toHaveTextContent("Erreur lors de l'enregistrement en base de données");
    });
  });

  it("shows validation errors for invalid form data", async () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), { target: { value: "A" } });
    fireEvent.change(screen.getByTestId("lastName"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("email"), { target: { value: "email" } });
    fireEvent.change(screen.getByTestId("birthdate"), { target: { value: "2010-01-01" } });
    fireEvent.change(screen.getByTestId("city"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("zipcode"), { target: { value: "7500" } });

    fireEvent.submit(screen.getByTestId("registration-form"));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-error")).toBeInTheDocument();
    });

    expect(await screen.findByText(/^Prénom invalide$/i)).toBeInTheDocument();
    expect(await screen.findByText(/^Nom invalide$/i)).toBeInTheDocument();
    expect(syncUser).not.toHaveBeenCalled();
  });

  it("can login as admin and see delete button", async () => {
    getUsers.mockResolvedValue([{ id: 1, prenom: "Jean", nom: "Test", email: "jean@test.com" }]);
    loginAdmin.mockResolvedValue({ role: "admin" });

    render(<App />);

    // Attendre que la liste soit affichée
    await waitFor(() => {
      expect(screen.getByText(/Jean Test/)).toBeInTheDocument();
    });

    // Pas de bouton supprimer par défaut
    expect(screen.queryByText("Supprimer")).not.toBeInTheDocument();

    // Connexion
    fireEvent.click(screen.getByText("Se connecter"));
    fireEvent.change(screen.getByPlaceholderText("Email / Pseudo"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("Valider"));

    await waitFor(() => {
      expect(screen.getByText("Connecté en tant que: admin")).toBeInTheDocument();
    });

    // Bouton supprimer doit être présent
    expect(screen.getByText("Supprimer")).toBeInTheDocument();
  });

  it("can delete user when admin", async () => {
    getUsers.mockResolvedValue([{ id: 1, prenom: "Jean", nom: "Test", email: "jean@test.com" }]);
    loginAdmin.mockResolvedValue({ role: "admin" });
    deleteUser.mockResolvedValue({});

    render(<App />);

    fireEvent.click(screen.getByText("Se connecter"));
    fireEvent.change(screen.getByPlaceholderText("Email / Pseudo"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("Valider"));

    await waitFor(() => {
      expect(screen.getByText("Supprimer")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Supprimer"));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1);
    });
  });

  it("shows error if login fails", async () => {
    loginAdmin.mockRejectedValue(new Error("Login failed"));
    render(<App />);

    fireEvent.click(screen.getByText("Se connecter"));
    fireEvent.change(screen.getByPlaceholderText("Email / Pseudo"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByText("Valider"));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-error")).toHaveTextContent("Identifiants invalides");
    });
  });

  it("shows error if deleteUser fails", async () => {
    getUsers.mockResolvedValue([{ id: 1, prenom: "Jean", nom: "Test", email: "jean@test.com" }]);
    loginAdmin.mockResolvedValue({ role: "admin" });
    deleteUser.mockRejectedValue(new Error("Delete failed"));

    render(<App />);

    fireEvent.click(screen.getByText("Se connecter"));
    fireEvent.change(screen.getByPlaceholderText("Email / Pseudo"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("Valider"));

    await waitFor(() => {
      expect(screen.getByText("Supprimer")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Supprimer"));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-error")).toHaveTextContent("Erreur lors de la suppression");
    });
  });

  it("can close the toaster", async () => {
    syncUser.mockResolvedValue({ message: "Success" });
    
    render(<App />);
    
    fireEvent.change(screen.getByTestId("firstName"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByTestId("lastName"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByTestId("email"), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByTestId("birthdate"), { target: { value: "1990-05-20" } });
    fireEvent.change(screen.getByTestId("city"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByTestId("zipcode"), { target: { value: "75001" } });
    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-success")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("toaster-success")).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it("can close login modal", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Se connecter"));
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Fermer"));
    expect(screen.queryByText("Connexion")).not.toBeInTheDocument();
  });

  it("renders 'Aucun utilisateur' if empty", async () => {
    getUsers.mockResolvedValue([]);
    render(<App />);
    expect(await screen.findByText("Aucun utilisateur enregistré.")).toBeInTheDocument();
  });
});
