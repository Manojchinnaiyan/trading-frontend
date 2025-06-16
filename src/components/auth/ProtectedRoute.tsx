import React, { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import AuthPage from "../../pages/AuthPage";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that checks authentication status
 * and renders children only if user is authenticated
 *
 * @param children - Components to render if authenticated
 * @param fallback - Component to render if not authenticated (defaults to AuthPage)
 * @param requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <AuthPage />,
  requireAuth = true,
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // If authentication is not required or user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
