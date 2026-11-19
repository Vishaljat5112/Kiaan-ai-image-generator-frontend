import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Modal({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  className = '',
  theme = 'dark'
}) {
  const isLight = theme === 'light'
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={cn('fixed inset-0 backdrop-blur-sm transition-opacity', isLight ? 'bg-neutral-900/50' : 'bg-black/80')}
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl shadow-2xl p-5 sm:p-6 z-10 transition-all border my-auto',
          isLight
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-[#0D111C] border-neutral-800 text-neutral-100',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className={cn('flex items-start justify-between pb-3.5 border-b shrink-0', isLight ? 'border-neutral-200' : 'border-neutral-800/80')}>
          <div className="min-w-0 pr-2">
            {title && <h3 className={cn('text-base font-semibold truncate', isLight ? 'text-neutral-900' : 'text-neutral-100')}>{title}</h3>}
            {description && <p className={cn('text-xs mt-1 truncate', isLight ? 'text-neutral-500' : 'text-neutral-400')}>{description}</p>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ml-2',
                isLight ? 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="pt-4 overflow-y-auto flex-1 pr-0.5">{children}</div>
      </div>
    </div>
  )
}

