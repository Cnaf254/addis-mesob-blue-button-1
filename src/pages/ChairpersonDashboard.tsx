// ChairpersonDashboard.tsx
// Sidebar-based dashboard adjusted for Chairperson role

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
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  BarChart2,
  Bell,
  LogOut,
} from "lucide-react";

import { Link, Route, Routes, useLocation } from "react-router-dom";

// Chairperson Pages
import ChairpersonDashboardOverview from "./chairperson/ChairpersonDashboardOverview";
import MembershipApprovals from "./chairperson/MembershipApprovals";
import LoanApplications from "./chairperson/LoanApplications";
import ApprovedRequests from "./chairperson/ApprovedRequests";
import RejectedRequests from "./chairperson/RejectedRequests";
import ChairpersonReports from "./chairperson/ChairpersonReports";
import ChairpersonNotifications from "./chairperson/ChairpersonNotifications";

/* ================= NAVIGATION ================= */
const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/chairperson" },
  { name: "Membership Approvals", icon: Users, href: "/chairperson/memberships" },
  { name: "Loan Applications", icon: FileText, href: "/chairperson/loans" },
  { name: "Approved Requests", icon: CheckCircle2, href: "/chairperson/approved" },
  { name: "Rejected Requests", icon: XCircle, href: "/chairperson/rejected" },
  { name: "Reports", icon: BarChart2, href: "/chairperson/reports" },
  { name: "Notifications", icon: Bell, href: "/chairperson/notifications" },
];

const ChairpersonDashboard = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar className="bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-6 border-b border-sidebar-border">
            <Link to="/chairperson" className="flex items-center gap-3">
              <img src={logo} alt="Addis Mesob" className="h-10 w-10" />
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">
                  Addis Mesob
                </span>
                <span className="block text-[9px] text-sidebar-foreground/60 uppercase tracking-widest">
                  Chairperson
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
            <Route path="/" element={<ChairpersonDashboardOverview />} />
            <Route path="/memberships" element={<MembershipApprovals />} />
            <Route path="/loans" element={<LoanApplications />} />
            <Route path="/approved" element={<ApprovedRequests />} />
            <Route path="/rejected" element={<RejectedRequests />} />
            <Route path="/reports" element={<ChairpersonReports />} />
            <Route path="/notifications" element={<ChairpersonNotifications />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChairpersonDashboard;
