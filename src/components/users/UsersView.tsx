import React, { useState } from 'react';
import { UserFiltersBar } from './UserFilters';
import { UserTable } from './UserTable';
import { BulkActionsBar } from './BulkActionsBar';
import { Pagination } from '../ui/Pagination';
import { InviteUserModal } from './InviteUserModal';
import { UserDetailsDrawer } from './UserDetailsDrawer';
import { useUsers } from '../../hooks/useUsers';
import { User, UserRole, UserStatus } from '../../types';
import { UserPlus, Sparkles, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface UsersViewProps {
  onServerDurationChange?: (ms: number) => void;
}

export function UsersView() {
  const {
    filters,
    setFilters,
    data,
    isLoading,
    isFetching,
    lastActionStatus,
    clearLastActionStatus,
    updateRole,
    updateStatus,
    deleteUser,
    bulkUpdateStatus,
    bulkUpdateRole,
    bulkDelete,
    isBulkOperating,
    inviteUser,
  } = useUsers();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<User | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleBulkStatus = (status: UserStatus) => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    bulkUpdateStatus({ ids, status });
    setSelected({});
  };

  const handleBulkRole = (role: UserRole) => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    bulkUpdateRole({ ids, role });
    setSelected({});
  };

  const handleBulkDelete = () => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    bulkDelete(ids);
    setSelected({});
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Users</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {data?.total?.toLocaleString() ?? '...'} members
            </span>
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                syncing
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage team members, roles, access permissions, and session authentications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite user</span>
          </button>
        </div>
      </div>

      {/* Action Feedback Banner / Toast */}
      {lastActionStatus && (
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium border shadow-xs transition-all ${
            lastActionStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : lastActionStatus.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {lastActionStatus.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            {lastActionStatus.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-600" />}
            {lastActionStatus.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
            <span>{lastActionStatus.message}</span>
          </div>
          <button
            onClick={clearLastActionStatus}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <UserFiltersBar
        filters={filters}
        onChange={setFilters}
        totalFilteredCount={data?.total}
      />

      {/* Bulk Action Bar (when checkboxes selected) */}
      {selectedCount > 0 && (
        <BulkActionsBar
          count={selectedCount}
          onClear={() => setSelected({})}
          onBulkStatus={handleBulkStatus}
          onBulkRole={handleBulkRole}
          onBulkDelete={handleBulkDelete}
          isProcessing={isBulkOperating}
        />
      )}

      {/* User Table (Desktop table or Mobile cards) */}
      <UserTable
        users={data?.users ?? []}
        isLoading={isLoading}
        selectedRows={selected}
        onSelectionChange={setSelected}
        onRowClick={(user) => setSelectedUserForDrawer(user)}
        onUpdateRole={(userId, role) => updateRole({ userId, newRole: role })}
        onToggleStatus={(userId, status) => updateStatus({ userId, newStatus: status })}
        onDeleteUser={(userId) => deleteUser(userId)}
        onResetPassword={(user) => {
          alert(`Password reset instructions have been triggered for ${user.email}`);
        }}
        onClearFilters={() => {
          setFilters({ search: '', role: 'all', status: 'all', preset: '', page: 1 });
        }}
      />

      {/* Server-Side Pagination */}
      <Pagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={data?.total ?? 0}
        onPageChange={(page) => setFilters({ page })}
        onPageSizeChange={(pageSize) => setFilters({ pageSize, page: 1 })}
        itemLabel="users"
      />

      {/* Modals & Drawers */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={async (payload) => {
          await inviteUser(payload);
        }}
      />

      <UserDetailsDrawer
        user={selectedUserForDrawer}
        onClose={() => setSelectedUserForDrawer(null)}
        onUpdateRole={(userId, role) => {
          updateRole({ userId, newRole: role });
          setSelectedUserForDrawer((prev) => (prev ? { ...prev, role } : null));
        }}
        onToggleStatus={(userId, status) => {
          updateStatus({ userId, newStatus: status });
          setSelectedUserForDrawer((prev) => (prev ? { ...prev, status } : null));
        }}
      />
    </div>
  );
}
