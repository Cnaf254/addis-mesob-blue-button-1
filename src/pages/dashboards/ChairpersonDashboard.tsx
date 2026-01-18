import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useChairpersonDashboard } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { dummyMembers, dummyLoans, dashboardStats, formatCurrency, formatDate } from '@/data/dummyData';

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, href: '/chairperson' },
  { name: 'Member Approvals', icon: Users, href: '/chairperson/members' },
  { name: 'Loan Reviews', icon: Wallet, href: '/chairperson/loans' },
  { name: 'Reports', icon: FileText, href: '/chairperson/reports' },
];

const switchPortals = [
  { name: 'Member Portal', href: '/member', icon: Users },
  { name: 'Admin Portal', href: '/admin', icon: Shield },
];

const ChairpersonDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { profile, user } = useAuth();
  const { pendingMembers, pendingLoans, isLoading } = useChairpersonDashboard();
  const { toast } = useToast();

  const isAuthenticated = !!user;

  const chairpersonUser = profile ? {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    role: 'chairperson',
    avatarUrl: profile.avatar_url,
  } : {
    firstName: 'Fikadu',
    lastName: 'Tadesse',
    email: 'fikadu@addismesob.com',
    role: 'chairperson',
    avatarUrl: null,
  };

  const displayPendingMembers = isAuthenticated && pendingMembers?.length
    ? pendingMembers.map(m => ({
        id: m.id,
        firstName: m.profile?.first_name || '',
        lastName: m.profile?.last_name || '',
        employer: m.employer || 'N/A',
        department: m.department || 'N/A',
        monthlySalary: Number(m.monthly_salary) || 0,
        joinDate: m.created_at,
      }))
    : dummyMembers.filter(m => m.status === 'pending');

  const displayPendingLoans = isAuthenticated && pendingLoans?.length
    ? pendingLoans.map(l => ({
        id: l.id,
        memberName: l.member?.profile ? `${l.member.profile.first_name} ${l.member.profile.last_name}` : 'Unknown',
        memberNumber: l.member?.member_number || 'N/A',
        loanType: l.loan_type,
        principalAmount: Number(l.principal_amount),
        termMonths: l.term_months,
        purpose: l.purpose || 'N/A',
        applicationDate: l.application_date,
        guarantors: [],
      }))
    : dummyLoans.filter(l => l.status === 'pending_approval');

  const stats = {
    pendingMemberApprovals: displayPendingMembers.length,
    pendingLoanReviews: displayPendingLoans.length,
    approvedThisMonth: dashboardStats.chairperson.approvedThisMonth,
    rejectedThisMonth: dashboardStats.chairperson.rejectedThisMonth,
  };

  const statCards = [
    { title: 'Pending Member Approvals', value: stats.pendingMemberApprovals, icon: Users, color: 'text-yellow-600' },
    { title: 'Pending Loan Reviews', value: stats.pendingLoanReviews, icon: Wallet, color: 'text-blue-600' },
    { title: 'Approved This Month', value: stats.approvedThisMonth, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Rejected This Month', value: stats.rejectedThisMonth, icon: XCircle, color: 'text-red-600' },
  ];

  const handleApprovalAction = (item: any, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    
    try {
      if (selectedItem.firstName) {
        // Member approval
        const newStatus = dialogAction === 'approve' ? 'active' : 'suspended';
        const { error } = await supabase
          .from('members')
          .update({ 
            status: newStatus,
            approved_by: user?.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', selectedItem.id);

        if (error) throw error;
      } else {
        // Loan approval
        const newStatus = dialogAction === 'approve' ? 'approved' : 'rejected';
        const { error } = await supabase
          .from('loans')
          .update({ 
            status: newStatus,
            approval_date: dialogAction === 'approve' ? new Date().toISOString() : null
          })
          .eq('id', selectedItem.id);

        if (error) throw error;
      }

      toast({
        title: dialogAction === 'approve' ? 'Approved!' : 'Rejected',
        description: `The ${selectedItem.firstName ? 'member' : 'loan'} has been ${dialogAction}d.`
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
      setSelectedItem(null);
    }
  };

  if (isLoading && isAuthenticated) {
    return (
      <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Chairperson" user={chairpersonUser} switchPortals={switchPortals}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={navigation} portalName="Addis Mesob" portalSubtitle="Chairperson" user={chairpersonUser} switchPortals={switchPortals}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chairperson Dashboard</h1>
          <p className="text-muted-foreground">Review and approve member registrations and loan applications</p>
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
            <TabsTrigger value="members">
              Member Approvals
              {displayPendingMembers.length > 0 && <Badge variant="destructive" className="ml-2">{displayPendingMembers.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="loans">
              Loan Reviews
              {displayPendingLoans.length > 0 && <Badge variant="destructive" className="ml-2">{displayPendingLoans.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-yellow-600" />Pending Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3"><Users className="h-5 w-5 text-yellow-600" /><span>Member Applications</span></div>
                      <Badge variant="secondary">{displayPendingMembers.length} pending</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3"><Wallet className="h-5 w-5 text-blue-600" /><span>Loan Applications</span></div>
                      <Badge variant="secondary">{displayPendingLoans.length} pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Recent Decisions</CardTitle><CardDescription>Your latest approval actions</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1"><p className="text-sm font-medium">Approved loan for Tigist H.</p><p className="text-xs text-muted-foreground">2 hours ago</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1"><p className="text-sm font-medium">Approved member Abebe K.</p><p className="text-xs text-muted-foreground">Yesterday</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Pending Member Applications</CardTitle><CardDescription>Review and approve new membership requests</CardDescription></CardHeader>
              <CardContent>
                {displayPendingMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" /><p>No pending member applications</p></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Name</TableHead><TableHead>Employer</TableHead><TableHead>Department</TableHead><TableHead>Monthly Salary</TableHead><TableHead>Applied On</TableHead><TableHead>Actions</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayPendingMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.firstName} {member.lastName}</TableCell>
                          <TableCell>{member.employer}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{formatCurrency(member.monthlySalary)}</TableCell>
                          <TableCell>{formatDate(member.joinDate)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovalAction(member, 'approve')}><ThumbsUp className="h-4 w-4" /></Button>
                              <Button size="sm" variant="destructive" onClick={() => handleApprovalAction(member, 'reject')}><ThumbsDown className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Loan Applications Awaiting Review</CardTitle><CardDescription>First-level review for loan applications</CardDescription></CardHeader>
              <CardContent>
                {displayPendingLoans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" /><p>No pending loan reviews</p></div>
                ) : (
                  <div className="space-y-4">
                    {displayPendingLoans.map((loan) => (
                      <Card key={loan.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{loan.memberName}</h3>
                                <Badge variant="outline">{loan.memberNumber}</Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><p className="text-muted-foreground">Loan Type</p><p className="font-medium capitalize">{loan.loanType.replace('_', ' ')}</p></div>
                                <div><p className="text-muted-foreground">Amount</p><p className="font-medium">{formatCurrency(loan.principalAmount)}</p></div>
                                <div><p className="text-muted-foreground">Term</p><p className="font-medium">{loan.termMonths} months</p></div>
                                <div><p className="text-muted-foreground">Purpose</p><p className="font-medium">{loan.purpose}</p></div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline"><Eye className="h-4 w-4 mr-2" />Details</Button>
                              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovalAction(loan, 'approve')}><ThumbsUp className="h-4 w-4 mr-2" />Approve</Button>
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
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}</DialogTitle>
              <DialogDescription>
                {dialogAction === 'approve' ? 'This will forward the application to the next stage.' : 'This will reject the application. Please provide a reason.'}
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

export default ChairpersonDashboard;
