import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();
  
    console.log('ProtectedRoute - User:', user, 'Loading:', loading);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!user) {
      console.log('No user, redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return <>{children}</>;
  };