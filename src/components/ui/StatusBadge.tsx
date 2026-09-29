import React from 'react';
import { cn } from '../../lib/utils';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

const STATUS_CONFIGS: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  active: {
    bg: 'bg-emerald-50 text-emerald-700',
    ring: 'ring-emerald-600/20',
    dot: 'bg-emerald-500',
    text: 'Active',
  },
  invited: {
    bg: 'bg-amber-50 text-amber-700',
    ring: 'ring-amber-600/20',
    dot: 'bg-amber-500',
    text: 'Invited',
  },
  suspended: {
    bg: 'bg-rose-50 text-rose-700',
    ring: 'ring-rose-600/20',
    dot: 'bg-rose-500',
    text: 'Suspended',
  },
  pending: {
    bg: 'bg-amber-50 text-amber-700',
    ring: 'ring-amber-600/20',
    dot: 'bg-amber-500',
    text: 'Pending',
  },
  planning: {
    bg: 'bg-indigo-50 text-indigo-700',
    ring: 'ring-indigo-600/20',
    dot: 'bg-indigo-500',
    text: 'Planning',
  },
  completed: {
    bg: 'bg-emerald-50 text-emerald-700',
    ring: 'ring-emerald-600/20',
    dot: 'bg-emerald-500',
    text: 'Completed',
  },
  archived: {
    bg: 'bg-slate-100 text-slate-700',
    ring: 'ring-slate-500/20',
    dot: 'bg-slate-400',
    text: 'Archived',
  },
  success: {
    bg: 'bg-emerald-50 text-emerald-700',
    ring: 'ring-emerald-600/20',
    dot: 'bg-emerald-500',
    text: 'Success',
  },
  warning: {
    bg: 'bg-amber-50 text-amber-700',
    ring: 'ring-amber-600/20',
    dot: 'bg-amber-500',
    text: 'Warning',
  },
  failed: {
    bg: 'bg-rose-50 text-rose-700',
    ring: 'ring-rose-600/20',
    dot: 'bg-rose-500',
    text: 'Failed',
  },
};

export function StatusBadge({
  status,
  size = 'md',
  showDot = true,
  className,
}: StatusBadgeProps) {
  const normalizedKey = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIGS[normalizedKey] || {
    bg: 'bg-slate-50 text-slate-600',
    ring: 'ring-slate-500/10',
    dot: 'bg-slate-400',
    text: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium ring-1 ring-inset rounded-full capitalize select-none tracking-tight",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.bg,
        config.ring,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            config.dot,
            normalizedKey === 'active' && 'animate-pulse'
          )}
        />
      )}
      {config.text || status}
    </span>
  );
}
