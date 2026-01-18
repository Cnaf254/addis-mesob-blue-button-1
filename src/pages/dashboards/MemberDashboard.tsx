import React from 'react';
import { LayoutDashboard, PiggyBank, Wallet, FileText, Users, Settings, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberDashboard } from '@/hooks/useDashboardData';
import { dummyTransactions, dummyLoans, dashboardStats, formatCurrency, formatDate } from '@/data/dummyData';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/member' },
  { name: 'Savings', icon: PiggyBank, href: '/member/savings' },
  { name: 'Loans', icon: Wallet, href: '/member/loans' },
  { name: 'Statements', icon: FileText, href: '/member/statements' },
  { name: 'Guarantors', icon: Users, href: '/member/guarantors' },
  { name: 'Profile', icon: Settings, href: '/member/profile' },
];

const MemberDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const { member, savings, activeLoan, transactions, guarantorStats, isLoading } = useMemberDashboard();

  const isAuthenticated = !!user;
  
  const memberUser = profile ? {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    role: 'member',
    avatarUrl: profile.avatar_url,
  } : {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@addismesob.com',
    role: 'member',
    avatarUrl: null,
  };

  const stats = isAuthenticated && savings ? {
    savingsBalance: Number(savings.balance) || 0,
    monthlyContribution: Number(savings.monthly_contribution) || 0,
    activeLoan: activeLoan ? Number(activeLoan.remaining_balance) : 0,
    monthlyPayment: activeLoan ? Number(activeLoan.monthly_payment) : 0,
    nextPaymentDate: activeLoan ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
    guaranteedAmount: guarantorStats?.totalGuaranteed || 0,
  } : dashboardStats.member;

  const displayTransactions = isAuthenticated && transactions?.length 
    ? transactions.map(t => ({
        id: t.id,
        type: t.transaction_type,
        amount: Number(t.amount),
        date: t.created_at,
        description: t.description || '',
      }))
    : dummyTransactions.filter(t => t.memberNumber === 'AM-2024-001').slice(0, 5).map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        date: t.date,
        description: t.description,
      }));

  const dummyActiveLoan = dummyLoans.find(l => l.memberNumber === 'AM-2024-001' && l.status === 'repaying');
  
  const displayLoan = isAuthenticated && activeLoan ? {
    loanType: activeLoan.loan_type,
    purpose: activeLoan.purpose || 'Loan',
    totalAmount: Number(activeLoan.total_amount),
    remainingBalance: Number(activeLoan.remaining_balance),
    monthlyPayment: Number(activeLoan.monthly_payment),
  } : dummyActiveLoan ? {
    loanType: dummyActiveLoan.loanType,
    purpose: dummyActiveLoan.purpose,
    totalAmount: dummyActiveLoan.totalAmount,
    remainingBalance: dummyActiveLoan.remainingBalance,
    monthlyPayment: dummyActiveLoan.monthlyPayment,
  } : null;

  const loanProgress = displayLoan 
    ? ((displayLoan.totalAmount - displayLoan.remainingBalance) / displayLoan.totalAmount) * 100
    : 0;

  if (isLoading && isAuthenticated) {
    return (
      <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Member Portal" user={memberUser}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Member Portal" user={memberUser}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {memberUser.firstName}!</h1>
            <p className="text-muted-foreground">
              {member?.member_number ? `Member #${member.member_number}` : 'Member #AM-2024-001'} • 
              {member?.status === 'active' ? ' Active' : member?.status === 'pending' ? ' Pending Approval' : ' Active since Jan 2024'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/member/savings"><PiggyBank className="h-4 w-4 mr-2" />Manage Savings</Link></Button>
            <Button asChild><Link to="/loan-application"><Plus className="h-4 w-4 mr-2" />Apply for Loan</Link></Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-green-700">Savings Balance</p><p className="text-2xl font-bold text-green-800">{formatCurrency(stats.savingsBalance)}</p></div>
                <PiggyBank className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-blue-700">Monthly Contribution</p><p className="text-2xl font-bold text-blue-800">{formatCurrency(stats.monthlyContribution)}</p></div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-orange-700">Active Loan</p><p className="text-2xl font-bold text-orange-800">{formatCurrency(stats.activeLoan)}</p></div>
                <Wallet className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-purple-700">Guaranteed Amount</p><p className="text-2xl font-bold text-purple-800">{formatCurrency(stats.guaranteedAmount)}</p></div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayLoan && (
            <Card>
              <CardHeader>
                <CardTitle>Active Loan</CardTitle>
                <CardDescription>{displayLoan.loanType.replace('_', ' ')} - {displayLoan.purpose}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm"><span>Repayment Progress</span><span className="font-medium">{loanProgress.toFixed(0)}%</span></div>
                <Progress value={loanProgress} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Remaining</p><p className="font-medium">{formatCurrency(displayLoan.remainingBalance)}</p></div>
                  <div><p className="text-muted-foreground">Monthly Payment</p><p className="font-medium">{formatCurrency(displayLoan.monthlyPayment)}</p></div>
                  <div><p className="text-muted-foreground">Next Payment</p><p className="font-medium">{stats.nextPaymentDate || 'N/A'}</p></div>
                  <div><p className="text-muted-foreground">Remaining Term</p><p className="font-medium">{Math.ceil(displayLoan.remainingBalance / displayLoan.monthlyPayment)} months</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link to="/member/statements">View All</Link></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayTransactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No transactions yet</p>
                ) : (
                  displayTransactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {t.type.includes('deposit') || t.type.includes('earned') ? 
                          <ArrowDownLeft className="h-5 w-5 text-green-600" /> : 
                          <ArrowUpRight className="h-5 w-5 text-red-600" />}
                        <div>
                          <p className="text-sm font-medium">{t.type.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${t.type.includes('deposit') || t.type.includes('earned') ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type.includes('deposit') || t.type.includes('earned') ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;
