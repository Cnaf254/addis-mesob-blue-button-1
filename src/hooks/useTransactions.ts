import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface TransactionWithMember extends Transaction {
  member?: {
    member_number: string;
    profile?: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
}

export const useTransactions = (limit?: number) => {
  return useQuery({
    queryKey: ['transactions', limit],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: transactions, error: transactionsError } = await query;

      if (transactionsError) throw transactionsError;
      if (!transactions) return [];

      const memberIds = [...new Set(transactions.map(t => t.member_id))];
      
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, member_number, user_id')
        .in('id', memberIds);

      if (membersError) throw membersError;

      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const result: TransactionWithMember[] = transactions.map(transaction => {
        const member = members?.find(m => m.id === transaction.member_id);
        const profile = member ? profiles?.find(p => p.id === member.user_id) : null;
        return {
          ...transaction,
          member: member ? {
            member_number: member.member_number,
            profile: profile ? {
              first_name: profile.first_name,
              last_name: profile.last_name,
            } : null,
          } : null,
        };
      });

      return result;
    },
  });
};

export const useMemberTransactions = (memberId: string | undefined, limit?: number) => {
  return useQuery({
    queryKey: ['transactions', 'member', memberId, limit],
    queryFn: async () => {
      if (!memberId) return [];
      
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!memberId,
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transactions', 'stats'],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data, error } = await supabase
        .from('transactions')
        .select('transaction_type, amount, created_at')
        .gte('created_at', startOfMonth);

      if (error) throw error;

      const stats = {
        monthlyDeposits: data?.filter(t => t.transaction_type === 'savings_deposit')
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        monthlyRepayments: data?.filter(t => t.transaction_type === 'loan_repayment')
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        monthlyDisbursements: data?.filter(t => t.transaction_type === 'loan_disbursement')
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        transactionCount: data?.length || 0,
      };

      return stats;
    },
  });
};
