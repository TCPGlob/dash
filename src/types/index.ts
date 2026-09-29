export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  lastActiveAt: string | null;
  department: string;
  createdAt: string;
  mfaEnabled: boolean;
  twoFactorStatus?: 'enabled' | 'disabled';
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  page: number;
  pageSize: number;
  sort: string;
  lastActiveFilter?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  cursor?: string;
}

export type ProjectStatus = 'active' | 'planning' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  membersCount: number;
  budget: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorEmail: string;
  actorAvatar: string;
  target: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failed';
  details: string;
}
