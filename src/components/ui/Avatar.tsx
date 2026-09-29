import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imgClassName?: string;
}

const GRADIENTS = [
  'from-blue-600 to-indigo-600 text-white',
  'from-emerald-500 to-teal-600 text-white',
  'from-violet-600 to-purple-600 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-rose-500 to-pink-600 text-white',
  'from-cyan-500 to-blue-600 text-white',
  'from-fuchsia-500 to-pink-600 text-white',
  'from-sky-500 to-indigo-500 text-white',
];

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

const SIZE_MAP = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  imgClassName,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);
  const gradient = getGradient(name);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-linear-to-br font-semibold select-none ring-1 ring-black/5 shadow-2xs shrink-0 tracking-tight",
          gradient,
          sizeClasses,
          className
        )}
        title={name}
        aria-label={name}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200/80 shrink-0",
        sizeClasses,
        className
      )}
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
