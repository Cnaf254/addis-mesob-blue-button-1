// AccountantDashboard.tsx
// Sidebar-based dashboard adjusted for Accountant role

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  PiggyBank,
  CreditCard,
  RefreshCcw,
  BarChart2,
  Bell,
  LogOut,
} from "lucide-react";

import { Link, Route, Routes, useLocation } from "react-router-dom";

// Accountant Pages
import AccountantDashboardOverview from "./accountant/AccountantDashboardOverview";
import SavingsManagement from "./accountant/SavingsManagement";
import LoanPayments from "./accountant/LoanPayments";
import PaymentReconciliation from "./accountant/PaymentReconciliation";
import AccountantReports from "./accountant/AccountantReports";
import AccountantNotifications from "./accountant/AccountantNotifications";

/* ================= NAVIGATION ================= */
const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/accountant" },
  { name: "Savings", icon: PiggyBank, href: "/accountant/savings" },
  { name: "Loan Payments", icon: CreditCard, href: "/accountant/loan-payments" },
  { name: "Reconciliation", icon: RefreshCcw, href: "/accountant/reconciliation" },
  { name: "Reports", icon: BarChart2, href: "/accountant/reports" },
  { name: "Notifications", icon: Bell, href: "/accountant/notifications" },
];

const AccountantDashboard = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar className="bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-6 border-b border-sidebar-border">
            <Link to="/accountant" className="flex items-center gap-3">
              <img src={logo} alt="Addis Mesob" className="h-10 w-10" />
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">
                  Addis Mesob
                </span>
                <span className="block text-[9px] text-sidebar-foreground/60 uppercase tracking-widest">
                  Accountant
                </span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarMenu className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <Link
                  to={item.href}
                  className={
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
                    (location.pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground")
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen p-4">
          <Routes>
            <Route path="/" element={<AccountantDashboardOverview />} />
            <Route path="/savings" element={<SavingsManagement />} />
            <Route path="/loan-payments" element={<LoanPayments />} />
            <Route path="/reconciliation" element={<PaymentReconciliation />} />
            <Route path="/reports" element={<AccountantReports />} />
            <Route path="/notifications" element={<AccountantNotifications />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountantDashboard;
