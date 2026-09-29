import React, { useState } from 'react';
import { z } from 'zod';
import { X, Mail, User as UserIcon, Building, Shield, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

export const inviteUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid work email address'),
  role: z.enum(['admin', 'editor', 'viewer'] as const),
  department: z.string().min(1, 'Please select a department'),
  sendInviteEmail: z.boolean().default(true),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;

export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; role: UserRole; department: string }) => Promise<void>;
}

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Security',
  'Operations',
  'Finance',
  'People & HR',
];

export function InviteUserModal({ isOpen, onClose, onSubmit }: InviteUserModalProps) {
  const [formData, setFormData] = useState<InviteUserFormData>({
    name: '',
    email: '',
    role: 'editor',
    department: 'Engineering',
    sendInviteEmail: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = inviteUserSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
      });
      setSuccessMessage(`Invitation link generated and dispatched to ${formData.email}`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          role: 'editor',
          department: 'Engineering',
          sendInviteEmail: true,
        });
      }, 1200);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to send invite' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Invite Team Member
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              New members will receive an onboarding invite link via email.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {successMessage ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="mt-3 text-base font-semibold text-slate-900">Invite Dispatched</h4>
            <p className="mt-1 text-xs text-slate-500">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {errors.form && (
              <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700">
                {errors.form}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Access Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as UserRole })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 capitalize focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="editor">Editor (Create &amp; edit)</option>
                    <option value="admin">Admin (Full privileges)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="sendInviteEmail"
                type="checkbox"
                checked={formData.sendInviteEmail}
                onChange={(e) =>
                  setFormData({ ...formData, sendInviteEmail: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sendInviteEmail" className="text-xs text-slate-600 cursor-pointer">
                Send welcome email with password setup instructions immediately
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Send Invitation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
