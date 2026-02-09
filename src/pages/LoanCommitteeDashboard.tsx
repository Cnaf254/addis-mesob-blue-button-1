// LoanCommitteeDashboard.tsx
// Copy of AdminDashboard with role and navigation adjusted for Loan Committee


import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { BarChart2, CheckCircle2, LayoutDashboard, ListChecks, LogOut, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Route, Routes, useLocation } from "react-router-dom";
import ApprovedLoans from "./loan-committee/ApprovedLoans";
import DashboardOverview from "./loan-committee/DashboardOverview";
import LoanCommitteeReports from "./loan-committee/LoanCommitteeReports";
import LoanReviews from "./loan-committee/LoanReviews";
import RejectedLoans from "./loan-committee/RejectedLoans";

const navigation = [
	{ name: "Dashboard", icon: LayoutDashboard, href: "/loan-committee", active: true },
	{ name: "Loan Reviews", icon: ListChecks, href: "/loan-committee/reviews", active: false },
	{ name: "Approved Loans", icon: CheckCircle2, href: "/loan-committee/approved", active: false },
	{ name: "Rejected Loans", icon: XCircle, href: "/loan-committee/rejected", active: false },
	{ name: "Reports", icon: BarChart2, href: "/loan-committee/reports", active: false },
];




const LoanCommitteeDashboard = () => {
	const location = useLocation();
	return (
		<SidebarProvider>
			<div className="min-h-screen bg-background flex">
				{/* Sidebar Navigation */}
				<Sidebar className="bg-sidebar text-sidebar-foreground">
					<SidebarHeader className="p-6 border-b border-sidebar-border">
						<Link to="/loan-committee" className="flex items-center gap-3">
							<img src={logo} alt="Addis Mesob" className="h-10 w-10" />
							<div>
								<span className="text-lg font-bold text-sidebar-foreground">Addis Mesob</span>
								<span className="block text-[9px] text-sidebar-foreground/60 uppercase tracking-widest">
									Loan Committee
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
											? 'bg-sidebar-primary text-sidebar-primary-foreground'
											: 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground')
									}
								>
									<item.icon className="h-5 w-5" />
									<span className="font-medium">{item.name}</span>
								</Link>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
					<SidebarFooter className="p-4 border-t border-sidebar-border">
						<Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent mb-2" asChild>
							<Link to="/dashboard">
								<LayoutDashboard className="h-5 w-5" />
								<span>Member Portal</span>
							</Link>
						</Button>
						<Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" >
							<LogOut className="h-5 w-5" />
							<span>Sign Out</span>
						</Button>
					</SidebarFooter>
				</Sidebar>
				{/* Main Content */}
				<div className="flex-1 flex flex-col min-h-screen p-4">
					<Routes>
						<Route path="/" element={<DashboardOverview />} />
						<Route path="/reviews" element={<LoanReviews />} />
						<Route path="/approved" element={<ApprovedLoans />} />
						<Route path="/rejected" element={<RejectedLoans />} />
						<Route path="/reports" element={<LoanCommitteeReports />} />
					</Routes>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default LoanCommitteeDashboard;
