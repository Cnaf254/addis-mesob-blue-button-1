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
  BarChart3,
  AlertTriangle,
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
import { useLoanCommitteeDashboard } from '@/hooks/useDashboardData';
import { useSavingsAccounts } from '@/hooks/useSavings';
import { useLoans } from '@/hooks/useLoans';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { dummyLoans, dummySavingsAccounts, dashboardStats, formatCurrency, formatDate } from '@/data/dummyData';

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, href: '/loan-committee' },
  { name: 'Loan Evaluations', icon: Wallet, href: '/loan-committee/evaluations' },
  { name: 'Loan Analytics', icon: BarChart3, href: '/loan-committee/analytics' },
  { name: 'Reports', icon: FileText, href: '/loan-committee/reports' },
];

const switchPortals = [
  { name: 'Member Portal', href: '/member', icon: Users },
  { name: 'Admin Portal', href: '/admin', icon: Shield },
];

const LoanCommitteeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  const [isProcessing, setIsProcessing] = useState(false);

  const { profile, user } = useAuth();
  const { pendingLoans, loanStats, isLoading } = useLoanCommitteeDashboard();
  const { data: savingsAccounts } = useSavingsAccounts();
  const { data: allLoans } = useLoans();
  const { toast } = useToast();

  const isAuthenticated = !!user;

  const loanCommitteeUser = profile ? {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    role: 'loan_committee',
    avatarUrl: profile.avatar_url,
  } : {
    firstName: 'Kebede',
    lastName: 'Alemu',
    email: 'kebede@addismesob.com',
    role: 'loan_committee',
    avatarUrl: null,
  };

  const stats = isAuthenticated && loanStats ? {
    pendingLoanReviews: loanStats.pending,
    approvedThisMonth: loanStats.approved,
    rejectedThisMonth: 0,
    averageLoanAmount: loanStats.total > 0 ? loanStats.totalAmount / loanStats.total : 0,
  } : dashboardStats.loanCommittee;

  const statCards = [
    { title: 'Pending Evaluations', value: stats.pendingLoanReviews, icon: Clock, color: 'text-yellow-600' },
    { title: 'Approved This Month', value: stats.approvedThisMonth, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Rejected This Month', value: stats.rejectedThisMonth, icon: XCircle, color: 'text-red-600' },
    { title: 'Avg Loan Amount', value: formatCurrency(stats.averageLoanAmount), icon: Wallet, color: 'text-primary' },
  ];

  const displayPendingLoans = isAuthenticated && pendingLoans?.length
    ? pendingLoans.map(l => ({
        id: l.id,
        memberName: l.member?.profile ? `${l.member.profile.first_name} ${l.member.profile.last_name}` : 'Unknown',
        memberNumber: l.member?.member_number || 'N/A',
        loanType: l.loan_type,
        principalAmount: Number(l.principal_amount),
        termMonths: l.term_months,
        monthlyPayment: Number(l.monthly_payment),
        purpose: l.purpose || 'N/A',
        applicationDate: l.application_date,
        memberId: l.member_id,
      }))
    : dummyLoans.filter(l => l.status === 'pending_approval').map(l => ({
        id: l.id,
        memberName: l.memberName,
        memberNumber: l.memberNumber,
        loanType: l.loanType,
        principalAmount: l.principalAmount,
        termMonths: l.termMonths,
        monthlyPayment: l.monthlyPayment,
        purpose: l.purpose,
        applicationDate: l.applicationDate,
        memberId: null,
      }));

  const displayAllLoans = isAuthenticated && allLoans?.length
    ? allLoans.map(l => ({
        id: l.id,
        memberName: l.member?.profile ? `${l.member.profile.first_name} ${l.member.profile.last_name}` : 'Unknown',
        loanType: l.loan_type,
        principalAmount: Number(l.principal_amount),
        termMonths: l.term_months,
        status: l.status,
      }))
    : dummyLoans;

  const getMemberSavings = (memberId: string | null, memberNumber: string) => {
    if (isAuthenticated && savingsAccounts && memberId) {
      const savings = savingsAccounts.find(s => s.member_id === memberId);
      return Number(savings?.balance) || 0;
    }
    const savings = dummySavingsAccounts.find(s => s.memberNumber === memberNumber);
    return savings?.balance || 0;
  };

  const calculateEligibility = (loan: any) => {
    const savings = getMemberSavings(loan.memberId, loan.memberNumber);
    const maxEligible = savings * 3;
    const eligibilityPercent = Math.min((maxEligible / loan.principalAmount) * 100, 100);
    return { savings, maxEligible, eligibilityPercent };
  };

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
      <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Loan Committee" user={loanCommitteeUser} switchPortals={switchPortals}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Loan Committee" user={loanCommitteeUser} switchPortals={switchPortals}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loan Committee Dashboard</h1>
          <p className="text-muted-foreground">Evaluate loan applications and assess borrower eligibility</p>
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
            <TabsTrigger value="pending">
              Pending Evaluations
              {displayPendingLoans.length > 0 && <Badge variant="destructive" className="ml-2">{displayPendingLoans.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="all">All Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Loan Portfolio Analysis</CardTitle><CardDescription>Current loan distribution by type</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div><div className="flex justify-between mb-2"><span className="text-sm">Short-term Loans</span><span className="text-sm font-medium">45%</span></div><Progress value={45} className="h-2" /></div>
                    <div><div className="flex justify-between mb-2"><span className="text-sm">Long-term Loans</span><span className="text-sm font-medium">40%</span></div><Progress value={40} className="h-2" /></div>
                    <div><div className="flex justify-between mb-2"><span className="text-sm">Holiday Loans</span><span className="text-sm font-medium">15%</span></div><Progress value={15} className="h-2" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Risk Assessment Summary</CardTitle><CardDescription>Loan risk indicators</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /><span>Low Risk Applications</span></div>
                      <Badge className="bg-green-600">65%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-yellow-600" /><span>Medium Risk Applications</span></div>
                      <Badge className="bg-yellow-600">25%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3"><XCircle className="h-5 w-5 text-red-600" /><span>High Risk Applications</span></div>
                      <Badge variant="destructive">10%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Loans Awaiting Committee Evaluation</CardTitle><CardDescription>Review eligibility and make recommendations</CardDescription></CardHeader>
              <CardContent>
                {displayPendingLoans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" /><p>No pending loan evaluations</p></div>
                ) : (
                  <div className="space-y-4">
                    {displayPendingLoans.map((loan) => {
                      const eligibility = calculateEligibility(loan);
                      return (
                        <Card key={loan.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2"><h3 className="font-semibold">{loan.memberName}</h3><Badge variant="outline">{loan.memberNumber}</Badge></div>
                                  <p className="text-sm text-muted-foreground">Applied: {formatDate(loan.applicationDate)}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><p className="text-muted-foreground">Loan Type</p><p className="font-medium capitalize">{loan.loanType.replace('_', ' ')}</p></div>
                                <div><p className="text-muted-foreground">Requested Amount</p><p className="font-medium">{formatCurrency(loan.principalAmount)}</p></div>
                                <div><p className="text-muted-foreground">Term</p><p className="font-medium">{loan.termMonths} months</p></div>
                                <div><p className="text-muted-foreground">Monthly Payment</p><p className="font-medium">{formatCurrency(loan.monthlyPayment)}</p></div>
                              </div>

                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3">Eligibility Assessment</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                  <div><p className="text-muted-foreground">Member Savings</p><p className="font-medium">{formatCurrency(eligibility.savings)}</p></div>
                                  <div><p className="text-muted-foreground">Max Eligible (3x savings)</p><p className="font-medium">{formatCurrency(eligibility.maxEligible)}</p></div>
                                  <div>
                                    <p className="text-muted-foreground">Eligibility Score</p>
                                    <div className="flex items-center gap-2">
                                      <Progress value={eligibility.eligibilityPercent} className="h-2 flex-1" />
                                      <span className={`font-medium ${eligibility.eligibilityPercent >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>{eligibility.eligibilityPercent.toFixed(0)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button variant="outline"><Eye className="h-4 w-4 mr-2" />Full Details</Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovalAction(loan, 'approve')}><ThumbsUp className="h-4 w-4 mr-2" />Recommend Approval</Button>
                                <Button variant="destructive" onClick={() => handleApprovalAction(loan, 'reject')}><ThumbsDown className="h-4 w-4 mr-2" />Reject</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>All Loan Applications</CardTitle><CardDescription>View all loans in the system</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayAllLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{loan.memberName}</span>
                          <Badge variant="outline" className="capitalize">{loan.loanType.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatCurrency(loan.principalAmount)} • {loan.termMonths} months</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          loan.status === 'completed' ? 'default' :
                          loan.status === 'repaying' || loan.status === 'disbursed' ? 'secondary' :
                          loan.status === 'rejected' || loan.status === 'defaulted' ? 'destructive' : 'outline'
                        }>{loan.status.replace('_', ' ')}</Badge>
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogAction === 'approve' ? 'Recommend Approval' : 'Reject Application'}</DialogTitle>
              <DialogDescription>
                {dialogAction === 'approve' ? 'This will forward the loan to the Management Committee for final approval.' : 'This will reject the loan application. Please provide detailed reasons.'}
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
                {dialogAction === 'approve' ? 'Recommend' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default LoanCommitteeDashboard;
