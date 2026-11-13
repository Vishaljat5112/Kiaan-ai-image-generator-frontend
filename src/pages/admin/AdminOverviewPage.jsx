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
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950/20 to-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Kiaan Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Operations & Fleet Governance</h1>
          <p className="text-sm text-neutral-400 mt-1">Platform monitoring, user management, and compute node administration</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/gpu">
            <Button variant="secondary" size="sm" leftIcon={Server}>
              Inspect Fleet
            </Button>
          </Link>
          <Link to="/admin/queue">
            <Button variant="primary" size="sm" leftIcon={Layers}>
              Inspect Queues
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} hover>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">{kpi.title}</span>
                  <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.border} border flex items-center justify-center ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-2">{kpi.value}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-neutral-500 font-medium">{kpi.status}</div>
                <Link to={kpi.to} className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-3 font-medium">
                  View details <ArrowRight className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Fleet Connectivity Banner */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
        <div className="flex items-center gap-2.5 text-neutral-200">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-sm">GPU Inference Worker Connectivity</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
          Hardware telemetry and queue monitoring require active Python worker daemons registered via the internal RPC bridge. Workers will stream VRAM allocations, temperatures, and throughput metrics when launched.
        </p>
      </div>
    </div>
  )
}

export default AdminOverviewPage
