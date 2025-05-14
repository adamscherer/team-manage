import { User } from "@/types/user";

export function getAzureAuth() {
  // TODO: Implement with MSAL.js
  return {
    user: null as User | null,
    login: () => {
      if (typeof globalThis !== "undefined" && globalThis.alert) {
        globalThis.alert("Azure AD login not implemented");
      }
    },
    logout: () => {
      if (typeof globalThis !== "undefined" && globalThis.alert) {
        globalThis.alert("Azure AD logout not implemented");
      }
    },
    isAuthenticated: () => false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasRole: (_role: string) => false,
  };
}
