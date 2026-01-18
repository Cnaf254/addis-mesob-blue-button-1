import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SavingsAccount = Database['public']['Tables']['savings_accounts']['Row'];

export interface SavingsWithMember extends SavingsAccount {
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

export const useSavingsAccounts = () => {
  return useQuery({
    queryKey: ['savings'],
    queryFn: async () => {
      const { data: savings, error: savingsError } = await supabase
        .from('savings_accounts')
        .select('*')
        .order('balance', { ascending: false });

      if (savingsError) throw savingsError;
      if (!savings) return [];

      const memberIds = [...new Set(savings.map(s => s.member_id))];
      
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

      const result: SavingsWithMember[] = savings.map(account => {
        const member = members?.find(m => m.id === account.member_id);
        const profile = member ? profiles?.find(p => p.id === member.user_id) : null;
        return {
          ...account,
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

export const useMemberSavings = (memberId: string | undefined) => {
  return useQuery({
    queryKey: ['savings', 'member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      
      const { data, error } = await supabase
        .from('savings_accounts')
        .select('*')
        .eq('member_id', memberId)
        .maybeSingle();

      if (error) throw error;
      return data as SavingsAccount | null;
    },
    enabled: !!memberId,
  });
};

export const useSavingsStats = () => {
  return useQuery({
    queryKey: ['savings', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_accounts')
        .select('balance, monthly_contribution, total_interest_earned');

      if (error) throw error;

      const stats = {
        totalBalance: data?.reduce((sum, s) => sum + Number(s.balance), 0) || 0,
        totalMonthlyContributions: data?.reduce((sum, s) => sum + Number(s.monthly_contribution), 0) || 0,
        totalInterestEarned: data?.reduce((sum, s) => sum + Number(s.total_interest_earned), 0) || 0,
        accountCount: data?.length || 0,
      };

      return stats;
    },
  });
};
