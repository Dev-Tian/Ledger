import { api, sanctum } from "./api";

export function toApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as { response?: { data?: unknown } }).response?.data;
    if (typeof data === "string" && data.trim() !== "") {
      return data.trim();
    }
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const message = record.message ?? record.error;
      if (typeof message === "string" && message.trim() !== "") {
        return message.trim();
      }
    }
  }
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message.trim();
  }
  return fallback;
}

export const sanctum_csrf = async () => {
  try {
    await sanctum.get("/sanctum/csrf-cookie");
  } catch (error) {
    console.error("Failed to get CSRF cookie:", error);
    throw error;
  }
};

export const apiService = {
  login: async (email: string, password: string): Promise<unknown> => {
    await sanctum_csrf();
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  authUser: async (): Promise<unknown> => {
    const response = await api.get("/profile");
    return response.data;
  },

  logout: async (): Promise<unknown> => {
    const response = await api.post("/logout");
    return response.data;
  },
};

export default apiService;
