import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Eye,
  KeyRound,
  ShieldAlert,
  UserCheck,
  Trash2,
  Shield,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface UserRowActionsProps {
  user: User;
  onView?: (user: User) => void;
  onUpdateRole?: (userId: string, role: UserRole) => void;
  onToggleStatus?: (userId: string, status: 'active' | 'suspended') => void;
  onDelete?: (userId: string) => void;
  onResetPassword?: (user: User) => void;
}

export function UserRowActions({
  user,
  onView,
  onUpdateRole,
  onToggleStatus,
  onDelete,
  onResetPassword,
}: UserRowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isSuspended = user.status === 'suspended';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-label={`Actions for ${user.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-30 mt-1 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-slate-900/5 focus:outline-none"
        >
          {/* View Details */}
          <button
            onClick={() => {
              setIsOpen(false);
              onView?.(user);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            View details
          </button>

          {/* Reset password */}
          <button
            onClick={() => {
              setIsOpen(false);
              onResetPassword?.(user);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <KeyRound className="h-3.5 w-3.5 text-slate-400" />
            Send password reset
          </button>

          {/* Quick role change submenu */}
          <div className="my-1 border-t border-slate-100 px-2.5 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Change Role
            </span>
            <div className="mt-1 flex gap-1">
              {(['admin', 'editor', 'viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setIsOpen(false);
                    onUpdateRole?.(user.id, r);
                  }}
                  className={`flex-1 rounded py-1 text-[11px] capitalize font-medium transition-colors ${
                    user.role === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="my-1 border-t border-slate-100" />

          {/* Suspend or Reactivate */}
          <button
            onClick={() => {
              setIsOpen(false);
              if (isSuspended) {
                onToggleStatus?.(user.id, 'active');
              } else {
                setShowSuspendConfirm(true);
              }
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {isSuspended ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Reactivate user</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                <span>Suspend access</span>
              </>
            )}
          </button>

          {/* Delete User */}
          <button
            onClick={() => {
              setIsOpen(false);
              setShowDeleteConfirm(true);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            Delete user
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete?.(user.id);
        }}
        title={`Delete ${user.name}?`}
        description={`This will permanently remove ${user.email} from the workspace and invalidate all active session tokens.`}
        confirmLabel="Delete User"
        variant="danger"
      />

      {/* Suspend Confirmation Modal */}
      <ConfirmDialog
        isOpen={showSuspendConfirm}
        onClose={() => setShowSuspendConfirm(false)}
        onConfirm={() => {
          setShowSuspendConfirm(false);
          onToggleStatus?.(user.id, 'suspended');
        }}
        title={`Suspend ${user.name}?`}
        description={`Suspended members immediately lose access to all projects, documents, and API keys until reactivated.`}
        confirmLabel="Suspend Access"
        variant="warning"
      />
    </div>
  );
}
