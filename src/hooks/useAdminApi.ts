// React Query hooks for Admin API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchDashboardStats,
  fetchSystemStatus,
  fetchSecurityAlerts,
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus,
  fetchAuditLogs,
  fetchSystemSettings,
  updateSystemSettings,
  fetchReportTypes,
  generateReport,
  exportReport,
  type CreateUserPayload,
  type UpdateUserPayload,
  type AuditLogFilters,
  type SystemSettings,
  type ReportExportParams,
} from '@/lib/api/admin';

// ==================== DASHBOARD HOOKS ====================

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });
};

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'system-status'],
    queryFn: fetchSystemStatus,
  });
};

export const useSecurityAlerts = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'security-alerts'],
    queryFn: fetchSecurityAlerts,
  });
};

// ==================== USER HOOKS ====================

export const useUsers = (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => fetchUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserPayload) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
    },
  });
};

// ==================== AUDIT LOG HOOKS ====================

export const useAuditLogs = (filters?: AuditLogFilters) => {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: () => fetchAuditLogs(filters),
  });
};

// ==================== SETTINGS HOOKS ====================

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: fetchSystemSettings,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) => updateSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
};

// ==================== REPORT HOOKS ====================

export const useReportTypes = () => {
  return useQuery({
    queryKey: ['admin', 'reports', 'types'],
    queryFn: fetchReportTypes,
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (params: ReportExportParams) => generateReport(params),
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: (params: ReportExportParams) => exportReport(params),
  });
};
