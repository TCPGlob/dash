import React from 'react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 transition-all">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              isDanger && "bg-rose-50 text-rose-600",
              isWarning && "bg-amber-50 text-amber-600",
              variant === 'primary' && "bg-blue-50 text-blue-600"
            )}
          >
            {isDanger ? (
              <Trash2 className="h-5 w-5" />
            ) : isWarning ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Info className="h-5 w-5" />
            )}
          </div>

          <div className="space-y-1.5 pt-0.5">
            <h3 className="text-base font-semibold text-slate-900 leading-snug">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer",
              isDanger && "bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-500/20",
              isWarning && "bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500/20",
              variant === 'primary' && "bg-slate-900 hover:bg-slate-800"
            )}
          >
            {isLoading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
