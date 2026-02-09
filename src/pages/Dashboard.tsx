// MemberDashboard.tsx
// Dashboard adjusted for Member role

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
  FileText,
  PlusCircle,
  CreditCard,
  PiggyBank,
  Receipt,
  Bell,
  LogOut,
} from "lucide-react";

import { Link, Route, Routes, useLocation } from "react-router-dom";

// Member Pages
import MemberDashboardOverview from "./member/MemberDashboardOverview";
import MyLoans from "./member/MyLoans";
import ApplyLoan from "./member/ApplyLoan";
import Repayments from "./member/Repayments";
import Savings from "./member/Savings";
import Statements from "./member/Statements";
import Notifications from "./member/Notifications";

/* ================= NAVIGATION ================= */
const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Loans", icon: FileText, href: "/dashboard/loans" },
  { name: "Apply for Loan", icon: PlusCircle, href: "/dashboard/apply-loan" },
  { name: "Repayments", icon: CreditCard, href: "/dashboard/repayments" },
  { name: "Savings", icon: PiggyBank, href: "/dashboard/savings" },
  { name: "Statements", icon: Receipt, href: "/dashboard/statements" },
  { name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
];

const MemberDashboard = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar className="bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-6 border-b border-sidebar-border">
            <Link to="/member" className="flex items-center gap-3">
              <img src={logo} alt="Addis Mesob" className="h-10 w-10" />
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">
                  Addis Mesob
                </span>
                <span className="block text-[9px] text-sidebar-foreground/60 uppercase tracking-widest">
                  Member Portal
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
            <Route path="/" element={<MemberDashboardOverview />} />
            <Route path="/loans" element={<MyLoans />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/repayments" element={<Repayments />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/statements" element={<Statements />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberDashboard;
