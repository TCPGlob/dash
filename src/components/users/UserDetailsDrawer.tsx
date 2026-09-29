import React from 'react';
import { X, Shield, Mail, Calendar, Clock, Key, CheckCircle, AlertCircle, Building, Laptop } from 'lucide-react';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Avatar } from '../ui/Avatar';
import { formatDate, formatRelativeTime } from '../../lib/date';

export interface UserDetailsDrawerProps {
  user: User | null;
  onClose: () => void;
  onUpdateRole?: (userId: string, role: UserRole) => void;
  onToggleStatus?: (userId: string, status: 'active' | 'suspended') => void;
}

export function UserDetailsDrawer({
  user,
  onClose,
  onUpdateRole,
  onToggleStatus,
}: UserDetailsDrawerProps) {
  if (!user) return null;

  const isSuspended = user.status === 'suspended';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">User Profile</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Identity Card */}
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="xl"
                className="shadow-xs ring-2 ring-slate-100"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{user.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  <StatusBadge status={user.status} size="sm" />
                  <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status / Role Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onToggleStatus?.(user.id, isSuspended ? 'active' : 'suspended')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition-colors ${
                  isSuspended
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                {isSuspended ? 'Reactivate Account' : 'Suspend Account'}
              </button>

              <select
                value={user.role}
                onChange={(e) => onUpdateRole?.(user.id, e.target.value as UserRole)}
                className="rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 capitalize hover:bg-slate-50 focus:border-blue-500 cursor-pointer text-center"
              >
                <option value="admin">Admin Role</option>
                <option value="editor">Editor Role</option>
                <option value="viewer">Viewer Role</option>
              </select>
            </div>

            {/* Information Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                User Details
              </h4>
              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Building className="h-3.5 w-3.5" /> Department
                  </span>
                  <span className="font-medium text-slate-900">{user.department}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Clock className="h-3.5 w-3.5" /> Last Active
                  </span>
                  <span className="font-medium text-slate-900">
                    {user.lastActiveAt ? formatRelativeTime(user.lastActiveAt) : 'Never logged in'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-3.5 w-3.5" /> Date Added
                  </span>
                  <span className="font-medium text-slate-900">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Key className="h-3.5 w-3.5" /> Two-Factor MFA
                  </span>
                  <span className={`inline-flex items-center gap-1 font-medium ${user.mfaEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {user.mfaEnabled ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    {user.mfaEnabled ? 'Enforced & Active' : 'Not configured'}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Permissions Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Access Permissions ({user.role})
              </h4>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-2 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Manage Team &amp; Billing</span>
                  <span className={`font-semibold ${user.role === 'admin' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {user.role === 'admin' ? 'Allowed' : 'Denied'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Create / Edit Projects</span>
                  <span className={`font-semibold ${user.role !== 'viewer' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {user.role !== 'viewer' ? 'Allowed' : 'Denied'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Read Analytics &amp; Reports</span>
                  <span className="font-semibold text-emerald-600">Allowed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Export Sensitive Data</span>
                  <span className={`font-semibold ${user.role === 'admin' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {user.role === 'admin' ? 'Allowed' : 'Denied'}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Devices
              </h4>
              <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Laptop className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900">Chrome on macOS</div>
                    <div className="text-[11px] text-slate-400">IP: 198.51.100.44 • Active now</div>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
