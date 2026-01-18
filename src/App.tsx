import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LoanApplication from "./pages/LoanApplication";

// Role-specific dashboards
import SystemAdminDashboard from "./pages/dashboards/SystemAdminDashboard";
import ChairpersonDashboard from "./pages/dashboards/ChairpersonDashboard";
import LoanCommitteeDashboard from "./pages/dashboards/LoanCommitteeDashboard";
import ManagementCommitteeDashboard from "./pages/dashboards/ManagementCommitteeDashboard";
import AccountantDashboard from "./pages/dashboards/AccountantDashboard";
import MemberDashboard from "./pages/dashboards/MemberDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected role-specific dashboards */}
            <Route path="/admin" element={<ProtectedRoute><SystemAdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute><SystemAdminDashboard /></ProtectedRoute>} />
            <Route path="/chairperson" element={<ProtectedRoute><ChairpersonDashboard /></ProtectedRoute>} />
            <Route path="/chairperson/*" element={<ProtectedRoute><ChairpersonDashboard /></ProtectedRoute>} />
            <Route path="/loan-committee" element={<ProtectedRoute><LoanCommitteeDashboard /></ProtectedRoute>} />
            <Route path="/loan-committee/*" element={<ProtectedRoute><LoanCommitteeDashboard /></ProtectedRoute>} />
            <Route path="/management" element={<ProtectedRoute><ManagementCommitteeDashboard /></ProtectedRoute>} />
            <Route path="/management/*" element={<ProtectedRoute><ManagementCommitteeDashboard /></ProtectedRoute>} />
            <Route path="/accountant" element={<ProtectedRoute><AccountantDashboard /></ProtectedRoute>} />
            <Route path="/accountant/*" element={<ProtectedRoute><AccountantDashboard /></ProtectedRoute>} />
            <Route path="/member" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
            <Route path="/member/*" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
            
            {/* Loan Application (protected) */}
            <Route path="/loan-application" element={<ProtectedRoute><LoanApplication /></ProtectedRoute>} />
            
            {/* Redirect old routes */}
            <Route path="/dashboard" element={<Navigate to="/member" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/member" replace />} />
            <Route path="/savings" element={<Navigate to="/member/savings" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
