// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '@/services/mockApi';

interface ProtectedRouteProps {
  allowedRoles: ('waiter' | 'patron')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a different page based on role if needed, or a generic unauthorized page
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
