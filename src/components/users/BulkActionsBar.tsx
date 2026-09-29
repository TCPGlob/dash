import React, { useState } from 'react';
import { ShieldAlert, UserCheck, Trash2, X, ChevronDown, Check } from 'lucide-react';
import { UserRole, UserStatus } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  onBulkStatus: (status: UserStatus) => void;
  onBulkRole: (role: UserRole) => void;
  onBulkDelete: () => void;
  isProcessing?: boolean;
}

export function BulkActionsBar({
  count,
  onClear,
  onBulkStatus,
  onBulkRole,
  onBulkDelete,
  isProcessing = false,
}: BulkActionsBarProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-2.5 shadow-sm transition-all animate-in fade-in-50 slide-in-from-top-1">
        <div className="flex items-center gap-3">
          <span className="flex h-6 items-center justify-center rounded-md bg-blue-600 px-2 text-xs font-semibold text-white">
            {count}
          </span>
          <span className="text-xs sm:text-sm font-medium text-blue-900">
            {count === 1 ? '1 user selected' : `${count} users selected`}
          </span>
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100/80 transition-colors"
          >
            <X className="h-3 w-3" />
            Deselect all
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Change Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown((v) => !v)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
            >
              <span>Change Role</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 z-40 mt-1 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                {(['admin', 'editor', 'viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onBulkRole(r);
                    }}
                    className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium capitalize text-slate-700 hover:bg-slate-50"
                  >
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Suspend */}
          <button
            onClick={() => onBulkStatus('suspended')}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs disabled:opacity-50"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            <span>Suspend</span>
          </button>

          {/* Bulk Activate */}
          <button
            onClick={() => onBulkStatus('active')}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs disabled:opacity-50"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Activate</span>
          </button>

          {/* Bulk Delete */}
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          onBulkDelete();
        }}
        title={`Delete ${count} users?`}
        description={`This action will immediately remove the selected ${count} users from this organization and revoke their access.`}
        confirmLabel={`Delete ${count} users`}
        variant="danger"
        isLoading={isProcessing}
      />
    </>
  );
}
