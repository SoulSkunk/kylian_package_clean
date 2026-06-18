import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { syncUser, loginAdmin, getUsers, deleteUser } from "./api";

vi.mock("axios", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    }
  };
});
describe("API calls", () => {
  it("syncUser calls axios.post and returns data", async () => {
    const userData = { firstName: "Bob" };
    const mockResponse = { data: { message: "Success" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await syncUser(userData);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), userData);
    expect(result).toEqual(mockResponse.data);
  });

  it("getUsers calls axios.get and returns list or empty array", async () => {
    const mockResponse = { data: { utilisateurs: [{ id: 1, nom: "Dupont" }] } };
    axios.get.mockResolvedValueOnce(mockResponse);
    const result = await getUsers();
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    expect(result).toEqual(mockResponse.data.utilisateurs);

    // Test branch where utilisateurs is undefined
    axios.get.mockResolvedValueOnce({ data: {} });
    const emptyResult = await getUsers();
    expect(emptyResult).toEqual([]);
  });

  it("loginAdmin calls axios.post and returns role", async () => {
    const mockResponse = { data: { role: "admin" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await loginAdmin("admin@test.com", "password");
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { pseudo: "admin@test.com", password: "password" });
    expect(result).toEqual({ role: "admin" });
  });

  it("deleteUser calls axios.delete", async () => {
    const mockResponse = { data: { message: "Deleted" } };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const result = await deleteUser(1);
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining("/users/1"));
    expect(result).toEqual({ message: "Deleted" });
  });

  it("handles errors correctly in getUsers", async () => {
    const errorMessage = "Network Error";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    await expect(getUsers()).rejects.toThrow(errorMessage);
  });

  it("handles errors correctly in syncUser", async () => {
    const errorMessage = "Network Error";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
    await expect(syncUser({})).rejects.toThrow(errorMessage);
  });

  it("handles errors correctly in loginAdmin", async () => {
    const errorMessage = "Network Error";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
    await expect(loginAdmin("a", "b")).rejects.toThrow(errorMessage);
  });

  it("handles errors correctly in deleteUser", async () => {
    const errorMessage = "Network Error";
    axios.delete.mockRejectedValueOnce(new Error(errorMessage));
    await expect(deleteUser(1)).rejects.toThrow(errorMessage);
  });
});
