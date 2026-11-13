import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Layers, ShieldCheck, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function RoutePlaceholder({
  title,
  description,
  category = 'Creation Studio',
  emptyTitle,
  emptyDescription,
  emptyIcon: EmptyIcon,
  features = [],
  actionTo = '/dashboard',
  actionLabel = 'Back to Studio',
  statusBadge = 'Ready'
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300 shadow-xs">
              {category}
            </span>
            <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400/50" />
              {statusBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">{description}</p>
        </div>

        {actionTo && (
          <div className="shrink-0">
            <Link
              to={actionTo}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 hover:border-cyan-500/50 shadow-2xs transition-all select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
              <span>{actionLabel}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Empty State Banner if specified */}
      {emptyTitle && (
        <div className="p-8 rounded-[24px] border border-dashed border-neutral-800/80 bg-[#0D111C]/80 shadow-xl flex flex-col items-center justify-center text-center">
          {EmptyIcon && (
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-cyan-400 mb-3 shadow-xs">
              <EmptyIcon className="w-6 h-6 text-cyan-400" />
            </div>
          )}
          <h2 className="text-base font-bold text-white">{emptyTitle}</h2>
          <p className="text-xs text-neutral-400 max-w-sm mt-1 leading-relaxed">{emptyDescription}</p>
        </div>
      )}

      {/* Capabilities & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-[24px] bg-[#0B0F19]/90 border border-neutral-800 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="p-6 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Layers className="w-4 h-4" />
              <h2 className="text-base font-bold text-white tracking-tight">Studio Capabilities</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Functional tools and creative pipeline specifications available in this module.
            </p>
          </div>
          <div className="p-6 pt-3 space-y-6">
            {features.length > 0 ? (
              <ul className="space-y-2.5">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-xs shadow-cyan-400/50" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400">
                Studio workspace is active. Connect input parameters to begin generation.
              </p>
            )}

            <div className="mt-6 p-4 rounded-xl bg-[#06080F]/90 border border-neutral-800/80 text-xs text-neutral-300 flex items-center gap-3 shadow-inner">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-white">System Notice:</strong> Generative models run on private, self-hosted GPU infrastructure. Model weights must be active to process jobs.
              </span>
            </div>
          </div>
        </div>

        {/* Operational State Card */}
        <div className="rounded-[24px] bg-[#0B0F19]/90 border border-neutral-800 shadow-xl backdrop-blur-md overflow-hidden flex flex-col justify-between">
          <div className="p-6 pb-3">
            <div className="flex items-center gap-2 text-neutral-200 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Module Status</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Interface & Connectivity</p>
          </div>
          <div className="p-6 pt-3 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">User Interface</span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Inference Worker Fleet</span>
                <span className="text-amber-400 font-semibold">Offline</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-1/4" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#06080F]/80 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Generations require active worker connections. Actions will queue once compute nodes register.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoutePlaceholder
