import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const getRoleDashboardRoute = (roles: AppRole[]): string => {
  // Priority order for role-based routing
  if (roles.includes('admin')) return '/admin';
  if (roles.includes('chairperson')) return '/chairperson';
  if (roles.includes('management_committee')) return '/management';
  if (roles.includes('loan_committee')) return '/loan-committee';
  if (roles.includes('accountant')) return '/accountant';
  if (roles.includes('member')) return '/member';
  
  // Default fallback
  return '/member';
};

export const getRoleDisplayName = (role: AppRole): string => {
  const displayNames: Record<AppRole, string> = {
    admin: 'System Administrator',
    chairperson: 'Chairperson',
    management_committee: 'Management Committee',
    loan_committee: 'Loan Committee',
    accountant: 'Accountant',
    member: 'Member'
  };
  return displayNames[role] || role;
};

export const getAllRoles = (): AppRole[] => [
  'admin',
  'chairperson',
  'management_committee',
  'loan_committee',
  'accountant',
  'member'
];
