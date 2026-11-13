import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
  className = ''
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  }

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 text-neutral-400', className)}>
      <Loader2 className={cn('animate-spin text-indigo-500', sizes[size])} />
      {message && <p className="text-xs font-medium text-neutral-400">{message}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        {content}
      </div>
    )
  }

  return content
}

