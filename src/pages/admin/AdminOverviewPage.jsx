import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Server,
  Layers,
  DollarSign,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function AdminOverviewPage() {
  const kpiCards = [
    {
      title: 'Total Registered Users',
      value: '0',
      status: 'No user accounts registered yet',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/80',
      border: 'border-indigo-800/60',
      to: '/admin/users'
    },
    {
      title: 'GPU Worker Fleet',
      value: '0 Active',
      status: 'Inference workers not connected',
      icon: Server,
      color: 'text-amber-400',
      bg: 'bg-amber-950/80',
      border: 'border-amber-800/60',
      to: '/admin/gpu'
    },
    {
      title: 'Active Task Queues',
      value: '0 Jobs',
      status: 'BullMQ queue is idle',
      icon: Layers,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-800/60',
      to: '/admin/queue'
    },
    {
      title: 'Platform Revenue',
      value: '$0.00',
      status: 'No billing transactions recorded',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-800/60',
      to: '/admin/revenue'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner (Landing Page Composer Gradient Ring & Glass Card) */}
      <div className="rounded-[26px] p-1 bg-gradient-to-r from-cyan-500/30 via-pink-500/20 to-purple-500/30 shadow-xl shadow-cyan-500/10 ring-1 ring-white/10">
        <div className="p-6 rounded-[22px] bg-[#0B0F19]/95 backdrop-blur-md border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300 shadow-xs">
                Kiaan Administration
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              System Operations & Fleet Governance
            </h1>
            <p className="text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Platform monitoring, user management, and compute node administration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/gpu"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 hover:border-cyan-500/50 shadow-2xs transition-all select-none cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-neutral-400" />
              <span>Inspect Fleet</span>
            </Link>
            <Link
              to="/admin/queue"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] select-none cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect Queues</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Status Cards (Landing Page Showcase Card Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className="rounded-[22px] p-5 bg-[#0B0F19]/90 border border-neutral-800 shadow-lg hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">{kpi.title}</span>
                  <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.border} border flex items-center justify-center ${kpi.color} shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white mt-2 tracking-tight">{kpi.value}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium">{kpi.status}</div>
                <Link
                  to={kpi.to}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-2.5 font-semibold transition-colors"
                >
                  <span>View details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fleet Connectivity Banner */}
      <div className="p-6 rounded-[22px] border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-neutral-200">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">GPU Inference Worker Connectivity</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl pl-10">
          Hardware telemetry and queue monitoring require active Python worker daemons registered via the internal RPC bridge. Workers will stream VRAM allocations, temperatures, and throughput metrics when launched.
        </p>
      </div>
    </div>
  )
}

export default AdminOverviewPage
