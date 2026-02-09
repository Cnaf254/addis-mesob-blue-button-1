import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import StaffRoute from "@/components/StaffRoute";

// import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoanCommitteeDashboard from "./pages/LoanCommitteeDashboard";
import ChairpersonDashboard from "./pages/ChairpersonDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                
                  <Dashboard />
               
              } 
            />

  <Route 
              path="/loan-committee/*" 
              element={<LoanCommitteeDashboard />} 
            />
            <Route 
              path="/chairperson/*" 
              element={<ChairpersonDashboard />} 
            />
            <Route 
              path="/accountant/*" 
              element={<AccountantDashboard />} 
            />

            <Route 
              path="/dashboard/*" 
              element={
                
                  <Dashboard />
              
              } 
            />
           
            <Route 
              path="/admin" 
              element={
              
                  <AdminDashboard />
                
              } 
            />
         
            <Route 
              path="/admin/*" 
              element={
                
                  <AdminDashboard />
                
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
