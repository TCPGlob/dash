import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Project, ProjectStatus } from '../../types';
import { MOCK_PROJECTS } from '../../lib/mockData';
import { DataTable } from '../ui/DataTable';
import { TableToolbar } from '../ui/TableToolbar';
import { StatusBadge } from '../ui/StatusBadge';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../lib/date';
import { FolderGit2, Users, DollarSign, Plus } from 'lucide-react';

export function ProjectsView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.owner.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const pagedProjects = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, page, pageSize]);

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Project Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FolderGit2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{row.original.name}</div>
              <div className="text-xs text-slate-500 font-mono">{row.original.code}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Scope',
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 line-clamp-1 max-w-xs">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'owner',
        header: 'Lead Owner',
        cell: ({ row }) => (
          <span className="text-xs font-medium text-slate-700">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'membersCount',
        header: 'Team Size',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{row.original.membersCount} members</span>
          </div>
        ),
      },
      {
        accessorKey: 'budget',
        header: 'Allocated Budget',
        cell: ({ row }) => (
          <span className="text-xs font-mono font-medium text-slate-900">
            {row.original.budget}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Modified',
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {formatDate(row.original.updatedAt)}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Projects</h2>
          <p className="text-xs text-slate-500">
            Reusing the exact same <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">DataTable</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">TableToolbar</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">Pagination</code> components.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors self-start sm:self-auto cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Toolbar */}
      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter projects by title, code or lead..."
        filtersSlot={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        }
      />

      {/* Reused DataTable */}
      <DataTable
        columns={columns}
        data={pagedProjects}
        enableSelection
        selectedRows={selected}
        onSelectionChange={setSelected}
        emptyState={
          <EmptyState
            icon="folder"
            title="No projects found"
            description="Try changing your search term or status filter."
          />
        }
      />

      {/* Reused Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={filteredProjects.length}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        itemLabel="projects"
      />
    </div>
  );
}
