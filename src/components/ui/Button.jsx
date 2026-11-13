import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-950/50 focus:ring-indigo-500 active:bg-indigo-700',
    secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/80 focus:ring-neutral-500 active:bg-neutral-850',
    outline: 'bg-transparent hover:bg-neutral-800/60 text-neutral-200 border border-neutral-700 focus:ring-neutral-500 active:bg-neutral-800',
    ghost: 'bg-transparent hover:bg-neutral-800/50 text-neutral-300 hover:text-neutral-100 focus:ring-neutral-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950/50 focus:ring-rose-500 active:bg-rose-700',
    gradient: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-md shadow-indigo-950/50 focus:ring-indigo-500'
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
      {!isLoading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  )
}

