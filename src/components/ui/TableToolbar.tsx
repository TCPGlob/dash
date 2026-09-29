import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filtersSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  className?: string;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filtersSlot,
  actionsSlot,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {/* Search Input & Left filters */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Custom filter chips or dropdown slots */}
        {filtersSlot}
      </div>

      {/* Right side actions (presets, export, views) */}
      {actionsSlot && (
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {actionsSlot}
        </div>
      )}
    </div>
  );
}
