// Admin API endpoints
import apiClient from './client';

// ==================== TYPES ====================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  rolesCount: number;
  suspendedUsers: number;
}

export interface SystemStatus {
  bankApiStatus: 'connected' | 'disconnected' | 'error';
  lastBackup: string;
  lastLoginActivity: string;
}

export interface SecurityAlert {
  failedLoginAttempts: number;
  roleChangesRecent: number;
  lockedAccounts: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone?: string;
  role: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone?: string;
  alternate_phone?: string;
  gender?: string;
  dob?: string;
  national_id?: string;
  marital_status?: string;
  employee_id?: string;
  department?: string;
  occupation?: string;
  academic_level?: string;
  work_experience?: string;
  monthly_income?: number;
  monthly_saving_amount?: number;
  share_count?: number;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  emergency_contact_city?: string;
  emergency_contact_region?: string;
  heir_name?: string;
  heir_relationship?: string;
  heir_phone?: string;
  heir_city?: string;
  heir_region?: string;
  heir_share_percent?: number;
  referred_by?: string;
}

export interface UpdateUserPayload {
  role?: string;
  status?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  user_id: string;
  role: string;
  action: string;
  entity: string;
  entity_id?: string;
  ip_address: string;
  details?: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  user_id?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
}

export interface SystemSettings {
  system_name: string;
  default_language: string;
  date_format: string;
  currency_format: string;
  loan_types: string[];
  interest_rates: Record<string, number>;
  max_loan_limit: number;
  required_guarantor_count: number;
  approval_steps_enabled: boolean;
  approval_order: 'fixed' | 'admin_controlled';
  bank_api_key?: string;
  sms_service?: string;
  email_service?: string;
}

export interface Report {
  id: string;
  type: string;
  description: string;
  generated_at?: string;
}

export interface ReportExportParams {
  type: string;
  format: 'pdf' | 'excel';
  start_date?: string;
  end_date?: string;
}

// ==================== API FUNCTIONS ====================

// Dashboard
export const fetchDashboardStats = () => 
  apiClient.get<DashboardStats>('/admin/dashboard/stats');

export const fetchSystemStatus = () => 
  apiClient.get<SystemStatus>('/admin/dashboard/system-status');

export const fetchSecurityAlerts = () => 
  apiClient.get<SecurityAlert>('/admin/dashboard/security-alerts');

// Users
export const fetchUsers = (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => 
  apiClient.get<{ users: User[]; total: number }>('/admin/users', params);

export const fetchUser = (id: string) => 
  apiClient.get<User>(`/admin/users/${id}`);

export const createUser = (data: CreateUserPayload) => 
  apiClient.post<User>('/admin/users', data);

export const updateUser = (id: string, data: UpdateUserPayload) => 
  apiClient.patch<User>(`/admin/users/${id}`, data);

export const deleteUser = (id: string) => 
  apiClient.delete<{ success: boolean }>(`/admin/users/${id}`);

export const updateUserRole = (id: string, role: string) => 
  apiClient.patch<User>(`/admin/users/${id}/role`, { role });

export const updateUserStatus = (id: string, status: string) => 
  apiClient.patch<User>(`/admin/users/${id}/status`, { status });

// Audit Logs
export const fetchAuditLogs = (filters?: AuditLogFilters) => {
  const params: Record<string, string | number | boolean> = {};
  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;
  if (filters?.user_id) params.user_id = filters.user_id;
  if (filters?.action) params.action = filters.action;
  if (filters?.start_date) params.start_date = filters.start_date;
  if (filters?.end_date) params.end_date = filters.end_date;
  return apiClient.get<{ logs: AuditLog[]; total: number }>('/admin/audit-logs', params);
};

// System Settings
export const fetchSystemSettings = () => 
  apiClient.get<SystemSettings>('/admin/settings');

export const updateSystemSettings = (data: Partial<SystemSettings>) => 
  apiClient.put<SystemSettings>('/admin/settings', data);

// Reports
export const fetchReportTypes = () => 
  apiClient.get<Report[]>('/admin/reports/types');

export const generateReport = (params: ReportExportParams) => 
  apiClient.post<{ url: string }>('/admin/reports/generate', params);

export const exportReport = async (params: ReportExportParams): Promise<Blob> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/admin/reports/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    throw new Error('Failed to export report');
  }
  
  return response.blob();
};
