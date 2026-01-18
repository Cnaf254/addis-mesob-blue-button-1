import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Shield,
  TrendingUp,
  Building2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePendingLoans, useLoanStats } from '@/hooks/useLoans';
import { useSavingsStats } from '@/hooks/useSavings';
import { useMemberStats } from '@/hooks/useMembers';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { dummyLoans, dashboardStats, formatCurrency, formatDate } from '@/data/dummyData';

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, href: '/management' },
  { name: 'Final Approvals', icon: Wallet, href: '/management/approvals' },
  { name: 'Operations', icon: Building2, href: '/management/operations' },
  { name: 'Strategic Reports', icon: TrendingUp, href: '/management/reports' },
  { name: 'Policy Settings', icon: FileText, href: '/management/policies' },
];

const switchPortals = [
  { name: 'Member Portal', href: '/member', icon: Users },
  { name: 'Admin Portal', href: '/admin', icon: Shield },
];

const ManagementCommitteeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  const [isProcessing, setIsProcessing] = useState(false);

  const { profile, user } = useAuth();
  const { data: pendingLoans, isLoading: loansLoading } = usePendingLoans();
  const { data: loanStats } = useLoanStats();
  const { data: savingsStats } = useSavingsStats();
  const { data: memberStats } = useMemberStats();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const isLoading = loansLoading;

  const managementUser = profile ? {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    role: 'management_committee',
    avatarUrl: profile.avatar_url,
  } : {
    firstName: 'Selam',
    lastName: 'Worku',
    email: 'selam@addismesob.com',
    role: 'management_committee',
    avatarUrl: null,
  };

  const displayPendingLoans = isAuthenticated && pendingLoans?.length
    ? pendingLoans.map(l => ({
        id: l.id,
        memberName: l.member?.profile ? `${l.member.profile.first_name} ${l.member.profile.last_name}` : 'Unknown',
        memberNumber: l.member?.member_number || 'N/A',
        loanType: l.loan_type,
        principalAmount: Number(l.principal_amount),
        interestRate: Number(l.interest_rate),
        termMonths: l.term_months,
        totalAmount: Number(l.total_amount),
        applicationDate: l.application_date,
      }))
    : dummyLoans.filter(l => l.status === 'pending_approval');

  const stats = isAuthenticated && loanStats ? {
    pendingFinalApprovals: loanStats.pending,
    approvedThisMonth: loanStats.approved,
    totalOperationalBudget: savingsStats?.totalBalance || 0,
    monthlyDisbursements: loanStats.totalAmount,
  } : dashboardStats.managementCommittee;

  const statCards = [
    { title: 'Pending Final Approvals', value: stats.pendingFinalApprovals, icon: Clock, color: 'text-yellow-600' },
    { title: 'Approved This Month', value: stats.approvedThisMonth, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Operational Budget', value: formatCurrency(stats.totalOperationalBudget), icon: Building2, color: 'text-primary' },
    { title: 'Monthly Disbursements', value: formatCurrency(stats.monthlyDisbursements), icon: TrendingUp, color: 'text-purple-600' },
  ];

  const handleApprovalAction = (loan: any, action: 'approve' | 'reject') => {
    setSelectedLoan(loan);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedLoan) return;
    setIsProcessing(true);

    try {
      const newStatus = dialogAction === 'approve' ? 'approved' : 'rejected';
      const { error } = await supabase
        .from('loans')
        .update({ 
          status: newStatus,
          approval_date: dialogAction === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', selectedLoan.id);

      if (error) throw error;

      toast({
        title: dialogAction === 'approve' ? 'Loan Approved!' : 'Loan Rejected',
        description: `The loan has been ${dialogAction}d successfully.`
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to process action'
      });
    } finally {
      setIsProcessing(false);
      setDialogOpen(false);
      setRemarks('');
      setSelectedLoan(null);
    }
  };

  if (isLoading && isAuthenticated) {
    return (
      <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Management Committee" user={managementUser} switchPortals={switchPortals}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Management Committee" user={managementUser} switchPortals={switchPortals}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Management Committee Dashboard</h1>
          <p className="text-muted-foreground">Final approval authority and operational oversight</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="approvals">
              Final Approvals
              {displayPendingLoans.length > 0 && <Badge variant="destructive" className="ml-2">{displayPendingLoans.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Cooperative Financial Health</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">96%</p>
                      <p className="text-sm text-muted-foreground">Loan Repayment Rate</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(savingsStats?.totalBalance || 12500000)}</p>
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(loanStats?.outstandingBalance || 8700000)}</p>
                      <p className="text-sm text-muted-foreground">Active Loans</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{memberStats?.active || 156}</p>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-yellow-600" />Attention Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium">{displayPendingLoans.length} Loans Pending</p>
                      <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium">3 Overdue Payments</p>
                      <p className="text-xs text-muted-foreground">Total: 45,000 Birr</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium">Monthly Report Due</p>
                      <p className="text-xs text-muted-foreground">Submit by month end</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Budget Utilization</CardTitle><CardDescription>Current fiscal period allocation</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div><div className="flex justify-between mb-2"><span className="text-sm">Loan Disbursements</span><span className="text-sm font-medium">72.5%</span></div><Progress value={72.5} className="h-3" /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-sm">Operational Expenses</span><span className="text-sm font-medium">75%</span></div><Progress value={75} className="h-3" /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-sm">Reserve Fund</span><span className="text-sm font-medium">83%</span></div><Progress value={83} className="h-3" /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Loans Awaiting Final Approval</CardTitle><CardDescription>These applications have passed all previous approval stages</CardDescription></CardHeader>
              <CardContent>
                {displayPendingLoans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" /><p>No pending final approvals</p></div>
                ) : (
                  <div className="space-y-4">
                    {displayPendingLoans.map((loan) => (
                      <Card key={loan.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{loan.memberName}</h3>
                                  <Badge variant="outline">{loan.memberNumber}</Badge>
                                  <Badge className="bg-green-100 text-green-700">Ready for Final Approval</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Applied: {formatDate(loan.applicationDate)}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div><p className="text-muted-foreground">Loan Type</p><p className="font-medium capitalize">{loan.loanType.replace('_', ' ')}</p></div>
                              <div><p className="text-muted-foreground">Principal</p><p className="font-medium">{formatCurrency(loan.principalAmount)}</p></div>
                              <div><p className="text-muted-foreground">Interest Rate</p><p className="font-medium">{loan.interestRate}%</p></div>
                              <div><p className="text-muted-foreground">Term</p><p className="font-medium">{loan.termMonths} months</p></div>
                              <div><p className="text-muted-foreground">Total Repayment</p><p className="font-medium">{formatCurrency(loan.totalAmount)}</p></div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-medium mb-3">Approval History</h4>
                              <div className="flex items-center gap-4 text-sm flex-wrap">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /><span>Chairperson</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /><span>Accountant</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /><span>Loan Committee</span></div>
                                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-600" /><span className="font-medium">Management (Pending)</span></div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button variant="outline"><Eye className="h-4 w-4 mr-2" />Full Application</Button>
                              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovalAction(loan, 'approve')}><ThumbsUp className="h-4 w-4 mr-2" />Grant Final Approval</Button>
                              <Button variant="destructive" onClick={() => handleApprovalAction(loan, 'reject')}><ThumbsDown className="h-4 w-4 mr-2" />Reject</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Policy Configuration</CardTitle><CardDescription>Current lending policies</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg"><span className="text-sm">Max Loan-to-Savings Ratio</span><Badge>3:1</Badge></div>
                    <div className="flex justify-between items-center p-3 border rounded-lg"><span className="text-sm">Minimum Membership Duration</span><Badge>6 months</Badge></div>
                    <div className="flex justify-between items-center p-3 border rounded-lg"><span className="text-sm">Required Guarantors</span><Badge>2 per loan</Badge></div>
                    <div className="flex justify-between items-center p-3 border rounded-lg"><span className="text-sm">Interest Rate - Short Term</span><Badge>8%</Badge></div>
                    <div className="flex justify-between items-center p-3 border rounded-lg"><span className="text-sm">Interest Rate - Long Term</span><Badge>10%</Badge></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Recent Committee Decisions</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1"><p className="text-sm font-medium">Approved: 200,000 Birr loan</p><p className="text-xs text-muted-foreground">Tigist H. - Vehicle Purchase</p></div>
                      <span className="text-xs text-muted-foreground">Dec 18</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1"><p className="text-sm font-medium">Policy Update Approved</p><p className="text-xs text-muted-foreground">Holiday loan limit increased</p></div>
                      <span className="text-xs text-muted-foreground">Dec 15</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div className="flex-1"><p className="text-sm font-medium">Rejected: High-risk loan</p><p className="text-xs text-muted-foreground">Insufficient collateral</p></div>
                      <span className="text-xs text-muted-foreground">Dec 10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogAction === 'approve' ? 'Grant Final Approval' : 'Reject Application'}</DialogTitle>
              <DialogDescription>
                {dialogAction === 'approve' ? 'This will grant final approval and forward the loan for disbursement.' : 'This will reject the loan application. Please provide detailed reasons.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Remarks</label>
                <Textarea placeholder="Enter your remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} className="mt-2" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={confirmAction}
                disabled={isProcessing}
                className={dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={dialogAction === 'reject' ? 'destructive' : 'default'}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {dialogAction === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManagementCommitteeDashboard;
