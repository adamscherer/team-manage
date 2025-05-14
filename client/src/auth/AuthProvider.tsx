import React, { createContext, useContext } from "react";

import { User } from "@/types/user";

import { getAzureAuth } from "./azureAuth";
import { getMockAuth } from "./mockAuth";

export type AuthContextType = {
  user: User | null;
  login: (role: "admin" | "user") => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const provider = import.meta.env.VITE_AUTH_PROVIDER || "mock";
  // Swap this logic when Azure AD is implemented
  const auth = provider === "azure" ? getAzureAuth() : getMockAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
