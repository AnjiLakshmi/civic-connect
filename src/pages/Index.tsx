import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, redirect to appropriate dashboard
  const dashboardRoutes: Record<string, string> = {
    citizen: '/citizen',
    admin: '/admin',
    bbmp: '/bbmp',
    bescom: '/bescom',
  };
  
  const redirectPath = dashboardRoutes[user?.role || 'citizen'] || '/citizen';
  return <Navigate to={redirectPath} replace />;
};

export default Index;
