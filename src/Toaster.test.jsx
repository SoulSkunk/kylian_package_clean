import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { Toaster } from "./Toaster";

describe("Toaster component", () => {
  it("renders with success message", () => {
    render(
      <Toaster message="Success message" type="success" onClose={() => {}} />,
    );

    expect(screen.getByTestId("toaster-success")).toBeInTheDocument();
    expect(screen.getByTestId("toaster-success")).toHaveTextContent(
      "Success message",
    );
  });

  it("renders with error message", () => {
    render(<Toaster message="Error message" type="error" onClose={() => {}} />);

    expect(screen.getByTestId("toaster-error")).toBeInTheDocument();
    expect(screen.getByTestId("toaster-error")).toHaveTextContent(
      "Error message",
    );
  });

  it("does not render when message is empty", () => {
    render(<Toaster message="" type="success" onClose={() => {}} />);

    expect(screen.queryByTestId("toaster-success")).not.toBeInTheDocument();
  });

  it("calls onClose after 3 seconds", async () => {
    vi.useFakeTimers();
    const onCloseMock = vi.fn();

    render(
      <Toaster message="Test message" type="success" onClose={onCloseMock} />,
    );

    expect(onCloseMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("clears timeout on unmount", async () => {
    vi.useFakeTimers();
    const onCloseMock = vi.fn();

    const { unmount } = render(
      <Toaster message="Test message" type="success" onClose={onCloseMock} />,
    );

    unmount();

    vi.advanceTimersByTime(3000);

    expect(onCloseMock).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
