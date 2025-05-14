import { useCallback, useEffect, useState } from "react";
import {
  AccountInfo,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";

import { User } from "@/types/user";

// These should be set in your .env file
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID!,
    authority:
      import.meta.env.VITE_AZURE_AD_AUTHORITY ||
      "https://login.microsoftonline.com/common",
    redirectUri:
      import.meta.env.VITE_AZURE_AD_REDIRECT_URI ||
      (typeof globalThis !== "undefined" && globalThis.location
        ? globalThis.location.origin
        : undefined),
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

type IdTokenClaimsWithRoles = {
  roles?: string[];
  [key: string]: unknown;
};

function mapAccountToUser(account: AccountInfo | null): User | null {
  if (!account) return null;
  // Use a hash of the localAccountId string for id, or fallback to 0
  const id = account.localAccountId
    ? parseInt(account.localAccountId.replace(/\D/g, "").slice(0, 8)) || 0
    : 0;
  const claims = account.idTokenClaims as IdTokenClaimsWithRoles | undefined;
  return {
    id,
    name: account.name || account.username,
    email: account.username,
    roles: claims?.roles || ["user"], // fallback to 'user' if no roles
  };
}

export function getAzureAuth() {
  function useAzureAuth() {
    const [user, setUser] = useState<User | null>(null);

    // On mount, check if user is already signed in
    useEffect(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        setUser(mapAccountToUser(accounts[0]));
      }
      // Listen for login events
      const callbackId = msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const account = (event.payload as { account: AccountInfo }).account;
          setUser(mapAccountToUser(account));
        }
        if (event.eventType === EventType.LOGOUT_SUCCESS) {
          setUser(null);
        }
      });
      return () => {
        if (callbackId) msalInstance.removeEventCallback(callbackId);
      };
    }, []);

    const login = useCallback(() => {
      msalInstance.loginPopup({ scopes: ["openid", "profile", "email"] });
    }, []);

    const logout = useCallback(() => {
      msalInstance.logoutPopup();
    }, []);

    const isAuthenticated = useCallback(() => !!user, [user]);

    const hasRole = useCallback(
      (role: string) => {
        return user?.roles?.includes(role) ?? false;
      },
      [user]
    );

    return {
      user,
      login,
      logout,
      isAuthenticated,
      hasRole,
    };
  }
  return useAzureAuth();
}
