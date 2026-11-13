import React from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../utils/cn'

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'Get started by creating your first generation or project.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-400 mb-4">
        <Icon className="w-6 h-6 text-neutral-300" />
      </div>
      <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

