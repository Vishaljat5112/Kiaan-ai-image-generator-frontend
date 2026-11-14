import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Server,
  Layers,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { api } from '../../services/api'
import { formatNumber, formatCurrency, formatDateTime } from '../../utils/format'

export function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchOverview() {
      try {
        setLoading(true)
        const res = await api.get('/admin/overview')
        if (mounted && res.data?.data) {
          setData(res.data.data)
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.error?.message || 'Failed to load administrative overview')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchOverview()
    return () => {
      mounted = false
    }
  }, [])

  const kpis = data?.kpis || {}

  const kpiCards = [
    {
      title: 'Total Registered Users',
      value: loading ? '...' : formatNumber(kpis.totalUsers || 0),
      status: loading ? 'Loading...' : `${formatNumber(kpis.activeUsers || 0)} active customer accounts`,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/80',
      border: 'border-indigo-800/60',
      to: '/admin/users'
    },
    {
      title: 'GPU Worker Fleet',
      value: loading ? '...' : `${kpis.activeGpuFleet || 0} / ${kpis.totalGpuNodes || 0} Online`,
      status: loading ? 'Checking fleet...' : `${kpis.activeGpuFleet || 0} nodes healthy & streaming heartbeat`,
      icon: Server,
      color: 'text-amber-400',
      bg: 'bg-amber-950/80',
      border: 'border-amber-800/60',
      to: '/admin/gpu'
    },
    {
      title: 'Active Task Queues',
      value: loading ? '...' : `${formatNumber(kpis.activeQueues || 0)} Tasks`,
      status: loading ? 'Querying queues...' : `${kpis.queuedJobs || 0} queued, ${kpis.processingJobs || 0} processing`,
      icon: Layers,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-800/60',
      to: '/admin/queue'
    },
    {
      title: 'Platform Revenue',
      value: loading ? '...' : formatCurrency(kpis.platformRevenue || 0),
      status: loading ? 'Auditing billing...' : `${kpis.activeSubscriptions || 0} active subscriptions (Confirmed Paid)`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-800/60',
      to: '/admin/revenue'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="rounded-[26px] p-1 bg-gradient-to-r from-cyan-500/30 via-pink-500/20 to-purple-500/30 shadow-xl shadow-cyan-500/10 ring-1 ring-white/10">
        <div className="p-6 rounded-[22px] bg-[#0B0F19]/95 backdrop-blur-md border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300 shadow-xs">
                Kiaan Administration Control Plane
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              System Operations & Fleet Governance
            </h1>
            <p className="text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Real-time cluster telemetry, compute fleet health, user management, and verified billing transactions.
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

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Status Cards */}
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

      {/* Operational Summary Grid: Recent Signups & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="p-6 rounded-[22px] border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-sm text-white">Recent Customer Signups</h3>
            </div>
            <Link to="/admin/users" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              Manage Users →
            </Link>
          </div>

          <div className="space-y-2">
            {(!data?.recentSignups || data.recentSignups.length === 0) ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No recent signups recorded</p>
            ) : (
              data.recentSignups.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-neutral-200">{user.fullName || user.email}</div>
                    <div className="text-[11px] text-neutral-400">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {user.role}
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      {user.creditBalance} credits
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Cluster Jobs */}
        <div className="p-6 rounded-[22px] border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <h3 className="font-semibold text-sm text-white">Recent Generation Activity</h3>
            </div>
            <Link to="/admin/queue" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              Queue Monitor →
            </Link>
          </div>

          <div className="space-y-2">
            {(!data?.recentJobs || data.recentJobs.length === 0) ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No recent generation tasks</p>
            ) : (
              data.recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                      <span>{job.type}</span>
                      <span className="text-[10px] text-neutral-500 font-normal">({job.modelId})</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">{job.user?.email || 'System'}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : job.status === 'FAILED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {job.status}
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      {job.creditCost} credits
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fleet Telemetry Notice */}
      <div className="p-6 rounded-[22px] border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-neutral-200">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">GPU Inference Worker Health & Telemetry</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-3xl pl-10">
          Compute worker nodes stream heartbeats, VRAM allocations, and task execution progress via the internal RPC API. Nodes with heartbeats older than 5 minutes automatically transition to OFFLINE status.
        </p>
      </div>
    </div>
  )
}

export default AdminOverviewPage
