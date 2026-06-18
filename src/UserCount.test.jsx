import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserCount from "./UserCount";

describe("UserCount", () => {
  it("renders the correct number of users", () => {
    render(<UserCount usersCount={5} />);
    expect(screen.getByTestId("user-count")).toHaveTextContent("5 user(s) already registered");
  });

  it("renders 0 if usersCount is not provided", () => {
    render(<UserCount />);
    expect(screen.getByTestId("user-count")).toHaveTextContent("0 user(s) already registered");
  });
});
