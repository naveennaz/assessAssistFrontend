import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Unauthorized from './Unauthorized';

interface PermissionRouteProps {
  permission: string;
  children: React.ReactNode;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({
  permission,
  children,
}) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default PermissionRoute;
