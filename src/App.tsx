import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import './i18n';
import LoginPage from "./pages/LoginPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import ReportIssuePage from "./pages/citizen/ReportIssuePage";
import MyComplaintsPage from "./pages/citizen/MyComplaintsPage";
import NotificationsPage from "./pages/citizen/NotificationsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const routes: Record<string, string> = { citizen: '/citizen', admin: '/admin', bbmp: '/bbmp', bescom: '/bescom' };
  return <Navigate to={routes[user!.role]} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Citizen routes */}
            <Route path="/citizen" element={<ProtectedRoute allowedRole="citizen"><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/report" element={<ProtectedRoute allowedRole="citizen"><ReportIssuePage /></ProtectedRoute>} />
            <Route path="/citizen/complaints" element={<ProtectedRoute allowedRole="citizen"><MyComplaintsPage /></ProtectedRoute>} />
            <Route path="/citizen/notifications" element={<ProtectedRoute allowedRole="citizen"><NotificationsPage /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            
            {/* Department routes */}
            <Route path="/bbmp" element={<ProtectedRoute allowedRole="bbmp"><DepartmentDashboard deptName="BBMP" /></ProtectedRoute>} />
            <Route path="/bescom" element={<ProtectedRoute allowedRole="bescom"><DepartmentDashboard deptName="BESCOM" /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
