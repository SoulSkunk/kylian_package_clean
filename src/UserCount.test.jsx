import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import axios from "axios";
import UserCount from "./UserCount";

describe("UserCount component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays the number of users on success", async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: { utilisateurs: [{ id: 1 }, { id: 2 }, { id: 3 }] }
    });
    axios.create.mockReturnValue({ get: mockGet });

    render(<UserCount />);

    await waitFor(() => {
      expect(screen.getByText("3 user(s) already registered")).toBeInTheDocument();
    });
    expect(mockGet).toHaveBeenCalledWith("/users");
  });

  it("handles errors when fetching fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockGet = vi.fn().mockRejectedValue(new Error("Network Error"));
    axios.create.mockReturnValue({ get: mockGet });

    render(<UserCount />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
