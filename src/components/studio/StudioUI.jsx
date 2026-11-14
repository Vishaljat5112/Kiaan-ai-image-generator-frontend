import React, { useEffect } from 'react'
import { Search, FlaskConical, CheckCircle2, X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Shared eye-friendly dark slate building blocks for the Customer Studio pages.
 * Visual language harmonizes with the landing page (deep obsidian slate #0D111C, cyan/pink accents).
 */

export function DemoBadge({ label = 'Demo data', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-950/50 text-amber-300 border border-amber-800/60',
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
    <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
            {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400" />}
            {section}
          </span>
          {crumb && (
            <>
              <span className="text-xs text-neutral-500 font-medium">/</span>
              <span className="text-xs text-neutral-400 font-medium">{crumb}</span>
            </>
          )}
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
        {description && <p className="text-sm text-neutral-400 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ children, className = '', ...props }) {
  return (
    <div className={cn('bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm text-neutral-100', className)} {...props}>
      {children}
    </div>
  )
}

export function PanelTitle({ icon: Icon, children, right }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
        {children}
      </h2>
      {right}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, sub, accent = 'cyan' }) {
  const accents = {
    violet: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
    pink: 'bg-pink-950/60 text-pink-400 border-pink-800/60',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    rose: 'bg-rose-950/60 text-rose-400 border-rose-800/60'
  }
  return (
    <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-5 border border-neutral-800/90 shadow-sm flex items-start gap-3 text-white">
      {Icon && (
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', accents[accent] || accents.cyan)}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-400">{label}</p>
        <p className="text-xl font-bold text-white leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>}
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
        className="w-full rounded-xl pl-9 pr-3 py-2 text-sm bg-[#080B14] border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-colors"
      />
    </div>
  )
}

export function SegmentedTabs({ options, value, onChange, size = 'md' }) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-[#080B14] border border-neutral-800" role="tablist">
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
              'inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer',
              size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
              active ? 'bg-neutral-800 text-cyan-300 shadow-sm border border-cyan-500/30' : 'text-neutral-400 hover:text-neutral-200'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {opt.label}
            {opt.count !== undefined && (
              <span className={cn('text-[10px] px-1.5 rounded-full', active ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60' : 'bg-neutral-800 text-neutral-400')}>{opt.count}</span>
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
        'rounded-xl px-3 py-2 text-xs font-medium bg-[#080B14] border border-neutral-700/80 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 cursor-pointer',
        className
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-neutral-900 text-white">
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-neutral-300 mb-1.5">
      {children}
    </label>
  )
}

export const lightInputClass =
  'w-full rounded-xl px-3 py-2 text-sm bg-[#080B14] border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 disabled:opacity-60 transition-colors'

export function LightEmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border-2 border-dashed border-neutral-800 bg-[#080B14]/40">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <p className="text-sm font-bold text-neutral-100">{title}</p>
      {description && <p className="text-xs text-neutral-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer select-none">
      <span>
        <span className="block text-sm font-semibold text-neutral-200">{label}</span>
        {description && <span className="block text-xs text-neutral-400 mt-0.5">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors shrink-0 cursor-pointer',
          checked ? 'bg-cyan-500' : 'bg-neutral-800 border border-neutral-700'
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
          'flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm bg-[#0D111C]',
          danger ? 'border-rose-900/60 text-rose-300' : 'border-emerald-900/60 text-emerald-300'
        )}
      >
        <CheckCircle2 className={cn('w-4 h-4 mt-0.5 shrink-0', danger ? 'text-rose-400' : 'text-emerald-400')} />
        <span className="flex-1 text-white">{toast.message}</span>
        <button onClick={onClose} aria-label="Dismiss" className="text-neutral-400 hover:text-white cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default {
  DemoBadge,
  StudioPageHeader,
  Panel,
  PanelTitle,
  StatCard,
  SearchField,
  SegmentedTabs,
  LightSelect,
  FieldLabel,
  lightInputClass,
  LightEmptyState,
  Toggle,
  MediaThumb,
  Toast
}
