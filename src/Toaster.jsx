import { useEffect } from "react";
import "./Toaster.css";

export function Toaster({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`toaster toaster-${type}`}
      role="status"
      aria-live="polite"
      data-testid={`toaster-${type}`}
    >
      {message}
    </div>
  );
}
