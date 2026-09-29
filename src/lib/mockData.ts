import { User, UserRole, UserStatus, Project, AuditLog } from '../types';

// Deterministic high-quality avatars with public local fallbacks
const AVATAR_SEEDS = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
];

const FIRST_NAMES = [
  'Jane', 'Marcus', 'Priya', 'Alex', 'Liam', 'Olivia', 'Noah', 'Emma',
  'Oliver', 'Sophia', 'Elijah', 'Isabella', 'William', 'Mia', 'James',
  'Evelyn', 'Benjamin', 'Harper', 'Lucas', 'Camila', 'Henry', 'Gianna',
  'Alexander', 'Abigail', 'Sebastian', 'Luna', 'Jack', 'Ella', 'Owen',
  'Avery', 'Daniel', 'Mila', 'Matthew', 'Aria', 'Samuel', 'Scarlett',
  'David', 'Penelope', 'Joseph', 'Chloe', 'Carter', 'Layla', 'Julian'
];

const LAST_NAMES = [
  'Cooper', 'Reed', 'Shah', 'Morgan', 'Smith', 'Johnson', 'Williams',
  'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen'
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Customer Success', 'Security', 'Operations', 'Finance', 'People & HR'
];

function generateUsers(count: number = 1247): User[] {
  const users: User[] = [];
  const now = new Date();

  // Curated first 3 matching user prompt
  users.push({
    id: 'user-1',
    name: 'Jane Cooper',
    email: 'jane@acme.com',
    avatarUrl: AVATAR_SEEDS[0],
    role: 'admin',
    status: 'active',
    lastActiveAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 min ago
    department: 'Engineering',
    createdAt: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    mfaEnabled: true,
  });

  users.push({
    id: 'user-2',
    name: 'Marcus Reed',
    email: 'marcus@acme.com',
    avatarUrl: AVATAR_SEEDS[1],
    role: 'editor',
    status: 'invited',
    lastActiveAt: null,
    department: 'Product',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mfaEnabled: false,
  });

  users.push({
    id: 'user-3',
    name: 'Priya Shah',
    email: 'priya@acme.com',
    avatarUrl: AVATAR_SEEDS[2],
    role: 'viewer',
    status: 'suspended',
    lastActiveAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    department: 'Marketing',
    createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    mfaEnabled: true,
  });

  // Generate remaining users
  for (let i = 4; i <= count; i++) {
    const fn = FIRST_NAMES[(i * 7 + 3) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 11 + 5) % LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i > 100 ? i : ''}@acme.com`;
    const avatarUrl = AVATAR_SEEDS[(i + fn.length) % AVATAR_SEEDS.length];

    // Distribution: 15% admin, 45% editor, 40% viewer
    const roleDice = (i * 13) % 100;
    const role: UserRole = roleDice < 15 ? 'admin' : roleDice < 60 ? 'editor' : 'viewer';

    // Distribution: 75% active, 15% invited, 10% suspended
    const statusDice = (i * 19) % 100;
    const status: UserStatus = statusDice < 75 ? 'active' : statusDice < 90 ? 'invited' : 'suspended';

    // Last active time
    let lastActiveAt: string | null = null;
    if (status !== 'invited') {
      // spread between 5 mins ago and 90 days ago
      const minutesAgo = (i * 123) % (90 * 24 * 60);
      lastActiveAt = new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString();
    }

    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const daysAgoCreated = 30 + ((i * 37) % 700);

    users.push({
      id: `user-${i}`,
      name,
      email,
      avatarUrl,
      role,
      status,
      lastActiveAt,
      department: dept,
      createdAt: new Date(now.getTime() - daysAgoCreated * 24 * 60 * 60 * 1000).toISOString(),
      mfaEnabled: (i % 3) === 0,
    });
  }

  return users;
}

// In-memory persistent database store
let USERS_DB: User[] = generateUsers(1247);

// Configurable simulated network settings
export const networkConfig = {
  latencyMs: 85, // 85ms fast server response
  simulateFailure: false, // For testing optimistic rollback
};

export function setNetworkLatency(ms: number) {
  networkConfig.latencyMs = ms;
}

export function setSimulateFailure(fail: boolean) {
  networkConfig.simulateFailure = fail;
}

export function resetUsersDatabase() {
  USERS_DB = generateUsers(1247);
}

// Simulated API server query
export async function queryUsersServer(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  preset?: string;
}): Promise<{
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  serverDurationMs: number;
}> {
  const startTime = performance.now();

  // Simulate network roundtrip
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }

  if (networkConfig.simulateFailure) {
    throw new Error('Internal Server Error (500) - Simulated network/database rejection');
  }

  let filtered = [...USERS_DB];
  const search = (params.search || '').trim().toLowerCase();
  const role = params.role || 'all';
  const status = params.status || 'all';
  const preset = params.preset;
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 25);
  const sort = params.sort || 'name:asc';

  // Apply Presets
  if (preset === 'admins') {
    filtered = filtered.filter((u) => u.role === 'admin');
  } else if (preset === 'invited') {
    filtered = filtered.filter((u) => u.status === 'invited');
  } else if (preset === 'inactive_30d') {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((u) => {
      if (!u.lastActiveAt) return true; // never active
      return new Date(u.lastActiveAt).getTime() < thirtyDaysAgo;
    });
  } else if (preset === 'active_members') {
    filtered = filtered.filter((u) => u.status === 'active');
  }

  // Filter by Role
  if (role !== 'all' && !preset) {
    filtered = filtered.filter((u) => u.role.toLowerCase() === role.toLowerCase());
  }

  // Filter by Status
  if (status !== 'all' && !preset) {
    filtered = filtered.filter((u) => u.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by Search (name, email, department, or role)
  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search) ||
        u.role.toLowerCase().includes(search)
    );
  }

  // Sorting
  const [sortField, sortDir] = sort.split(':');
  const isAsc = sortDir !== 'desc';

  filtered.sort((a, b) => {
    let valA: any = '';
    let valB: any = '';

    if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortField === 'role') {
      valA = a.role;
      valB = b.role;
    } else if (sortField === 'status') {
      valA = a.status;
      valB = b.status;
    } else if (sortField === 'lastActiveAt') {
      valA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
      valB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
    } else if (sortField === 'department') {
      valA = a.department;
      valB = b.department;
    }

    if (valA < valB) return isAsc ? -1 : 1;
    if (valA > valB) return isAsc ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const pageUsers = filtered.slice(startIndex, startIndex + pageSize);

  const endTime = performance.now();

  return {
    users: pageUsers,
    total,
    page,
    pageSize,
    totalPages,
    serverDurationMs: Math.round(endTime - startTime),
  };
}

// Server mutation simulation: update single user
export async function updateUserServer(id: string, patch: Partial<User>): Promise<User> {
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }
  if (networkConfig.simulateFailure) {
    throw new Error('Failed to update user: 503 Service Unavailable');
  }

  const index = USERS_DB.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error(`User with ID ${id} not found.`);
  }

  USERS_DB[index] = { ...USERS_DB[index], ...patch };
  return USERS_DB[index];
}

// Bulk update users
export async function bulkUpdateUsersServer(
  ids: string[],
  patch: Partial<User>
): Promise<{ updatedCount: number }> {
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }
  if (networkConfig.simulateFailure) {
    throw new Error('Failed to execute bulk operation');
  }

  const idSet = new Set(ids);
  let count = 0;
  USERS_DB = USERS_DB.map((u) => {
    if (idSet.has(u.id)) {
      count++;
      return { ...u, ...patch };
    }
    return u;
  });

  return { updatedCount: count };
}

// Bulk delete users
export async function bulkDeleteUsersServer(ids: string[]): Promise<{ deletedCount: number }> {
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }
  if (networkConfig.simulateFailure) {
    throw new Error('Failed to delete users');
  }

  const idSet = new Set(ids);
  const initialLen = USERS_DB.length;
  USERS_DB = USERS_DB.filter((u) => !idSet.has(u.id));
  return { deletedCount: initialLen - USERS_DB.length };
}

// Delete single user
export async function deleteUserServer(id: string): Promise<boolean> {
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }
  if (networkConfig.simulateFailure) {
    throw new Error('Failed to delete user');
  }
  USERS_DB = USERS_DB.filter((u) => u.id !== id);
  return true;
}

// Invite new user
export async function inviteUserServer(payload: {
  name: string;
  email: string;
  role: UserRole;
  department: string;
}): Promise<User> {
  if (networkConfig.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, networkConfig.latencyMs));
  }
  if (networkConfig.simulateFailure) {
    throw new Error('Failed to send invitation');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    avatarUrl: AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)],
    role: payload.role,
    status: 'invited',
    lastActiveAt: null,
    department: payload.department,
    createdAt: new Date().toISOString(),
    mfaEnabled: false,
  };

  USERS_DB.unshift(newUser);
  return newUser;
}

// Demo Projects for showing reuse of DataTable & TableToolbar
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Pulse Cloud Migration',
    code: 'PCM-101',
    description: 'Transitioning multi-tenant database clusters to distributed Aurora.',
    status: 'active',
    owner: 'Jane Cooper',
    membersCount: 14,
    budget: '$180,000',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Global Auth & SSO',
    code: 'GAS-204',
    description: 'SAML 2.0 and OIDC Enterprise federated authentication integration.',
    status: 'active',
    owner: 'Alex Morgan',
    membersCount: 8,
    budget: '$95,000',
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'proj-3',
    name: 'Mobile SDK v3.0',
    code: 'MSDK-33',
    description: 'Next-gen iOS and Android telemetry SDK with offline sync engine.',
    status: 'planning',
    owner: 'Marcus Reed',
    membersCount: 6,
    budget: '$120,000',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'proj-4',
    name: 'Billing Engine v2',
    code: 'BE-402',
    description: 'Automated usage-based metered billing and invoice reconciliation.',
    status: 'completed',
    owner: 'Sophia Chen',
    membersCount: 11,
    budget: '$210,000',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'proj-5',
    name: 'Legacy API Deprecation',
    code: 'LAD-09',
    description: 'Phased sunsetting of v1 REST endpoints with webhook migration guides.',
    status: 'archived',
    owner: 'Priya Shah',
    membersCount: 4,
    budget: '$45,000',
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

// Demo Audit Logs
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'user.role_changed',
    actorName: 'Jane Cooper',
    actorEmail: 'jane@acme.com',
    actorAvatar: AVATAR_SEEDS[0],
    target: 'Marcus Reed (Editor → Admin)',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    ipAddress: '192.168.1.104',
    status: 'success',
    details: 'Role elevated via bulk action in admin console',
  },
  {
    id: 'log-2',
    action: 'user.suspended',
    actorName: 'Jane Cooper',
    actorEmail: 'jane@acme.com',
    actorAvatar: AVATAR_SEEDS[0],
    target: 'Priya Shah (Suspended)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '192.168.1.104',
    status: 'warning',
    details: 'Account suspended following security policy check failure',
  },
  {
    id: 'log-3',
    action: 'user.invite_created',
    actorName: 'Marcus Reed',
    actorEmail: 'marcus@acme.com',
    actorAvatar: AVATAR_SEEDS[1],
    target: 'oliver.smith@acme.com',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    ipAddress: '10.0.4.88',
    status: 'success',
    details: 'Invited as Viewer in Design department',
  },
  {
    id: 'log-4',
    action: 'auth.mfa_reset_requested',
    actorName: 'System Bot',
    actorEmail: 'system@acme.internal',
    actorAvatar: AVATAR_SEEDS[5],
    target: 'Lucas Brown',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ipAddress: '127.0.0.1',
    status: 'failed',
    details: 'Password reset token expired before verification',
  },
];
