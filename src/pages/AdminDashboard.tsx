// AdminDashboard.tsx
// Admin layout using the same Sidebar system

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
  Settings,
  ShieldCheck,
  BarChart2,
  LogOut,
} from "lucide-react";

import { Link, Route, Routes, useLocation } from "react-router-dom";

// Admin Pages
import AdminDashboardOverview from "./admin/AdminDashboardOverview";
import UsersAndRoles from "./admin/UsersRoles";
import SystemSettings from "./admin/SystemSettings";
import AuditLogs from "./admin/AuditLogs";
import AdminReports from "./admin/AdminReports";

/* ================= NAVIGATION ================= */
const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Users & Roles", icon: Users, href: "/admin/users" },
  { name: "System Settings", icon: Settings, href: "/admin/settings" },
  { name: "Audit Logs", icon: ShieldCheck, href: "/admin/audit-logs" },
  { name: "Reports", icon: BarChart2, href: "/admin/reports" },
];

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar className="bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-6 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={logo} alt="Addis Mesob" className="h-10 w-10" />
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">
                  Addis Mesob
                </span>
                <span className="block text-[9px] text-sidebar-foreground/60 uppercase tracking-widest">
                  System Admin
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
            <Route path="/" element={<AdminDashboardOverview />} />
            <Route path="/users" element={<UsersAndRoles />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/reports" element={<AdminReports />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
