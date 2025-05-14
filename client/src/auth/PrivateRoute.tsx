import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && !auth.hasRole(requiredRole)) {
    return <div>You do not have permission to view this page.</div>;
  }
  return <>{children}</>;
}
