"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { apiService } from "@/lib/apiService";

export interface User {
  id?: string | number;
  name?: string;
  fname?: string;
  lname?: string;
  email?: string;
  role?: string;
  roles?: { name?: string }[];
}

interface LoginResult {
  error?: string;
  isServerUnreachable?: boolean;
  user?: User | null;
  role?: string | null;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshUser: (options?: { force?: boolean }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const temporarySessionKey = "ledger-temp-user";

// Seeded accounts stand in until login and profile return the signed-in user.
const seededAccounts: Record<string, User> = {
  admin: {
    id: "temp-admin",
    name: "Admin Test User",
    email: "admin@example.com",
    role: "admin",
    roles: [{ name: "admin" }],
  },
  uploader: {
    id: "temp-uploader",
    name: "Uploader Test User",
    email: "uploader@example.com",
    role: "uploader",
    roles: [{ name: "uploader" }],
  },
  employee: {
    id: "temp-employee",
    name: "Employee Test User",
    email: "employee@example.com",
    role: "employee",
    roles: [{ name: "employee" }],
  },
};

seededAccounts["admin@example.com"] = seededAccounts.admin;
seededAccounts["uploader@example.com"] = seededAccounts.uploader;
seededAccounts["employee@example.com"] = seededAccounts.employee;

function temporarySeedUser(identifier: string): User | null {
  return seededAccounts[identifier.trim().toLowerCase()] ?? null;
}

function readTemporaryUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(temporarySessionKey);
  if (!raw) return null;
  try {
    return profileUser(JSON.parse(raw));
  } catch {
    return null;
  }
}

function storeTemporaryUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.sessionStorage.removeItem(temporarySessionKey);
    return;
  }
  window.sessionStorage.setItem(temporarySessionKey, JSON.stringify(user));
}

function profileUser(payload: unknown): User | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as { data?: User; user?: User; role?: string };
  const user = record.user ?? record.data ?? (payload as User);
  if (!user || typeof user !== "object") return null;
  if (!user.email && !user.name && user.id == null) return null;
  if (!user.role && user.roles?.[0]?.name) user.role = user.roles[0].name;
  if (!user.role && record.role) user.role = record.role;
  return user;
}

function isUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("response" in error)) return false;
  return (error as { response?: { status?: number } }).response?.status === 401;
}

function loginFailure(error: unknown): LoginResult {
  const response =
    error && typeof error === "object" && "response" in error
      ? (error as { response?: unknown; code?: string; message?: string }).response
      : undefined;
  const code = error && typeof error === "object" && "code" in error ? (error as { code?: string }).code : "";
  const message = error && typeof error === "object" && "message" in error ? (error as { message?: string }).message : "";
  const unreachable = code === "ERR_NETWORK" || message === "Network Error" || !response;

  return {
    error: unreachable
      ? "Server not found"
      : toMessage(error) || "Something went wrong",
    isServerUnreachable: unreachable,
  };
}

function toMessage(error: unknown): string {
  if (!error || typeof error !== "object" || !("response" in error)) return "";
  const data = (error as { response?: { data?: { message?: string } } }).response?.data;
  return typeof data?.message === "string" ? data.message : "";
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async (options?: { force?: boolean }) => {
    try {
      const userData = profileUser(await apiService.authUser());
      setUser((prev) => {
        if (!options?.force && prev && prev.email === userData?.email && prev.name === userData?.name) {
          return prev;
        }
        return userData;
      });
    } catch (error) {
      if (isUnauthorized(error)) {
        setUser(readTemporaryUser());
        return;
      }
      console.error("Error refreshing user:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadUserAuth() {
      try {
        const userData = profileUser(await apiService.authUser());
        if (!isMounted) return;
        storeTemporaryUser(null);
        setUser(userData);
      } catch (error) {
        if (!isMounted) return;
        if (isUnauthorized(error)) {
          setUser(readTemporaryUser());
        } else {
          console.error("Error during session restoration:", error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadUserAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await apiService.login(email, password);
      let userData = profileUser(res);
      let fromProfile = false;
      try {
        const profile = profileUser(await apiService.authUser());
        if (profile) {
          userData = profile;
          fromProfile = true;
        }
      } catch (profileError) {
        if (!userData) userData = temporarySeedUser(email);
        if (!userData) return loginFailure(profileError);
      }
      if (!userData) userData = temporarySeedUser(email);
      if (!userData) {
        return { error: "The profile could not be read." };
      }
      storeTemporaryUser(fromProfile ? null : userData);
      setUser(userData);

      return {
        ...(res && typeof res === "object" ? res : { data: res }),
        user: userData,
        role: userData?.role || userData?.roles?.[0]?.name || null,
      };
    } catch (error) {
      return loginFailure(error);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      storeTemporaryUser(null);
      setUser(null);
      router.push("/loading?to=home");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
