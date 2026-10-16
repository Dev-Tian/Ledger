import { api, sanctum } from "./api";
import type { UploadRow } from "./sheet-rows";

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

function compactRows(rows: UploadRow[]): UploadRow[] {
  return rows.map((row) => {
    const compact: UploadRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (value == null || value === "") continue;
      compact[key] = value;
    }
    return compact;
  });
}

async function postRows(path: string, rows: UploadRow[], message: string): Promise<unknown> {
  const response = await api.post(
    path,
    { rows: compactRows(rows) },
    { headers: { "Content-Type": "application/json" } },
  );
  const count = response.data?.inserted;
  return {
    message,
    inserted: typeof count === "number" ? count : rows.length,
  };
}

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

// ADMIN USER API :
  getUsers: async (
    page = 1,
    filters?: { search?: string; branch_code?: string },
  ): Promise<unknown> => {
    const params: { page: number; per_page: number; search?: string; branch_code?: string } = {
      page,
      per_page: 10,
    };
    const search = filters?.search?.trim();
    const branchCode = filters?.branch_code?.trim();
    if (search) params.search = search;
    if (branchCode) params.branch_code = branchCode;
    const response = await api.get("/users", { params });
    return response.data;
  },

  getUser: async (user: string | number): Promise<unknown> => {
    const response = await api.get(`/users/${user}`);
    return response.data;
  },

  addUser: async (payload: Record<string, unknown>): Promise<unknown> => {
    const response = await api.post("/users", payload);
    return response.data;
  },

  updateUser: async (user: string | number, payload: Record<string, unknown>): Promise<unknown> => {
    const response = await api.put(`/users/${user}`, payload);
    return response.data;
  },

  deleteUser: async (user: string | number): Promise<unknown> => {
    const response = await api.delete(`/users/${user}`);
    return response.data;
  },
  
// UPLOAD API : Upload Installments
  uploadInstallments: async (rows: UploadRow[]): Promise<unknown> => {
    return postRows("/installments", rows, "Installments uploaded");
  },

  uploadPayments: async (rows: UploadRow[]): Promise<unknown> => {
    return postRows("/payments", rows, "Payments uploaded");
  },
};

export default apiService;
