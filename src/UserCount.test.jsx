import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserCount from "./UserCount";

describe("UserCount component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("displays 0 users when localStorage is empty", () => {
    render(<UserCount />);
    expect(screen.getByText("0 user(s) already registered")).toBeInTheDocument();
  });

  it("displays 1 user when localStorage has registration data", () => {
    localStorage.setItem("registration", JSON.stringify({ firstName: "Alice" }));
    render(<UserCount />);
    expect(screen.getByText("1 user(s) already registered")).toBeInTheDocument();
  });
});
