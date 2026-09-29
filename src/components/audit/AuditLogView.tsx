import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { AuditLog } from '../../types';
import { MOCK_AUDIT_LOGS } from '../../lib/mockData';
import { DataTable } from '../ui/DataTable';
import { TableToolbar } from '../ui/TableToolbar';
import { StatusBadge } from '../ui/StatusBadge';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../lib/date';
import { ShieldAlert, Terminal, Laptop } from 'lucide-react';

export function AuditLogView() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((l) => {
      return (
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.actorName.toLowerCase().includes(search.toLowerCase()) ||
        l.target.toLowerCase().includes(search.toLowerCase()) ||
        l.details.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  const columns = useMemo<ColumnDef<AuditLog>[]>(
    () => [
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
            {formatDate(row.original.timestamp)}
          </span>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Event Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-mono text-xs font-semibold text-slate-800">
              {row.original.action}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'actorName',
        header: 'Triggered By',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar
              src={row.original.actorAvatar}
              name={row.original.actorName}
              size="xs"
            />
            <div>
              <div className="text-xs font-medium text-slate-800">{row.original.actorName}</div>
              <div className="text-[11px] text-slate-400 font-mono">{row.original.actorEmail}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'target',
        header: 'Target Entity',
        cell: ({ row }) => (
          <span className="text-xs font-medium text-slate-700">{row.original.target}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Result',
        cell: ({ row }) => <StatusBadge status={row.original.status} size="sm" />,
      },
      {
        accessorKey: 'details',
        header: 'Log Message',
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 max-w-xs truncate block">
            {row.original.details}
          </span>
        ),
      },
      {
        accessorKey: 'ipAddress',
        header: 'IP Address',
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-400">{row.original.ipAddress}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Security &amp; Audit Log</h2>
        <p className="text-xs text-slate-500">
          Immutable event log of role alterations, permissions, and session authentications.
        </p>
      </div>

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter logs by event, actor, or IP..."
      />

      <DataTable
        columns={columns}
        data={filteredLogs}
        emptyState={
          <EmptyState
            title="No logs found"
            description="No audit events correspond to the active filter."
          />
        }
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={filteredLogs.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="audit records"
      />
    </div>
  );
}
