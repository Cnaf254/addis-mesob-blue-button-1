import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Loan = Database['public']['Tables']['loans']['Row'];

export interface LoanWithMember extends Loan {
  member?: {
    member_number: string;
    user_id: string;
    profile?: {
      first_name: string;
      last_name: string;
      email: string;
    } | null;
  } | null;
}

export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const { data: loans, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;
      if (!loans) return [];

      // Get unique member IDs
      const memberIds = [...new Set(loans.map(l => l.member_id))];
      
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, member_number, user_id')
        .in('id', memberIds);

      if (membersError) throw membersError;

      // Get profiles for members
      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const result: LoanWithMember[] = loans.map(loan => {
        const member = members?.find(m => m.id === loan.member_id);
        const profile = member ? profiles?.find(p => p.id === member.user_id) : null;
        return {
          ...loan,
          member: member ? {
            member_number: member.member_number,
            user_id: member.user_id,
            profile: profile ? {
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
            } : null,
          } : null,
        };
      });

      return result;
    },
  });
};

export const useMemberLoans = (memberId: string | undefined) => {
  return useQuery({
    queryKey: ['loans', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return [];
      
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Loan[];
    },
    enabled: !!memberId,
  });
};

export const usePendingLoans = (approvalStage?: string) => {
  return useQuery({
    queryKey: ['loans', 'pending', approvalStage],
    queryFn: async () => {
      const { data: loans, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'pending_approval')
        .order('application_date', { ascending: false });

      if (loansError) throw loansError;
      if (!loans) return [];

      const memberIds = [...new Set(loans.map(l => l.member_id))];
      
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, member_number, user_id')
        .in('id', memberIds);

      if (membersError) throw membersError;

      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const result: LoanWithMember[] = loans.map(loan => {
        const member = members?.find(m => m.id === loan.member_id);
        const profile = member ? profiles?.find(p => p.id === member.user_id) : null;
        return {
          ...loan,
          member: member ? {
            member_number: member.member_number,
            user_id: member.user_id,
            profile: profile ? {
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
            } : null,
          } : null,
        };
      });

      return result;
    },
  });
};

export const useApprovedLoans = () => {
  return useQuery({
    queryKey: ['loans', 'approved'],
    queryFn: async () => {
      const { data: loans, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'approved')
        .order('approval_date', { ascending: false });

      if (loansError) throw loansError;
      if (!loans) return [];

      const memberIds = [...new Set(loans.map(l => l.member_id))];
      
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, member_number, user_id')
        .in('id', memberIds);

      if (membersError) throw membersError;

      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const result: LoanWithMember[] = loans.map(loan => {
        const member = members?.find(m => m.id === loan.member_id);
        const profile = member ? profiles?.find(p => p.id === member.user_id) : null;
        return {
          ...loan,
          member: member ? {
            member_number: member.member_number,
            user_id: member.user_id,
            profile: profile ? {
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
            } : null,
          } : null,
        };
      });

      return result;
    },
  });
};

export const useLoanStats = () => {
  return useQuery({
    queryKey: ['loans', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('status, principal_amount, remaining_balance');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        pending: data?.filter(l => l.status === 'pending_approval').length || 0,
        approved: data?.filter(l => l.status === 'approved').length || 0,
        disbursed: data?.filter(l => l.status === 'disbursed').length || 0,
        repaying: data?.filter(l => l.status === 'repaying').length || 0,
        completed: data?.filter(l => l.status === 'completed').length || 0,
        totalAmount: data?.reduce((sum, l) => sum + Number(l.principal_amount), 0) || 0,
        outstandingBalance: data?.filter(l => ['disbursed', 'repaying'].includes(l.status))
          .reduce((sum, l) => sum + Number(l.remaining_balance), 0) || 0,
      };

      return stats;
    },
  });
};

export const useApproveLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      loanId, 
      decision, 
      remarks,
      approverRole 
    }: { 
      loanId: string; 
      decision: 'approved' | 'rejected';
      remarks?: string;
      approverRole: Database['public']['Enums']['app_role'];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create approval record
      const { error: approvalError } = await supabase
        .from('loan_approvals')
        .insert({
          loan_id: loanId,
          approver_id: user.id,
          approver_role: approverRole,
          decision,
          remarks,
        });

      if (approvalError) throw approvalError;

      // Update loan status if rejected
      if (decision === 'rejected') {
        const { error: updateError } = await supabase
          .from('loans')
          .update({ status: 'rejected' })
          .eq('id', loanId);

        if (updateError) throw updateError;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
};
