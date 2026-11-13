import React, { useEffect } from 'react'
import { Search, FlaskConical, CheckCircle2, X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Shared light-theme building blocks for the Customer Studio pages.
 * Visual language matches ImageGeneratorPage (white cards, violet accents).
 */

export function DemoBadge({ label = 'Demo data', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200',
        className
      )}
      title="Values shown are sample data stored in your browser only"
    >
      <FlaskConical className="w-3 h-3" />
      {label}
    </span>
  )
}

export function StudioPageHeader({ icon: Icon, section, crumb, title, description, actions }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            {Icon && <Icon className="w-3.5 h-3.5 text-violet-600" />}
            {section}
          </span>
          {crumb && (
            <>
              <span className="text-xs text-neutral-400 font-medium">/</span>
              <span className="text-xs text-neutral-500 font-medium">{crumb}</span>
            </>
          )}
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">{title}</h1>
        {description && <p className="text-sm text-neutral-600 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ children, className = '', ...props }) {
  return (
    <div className={cn('bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function PanelTitle({ icon: Icon, children, right }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-violet-600" />}
        {children}
      </h2>
      {right}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, sub, accent = 'violet' }) {
  const accents = {
    violet: 'bg-violet-50 text-violet-600 border-violet-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200'
  }
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-start gap-3">
      {Icon && (
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', accents[accent])}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-500">{label}</p>
        <p className="text-xl font-bold text-neutral-900 leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-neutral-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function SearchField({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
      />
    </div>
  )
}

export function SegmentedTabs({ options, value, onChange, size = 'md' }) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200" role="tablist">
      {options.map((opt) => {
        const active = opt.value === value
        const Icon = opt.icon
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all',
              size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
              active ? 'bg-white text-violet-700 shadow-sm border border-neutral-200' : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {opt.label}
            {opt.count !== undefined && (
              <span className={cn('text-[10px] px-1.5 rounded-full', active ? 'bg-violet-100' : 'bg-neutral-200')}>{opt.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function LightSelect({ value, onChange, options, label, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={cn(
        'rounded-xl px-3 py-2 text-xs font-medium bg-white border border-neutral-300 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer',
        className
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-neutral-700 mb-1.5">
      {children}
    </label>
  )
}

export const lightInputClass =
  'w-full rounded-xl px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-60'

export function LightEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/60">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <p className="text-sm font-bold text-neutral-800">{title}</p>
      {description && <p className="text-xs text-neutral-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer">
      <span>
        <span className="block text-sm font-semibold text-neutral-800">{label}</span>
        {description && <span className="block text-xs text-neutral-500 mt-0.5">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors shrink-0',
          checked ? 'bg-violet-600' : 'bg-neutral-300'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-4'
          )}
        />
      </button>
    </label>
  )
}

/** Image or video thumbnail. Videos without a poster show their first frame. */
export function MediaThumb({ type, src, poster, alt = '', className = '' }) {
  if (type === 'video') {
    return (
      <video
        src={src}
        poster={poster || undefined}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        className={cn('w-full h-full object-cover bg-neutral-900', className)}
      />
    )
  }
  return <img src={src} alt={alt} loading="lazy" className={cn('w-full h-full object-cover', className)} />
}

/** Small auto-dismissing toast. `toast` = { message, tone } | null */
export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null
  const danger = toast.tone === 'danger'
  return (
    <div className="fixed bottom-6 right-6 z-[60] max-w-sm" role="status" aria-live="polite">
      <div
        className={cn(
          'flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm bg-white',
          danger ? 'border-rose-200 text-rose-800' : 'border-emerald-200 text-neutral-800'
        )}
      >
        <CheckCircle2 className={cn('w-4 h-4 mt-0.5 shrink-0', danger ? 'text-rose-500' : 'text-emerald-500')} />
        <span className="flex-1">{toast.message}</span>
        <button onClick={onClose} aria-label="Dismiss" className="text-neutral-400 hover:text-neutral-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

