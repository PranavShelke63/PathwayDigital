import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    // If user is authenticated, redirect them away from public pages
    // Check if there's a redirect state from ProtectedRoute
    const from = location.state?.from?.pathname;
    
    // If there's a "from" location and it's not the current page, redirect there
    // Otherwise use the default redirectTo
    const redirectPath = from && from !== location.pathname ? from : redirectTo;
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 