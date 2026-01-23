import { useAuth } from '../providers/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { authState } = useAuth();
  console.log("authstate: " + authState);
  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;