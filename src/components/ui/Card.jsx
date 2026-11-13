import React from 'react'
import { cn } from '../../utils/cn'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-neutral-900/60 backdrop-blur-sm border border-neutral-800/80 rounded-xl overflow-hidden shadow-sm',
        hover && 'hover:border-neutral-700/80 hover:bg-neutral-900/80 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pb-3', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', as: Component = 'h3', ...props }) {
  return (
    <Component
      className={cn('text-lg font-semibold text-neutral-100 tracking-tight', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={cn('text-sm text-neutral-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pt-3', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn('p-5 sm:p-6 pt-0 border-t border-neutral-800/60 mt-4 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
}

