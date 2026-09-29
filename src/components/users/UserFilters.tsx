import React from 'react';
import { UserFilters } from '../../hooks/useUsers';
import { TableToolbar } from '../ui/TableToolbar';
import { Filter, RotateCcw, Bookmark, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UserFiltersBarProps {
  filters: UserFilters;
  onChange: (patch: Partial<UserFilters>) => void;
  totalFilteredCount?: number;
}

const PRESETS = [
  { id: '', label: 'All Users' },
  { id: 'admins', label: 'All admins', icon: '👑' },
  { id: 'invited', label: 'Invited users', icon: '✉️' },
  { id: 'inactive_30d', label: 'Inactive > 30 days', icon: '⏳' },
  { id: 'active_members', label: 'Active members', icon: '⚡' },
];

export function UserFiltersBar({ filters, onChange }: UserFiltersBarProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.role !== 'all' ||
    filters.status !== 'all' ||
    filters.preset !== '';

  const handleReset = () => {
    onChange({
      search: '',
      role: 'all',
      status: 'all',
      preset: '',
      page: 1,
    });
  };

  return (
    <div className="space-y-3">
      {/* Search and Dropdowns Toolbar */}
      <TableToolbar
        searchValue={filters.search}
        onSearchChange={(search) => onChange({ search, preset: '' })}
        searchPlaceholder="Search by name, email, department, or role..."
        filtersSlot={
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Role:</span>
              <select
                value={filters.role}
                onChange={(e) =>
                  onChange({ role: e.target.value, preset: '', page: 1 })
                }
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={filters.status}
                onChange={(e) =>
                  onChange({ status: e.target.value, preset: '', page: 1 })
                }
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        }
        actionsSlot={
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>URL synced &amp; shareable state</span>
          </div>
        }
      />

      {/* Saved Filter Presets Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Bookmark className="h-3 w-3" />
          Presets:
        </span>
        {PRESETS.map((preset) => {
          const isActive =
            preset.id === ''
              ? !filters.preset && filters.role === 'all' && filters.status === 'all'
              : filters.preset === preset.id;

          return (
            <button
              key={preset.id || 'all'}
              onClick={() => {
                if (preset.id === '') {
                  handleReset();
                } else {
                  onChange({
                    preset: preset.id,
                    page: 1,
                  });
                }
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              )}
            >
              {preset.icon && <span>{preset.icon}</span>}
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
