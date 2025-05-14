import { useState } from "react";

import { User } from "@/types/user";

const mockUsers: User[] = [
  {
    id: 2,
    name: "Regular User",
    email: "user@mock.com",
    roles: ["user"],
  },
  {
    id: 1,
    name: "Admin User",
    email: "admin@mock.com",
    roles: ["admin", "user"],
  },
];

export function getMockAuth() {
  function useMockAuth() {
    const [user, setUser] = useState<User | null>(null);

    function login(role: "admin" | "user") {
      const found = mockUsers.find((u) => u.roles.includes(role)) || null;
      setUser(found);
    }

    function logout() {
      setUser(null);
    }

    function isAuthenticated() {
      return !!user;
    }

    function hasRole(role: string) {
      return !!user && user.roles.includes(role);
    }

    return {
      user,
      login,
      logout,
      isAuthenticated,
      hasRole,
    };
  }
  return useMockAuth();
}
