import React from 'react';
import { SearchX, UserX, FolderOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: 'search' | 'users' | 'folder' | React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (icon === 'users') {
      return <UserX className="h-8 w-8 text-slate-400" />;
    }
    if (icon === 'folder') {
      return <FolderOpen className="h-8 w-8 text-slate-400" />;
    }
    return <SearchX className="h-8 w-8 text-slate-400" />;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center bg-white",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-inner mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 leading-relaxed">{description}</p>
      {action && (
        <div className="mt-5">
          <button
            onClick={action.onClick}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs",
              action.variant === 'secondary'
                ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}
