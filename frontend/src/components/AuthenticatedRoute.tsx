import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import UserService from '@/service/AuthService';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (UserService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show the login/register page
  return <>{children}</>;
};

export default AuthenticatedRoute;
