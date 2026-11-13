import React from 'react'
import { cn } from '../../utils/cn'

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-neutral-800 text-neutral-300 border border-neutral-700/60',
    primary: 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-800/60',
    danger: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    outline: 'bg-transparent text-neutral-300 border border-neutral-700'
  }

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2.5 py-0.5 rounded-full font-medium'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 leading-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

