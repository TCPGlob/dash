import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UsersView } from './components/users/UsersView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { ArchitectureShowcase } from './components/dev/ArchitectureShowcase';
import { Avatar } from './components/ui/Avatar';
import { resetUsersDatabase } from './lib/mockData';
import {
  Users,
  FolderGit2,
  ShieldAlert,
  GitPullRequest,
  Activity,
  Layers,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Building,
  Bell,
  Search,
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type TabType = 'users' | 'projects' | 'audit' | 'architecture';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PulseAdminDashboard />
    </QueryClientProvider>
  );
}

function PulseAdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [resetKey, setResetKey] = useState(0);
  const [showResetNotice, setShowResetNotice] = useState(false);

  const handleResetData = () => {
    resetUsersDatabase();
    queryClient.invalidateQueries();
    setResetKey((k) => k + 1);
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand & Tenant */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm text-white font-bold">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Pulse<span className="text-blue-600 font-extrabold">Admin</span>
                </span>
                <span className="ml-2 hidden rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 sm:inline-block border border-blue-200">
                  B2B SaaS
                </span>
              </div>
            </div>

            {/* Tenant switcher pill */}
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs text-slate-700">
              <Building className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold">Acme Global Inc.</span>
              <span className="text-slate-400">·</span>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                Enterprise
              </span>
            </div>
          </div>

          {/* Right: Quick actions & User profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="Reset sample database to default 1,247 users"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Sample DB</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
              </button>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <Avatar
                src="/avatars/avatar-1.svg"
                name="Jane Cooper"
                size="sm"
                className="ring-1 ring-slate-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900">Jane Cooper</div>
                <div className="text-[10px] text-slate-500">Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users Management</span>
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === 'users'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                1,247
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FolderGit2 className="h-4 w-4" />
              <span>Projects (Reuse Demo)</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Audit &amp; Security Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <GitPullRequest className="h-4 w-4 text-amber-500" />
              <span>Refactor PRs &amp; Architecture</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Database Reset Toast Notification */}
      {showResetNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Reset database to initial 1,247 demo users!</span>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-7xl flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Summary Bar (visible on users tab) */}
        {activeTab === 'users' && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Team Members
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900">1,247</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +12% this mo
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Members
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-emerald-600">935</span>
                <span className="text-[11px] text-slate-400 font-medium">75% active</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pending Invites
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-amber-600">187</span>
                <span className="text-[11px] text-slate-400 font-medium">Awaiting setup</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Suspended Accounts
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-rose-600">125</span>
                <span className="text-[11px] text-slate-400 font-medium">Revoked access</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Rendering */}
        <div key={resetKey}>
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'audit' && <AuditLogView />}
          {activeTab === 'architecture' && (
            <ArchitectureShowcase totalUsersCount={1247} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Pulse Admin SaaS</span>
            <span>•</span>
            <span>TanStack Table v8</span>
            <span>•</span>
            <span>TanStack Query v5</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              View PR Refactor Specs
            </button>
            <span>•</span>
            <span>Built for Enterprise User Management</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
