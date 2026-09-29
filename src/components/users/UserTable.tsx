import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { User, UserRole, UserStatus } from '../../types';
import { DataTable } from '../ui/DataTable';
import { StatusBadge } from '../ui/StatusBadge';
import { UserRowActions } from './UserRowActions';
import { EmptyState } from '../ui/EmptyState';
import { Avatar } from '../ui/Avatar';
import { formatRelativeTime } from '../../lib/date';
import { ChevronDown, ShieldCheck, Mail, Clock } from 'lucide-react';

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedRows: Record<string, boolean>;
  onSelectionChange: (selection: Record<string, boolean>) => void;
  onRowClick?: (user: User) => void;
  onUpdateRole?: (userId: string, newRole: UserRole) => void;
  onToggleStatus?: (userId: string, newStatus: 'active' | 'suspended') => void;
  onDeleteUser?: (userId: string) => void;
  onResetPassword?: (user: User) => void;
  onClearFilters?: () => void;
}

export function UserTable({
  users,
  isLoading,
  selectedRows,
  onSelectionChange,
  onRowClick,
  onUpdateRole,
  onToggleStatus,
  onDeleteUser,
  onResetPassword,
  onClearFilters,
}: UserTableProps) {
  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center">
            <input
              type="checkbox"
              aria-label="Select all rows on current page"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={table.getIsAllPageRowsSelected()}
              ref={(el) => {
                if (el) {
                  el.indeterminate = table.getIsSomePageRowsSelected();
                }
              }}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              aria-label={`Select ${row.original.name}`}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3 py-0.5">
              <div className="relative shrink-0">
                <Avatar
                  src={user.avatarUrl}
                  name={user.name}
                  size="md"
                />
                {user.mfaEnabled && (
                  <span
                    title="MFA Enabled"
                    className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 ring-2 ring-white"
                  >
                    <ShieldCheck className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                  <span>{user.name}</span>
                </div>
                <div className="text-xs text-slate-500 truncate font-mono">{user.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => (
          <span className="text-xs font-medium text-slate-600">
            {row.original.department}
          </span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div onClick={(e) => e.stopPropagation()} className="relative inline-block">
              <select
                value={user.role}
                onChange={(e) =>
                  onUpdateRole?.(user.id, e.target.value as UserRole)
                }
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-2.5 pr-6 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs capitalize transition-colors"
                title="Change role inline"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'lastActiveAt',
        header: 'Last Active',
        cell: ({ row }) => {
          const val = row.original.lastActiveAt;
          return (
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {val ? formatRelativeTime(val) : '—'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 50,
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
            <UserRowActions
              user={row.original}
              onView={onRowClick}
              onUpdateRole={onUpdateRole}
              onToggleStatus={onToggleStatus}
              onDelete={onDeleteUser}
              onResetPassword={onResetPassword}
            />
          </div>
        ),
      },
    ],
    [onRowClick, onUpdateRole, onToggleStatus, onDeleteUser, onResetPassword]
  );

  return (
    <>
      {/* Desktop & Tablet Table (sm and up) */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={users}
          enableSelection
          selectedRows={selectedRows}
          onSelectionChange={onSelectionChange}
          isLoading={isLoading}
          onRowClick={onRowClick}
          stickyHeader
          emptyState={
            <EmptyState
              title="No users found"
              description="No team members match your current filter and search criteria. Try modifying your search or clearing filters."
              action={
                onClearFilters
                  ? {
                      label: 'Reset Filters',
                      onClick: onClearFilters,
                    }
                  : undefined
              }
            />
          }
        />
      </div>

      {/* Mobile Card List Layout (below sm) */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-20 rounded bg-slate-100" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState
              title="No users found"
              description="Try adjusting your filters or search terms."
              action={
                onClearFilters
                  ? {
                      label: 'Reset Filters',
                      onClick: onClearFilters,
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          users.map((user) => {
            const isSelected = !!selectedRows[user.id];
            return (
              <div
                key={user.id}
                onClick={() => onRowClick?.(user)}
                className={`rounded-xl border p-4 shadow-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        onSelectionChange({
                          ...selectedRows,
                          [user.id]: e.target.checked,
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Avatar
                      src={user.avatarUrl}
                      name={user.name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate font-mono">{user.email}</div>
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <UserRowActions
                      user={user}
                      onView={onRowClick}
                      onUpdateRole={onUpdateRole}
                      onToggleStatus={onToggleStatus}
                      onDelete={onDeleteUser}
                      onResetPassword={onResetPassword}
                    />
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={user.status} size="sm" />
                    <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{user.lastActiveAt ? formatRelativeTime(user.lastActiveAt) : 'Never'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
