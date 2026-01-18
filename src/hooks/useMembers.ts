import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Member = Database['public']['Tables']['members']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface MemberWithProfile extends Member {
  profile?: Profile | null;
}

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;
      if (!members) return [];

      // Fetch profiles for these members
      const userIds = members.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine members with their profiles
      const result: MemberWithProfile[] = members.map(member => ({
        ...member,
        profile: profiles?.find(p => p.id === member.user_id) || null,
      }));

      return result;
    },
  });
};

export const useMember = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['member', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      return {
        ...member,
        profile,
      } as MemberWithProfile;
    },
    enabled: !!userId,
  });
};

export const usePendingMembers = () => {
  return useQuery({
    queryKey: ['members', 'pending'],
    queryFn: async () => {
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;
      if (!members) return [];

      const userIds = members.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const result: MemberWithProfile[] = members.map(member => ({
        ...member,
        profile: profiles?.find(p => p.id === member.user_id) || null,
      }));

      return result;
    },
  });
};

export const useMemberStats = () => {
  return useQuery({
    queryKey: ['members', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: data?.filter(m => m.status === 'active').length || 0,
        pending: data?.filter(m => m.status === 'pending').length || 0,
        suspended: data?.filter(m => m.status === 'suspended').length || 0,
      };

      return stats;
    },
  });
};
