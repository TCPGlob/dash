import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Selection
  enableSelection?: boolean;
  selectedRows?: Record<string, boolean>;
  onSelectionChange?: (selection: Record<string, boolean>) => void;
  // Sorting (can be internal or controlled)
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  // Loading / empty states
  isLoading?: boolean;
  skeletonRowCount?: number;
  emptyState?: React.ReactNode;
  // Row click
  onRowClick?: (row: TData) => void;
  stickyHeader?: boolean;
  className?: string;
  getRowId?: (row: TData, index: number) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableSelection = false,
  selectedRows = {},
  onSelectionChange,
  sorting: controlledSorting,
  onSortingChange: setControlledSorting,
  isLoading = false,
  skeletonRowCount = 5,
  emptyState,
  onRowClick,
  stickyHeader = false,
  className,
  getRowId = (row: any) => row.id,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sorting = controlledSorting ?? internalSorting;
  const onSortingChange = setControlledSorting ?? setInternalSorting;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: selectedRows,
    },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
      onSortingChange(nextSorting);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(selectedRows) : updater;
      onSelectionChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: enableSelection,
    getRowId,
  });

  if (isLoading) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-4">
            {enableSelection && <div className="h-4 w-4 rounded bg-slate-200 animate-pulse" />}
            <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-40 rounded bg-slate-200 animate-pulse hidden md:block" />
            <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: skeletonRowCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              {enableSelection && <div className="h-4 w-4 rounded bg-slate-100" />}
              <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="h-3 w-1/4 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-slate-100 hidden sm:block" />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-4 w-4 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead
            className={cn(
              "border-b border-slate-200 bg-slate-50/80 text-xs font-medium uppercase tracking-wider text-slate-500",
              stickyHeader && "sticky top-0 z-10 backdrop-blur-sm bg-slate-50/95"
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3.5 select-none font-semibold text-slate-600 transition-colors",
                        canSort && "cursor-pointer hover:bg-slate-100/80 hover:text-slate-900"
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="inline-flex text-slate-400">
                            {sorted === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-blue-600 font-bold" />
                            ) : sorted === 'desc' ? (
                              <ChevronDown className="h-3.5 w-3.5 text-blue-600 font-bold" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => {
              const isSelected = row.getIsSelected();
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "transition-colors duration-150",
                    onRowClick && "cursor-pointer",
                    isSelected ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-slate-50/70"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 text-slate-700 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
