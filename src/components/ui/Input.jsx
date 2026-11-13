import React from 'react'
import { cn } from '../../utils/cn'

export function Input({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  theme = 'dark',
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const isLight = theme === 'light'

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-xs font-semibold',
            isLight ? 'text-neutral-700' : 'text-neutral-300'
          )}
        >
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {LeftIcon && (
          <div
            className={cn(
              'absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none',
              isLight ? 'text-neutral-400' : 'text-neutral-400'
            )}
          >
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-xl px-3.5 py-2.5 text-sm transition-all',
            isLight
              ? 'bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
              : 'bg-neutral-900 border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            error && (isLight ? 'border-rose-500 focus:ring-rose-500' : 'border-rose-500 focus:ring-rose-500'),
            className
          )}
          {...props}
        />
        {RightIcon && (
          <div
            className={cn(
              'absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400',
              isLight ? 'text-neutral-400' : 'text-neutral-400'
            )}
          >
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error ? (
        <p className={cn('text-xs font-medium', isLight ? 'text-rose-600' : 'text-rose-400')}>
          {error}
        </p>
      ) : helperText ? (
        <p className={cn('text-xs', isLight ? 'text-neutral-500' : 'text-neutral-400')}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default Input
