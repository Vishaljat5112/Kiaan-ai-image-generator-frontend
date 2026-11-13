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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary">{category}</Badge>
            <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {statusBadge}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">{title}</h1>
          <p className="text-sm text-neutral-400 mt-1">{description}</p>
        </div>

        {actionTo && (
          <div className="shrink-0">
            <Link to={actionTo}>
              <Button variant="secondary" size="sm" leftIcon={ArrowLeft}>
                {actionLabel}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Empty State Banner if specified */}
      {emptyTitle && (
        <div className="p-8 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 flex flex-col items-center justify-center text-center">
          {EmptyIcon && (
            <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-400 mb-3">
              <EmptyIcon className="w-6 h-6 text-neutral-300" />
            </div>
          )}
          <h2 className="text-base font-semibold text-neutral-200">{emptyTitle}</h2>
          <p className="text-xs text-neutral-400 max-w-sm mt-1">{emptyDescription}</p>
        </div>
      )}

      {/* Capabilities & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers className="w-4 h-4" />
              <CardTitle as="h2">Studio Capabilities</CardTitle>
            </div>
            <CardDescription>
              Functional tools and creative pipeline specifications available in this module.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {features.length > 0 ? (
              <ul className="space-y-2.5">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400">
                Studio workspace is active. Connect input parameters to begin generation.
              </p>
            )}

            <div className="mt-6 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                <strong>System Notice:</strong> Generative models run on private, self-hosted GPU infrastructure. Model weights must be active to process jobs.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Operational State Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <CardTitle as="h2">Module Status</CardTitle>
            </div>
            <CardDescription>Interface & Connectivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">User Interface</span>
                <span className="text-emerald-400 font-medium">Ready</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Inference Worker Fleet</span>
                <span className="text-amber-400 font-medium">Offline</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-1/4" />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-800/40 border border-neutral-700/40 text-[11px] text-neutral-400 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                Generations require active worker connections. Actions will queue once compute nodes register.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RoutePlaceholder
