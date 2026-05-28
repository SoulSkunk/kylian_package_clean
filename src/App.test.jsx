import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import App from "./App";

describe("App component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the registration form fields", () => {
    render(<App />);

    expect(screen.getByLabelText(/^Prénom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Date de naissance$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Ville$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Code postal$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /envoyer/i }),
    ).toBeInTheDocument();
  });

  it("disables submit button when form is empty", () => {
    render(<App />);
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when some fields are empty", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("firstName"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByTestId("lastName"), {
      target: { value: "Dupont" },
    });

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when all fields are filled", () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByTestId("lastName"), {
      target: { value: "Dupont" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "alice.dupont@example.com" },
    });
    fireEvent.change(screen.getByTestId("birthdate"), {
      target: { value: "1990-05-20" },
    });
    fireEvent.change(screen.getByTestId("city"), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByTestId("zipcode"), {
      target: { value: "75001" },
    });

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).not.toBeDisabled();
  });

  it("saves valid registration data into localStorage and shows success toaster", async () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByTestId("lastName"), {
      target: { value: "Dupont" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "alice.dupont@example.com" },
    });
    fireEvent.change(screen.getByTestId("birthdate"), {
      target: { value: "1990-05-20" },
    });
    fireEvent.change(screen.getByTestId("city"), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByTestId("zipcode"), {
      target: { value: "75001" },
    });

    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-success")).toBeInTheDocument();
      expect(screen.getByTestId("toaster-success")).toHaveTextContent(
        /Inscription enregistrée avec succès/i,
      );
    });

    expect(JSON.parse(localStorage.getItem("registration"))).toEqual({
      firstName: "Alice",
      lastName: "Dupont",
      email: "alice.dupont@example.com",
      birthdate: "1990-05-20",
      city: "Paris",
      zipcode: "75001",
    });
  });

  it("clears form fields after successful submission", async () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByTestId("lastName"), {
      target: { value: "Dupont" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "alice.dupont@example.com" },
    });
    fireEvent.change(screen.getByTestId("birthdate"), {
      target: { value: "1990-05-20" },
    });
    fireEvent.change(screen.getByTestId("city"), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByTestId("zipcode"), {
      target: { value: "75001" },
    });

    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

    await waitFor(() => {
      expect(screen.getByTestId("firstName")).toHaveValue("");
      expect(screen.getByTestId("lastName")).toHaveValue("");
      expect(screen.getByTestId("email")).toHaveValue("");
      expect(screen.getByTestId("birthdate")).toHaveValue("");
      expect(screen.getByTestId("city")).toHaveValue("");
      expect(screen.getByTestId("zipcode")).toHaveValue("");
    });
  });

  it("shows validation errors for invalid form data", async () => {
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByTestId("lastName"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "email" },
    });
    fireEvent.change(screen.getByTestId("birthdate"), {
      target: { value: "2010-01-01" },
    });
    fireEvent.change(screen.getByTestId("city"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("zipcode"), {
      target: { value: "7500" },
    });

    fireEvent.submit(screen.getByTestId("registration-form"));

    await waitFor(() => {
      expect(screen.getByTestId("toaster-error")).toBeInTheDocument();
      expect(screen.getByTestId("toaster-error")).toHaveTextContent(
        /Veuillez corriger les erreurs du formulaire/i,
      );
    });

    expect(await screen.findByText(/^Prénom invalide$/i)).toBeInTheDocument();
    expect(await screen.findByText(/^Nom invalide$/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email invalide/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Vous devez avoir 18 ans ou plus/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Ville invalide/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Code postal invalide/i),
    ).toBeInTheDocument();
    expect(localStorage.getItem("registration")).toBeNull();
  });


  it("closes the toaster automatically after 3 seconds", async () => {
    vi.useFakeTimers();
    const { act } = await import("react");
    render(<App />);

    fireEvent.change(screen.getByTestId("firstName"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByTestId("lastName"), {
      target: { value: "Dupont" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "alice.dupont@example.com" },
    });
    fireEvent.change(screen.getByTestId("birthdate"), {
      target: { value: "1990-05-20" },
    });
    fireEvent.change(screen.getByTestId("city"), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByTestId("zipcode"), {
      target: { value: "75001" },
    });

    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

    expect(screen.getByTestId("toaster-success")).toBeInTheDocument();

    // Avance le temps de 3 secondes pour déclencher closeToaster
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByTestId("toaster-success")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
