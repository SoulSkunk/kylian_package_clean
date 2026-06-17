import "@testing-library/jest-dom";
import { vi } from "vitest";
import axios from "axios";

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(() => Promise.resolve({ data: { utilisateurs: [] } }))
      }))
    }
  };
});
