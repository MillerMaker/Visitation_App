import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { isTokenExpired } from '../services/authenticationServices';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { authState } = useAuth();
  const { logout } = useAuth();

    React.useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }

      const expired = await isTokenExpired(token);
      if (expired) {
        logout();
      }
    };

    checkToken();
  }, [logout]);

  console.log("authstate: " + authState);
  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;