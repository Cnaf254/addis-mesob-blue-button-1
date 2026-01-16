import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

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
            
            {/* Role-specific dashboards */}
            <Route path="/admin" element={<SystemAdminDashboard />} />
            <Route path="/admin/*" element={<SystemAdminDashboard />} />
            <Route path="/chairperson" element={<ChairpersonDashboard />} />
            <Route path="/chairperson/*" element={<ChairpersonDashboard />} />
            <Route path="/loan-committee" element={<LoanCommitteeDashboard />} />
            <Route path="/loan-committee/*" element={<LoanCommitteeDashboard />} />
            <Route path="/management" element={<ManagementCommitteeDashboard />} />
            <Route path="/management/*" element={<ManagementCommitteeDashboard />} />
            <Route path="/accountant" element={<AccountantDashboard />} />
            <Route path="/accountant/*" element={<AccountantDashboard />} />
            <Route path="/member" element={<MemberDashboard />} />
            <Route path="/member/*" element={<MemberDashboard />} />
            
            {/* Redirect old routes to login for role selection */}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />
            <Route path="/loan-application" element={<Navigate to="/member" replace />} />
            <Route path="/savings" element={<Navigate to="/member" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
