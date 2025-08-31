// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactElement;   
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  // If no token or role, or role is not allowed, redirect to login
  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
