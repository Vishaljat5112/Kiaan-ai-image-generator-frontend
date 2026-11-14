import React, { useEffect, useState, useCallback } from 'react'
import {
  BarChart2,
  RefreshCw,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react'
import { api } from '../../services/api'
import { formatNumber } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminAnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState('30')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get(`/admin/analytics?days=${days}`)
      if (res.data?.data) {
        setData(res.data.data)
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load analytics', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const perf = data?.performance || {}
  const breakdown = data?.typeBreakdown || {}
  const trend = data?.dailyTrend || []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400">
              <BarChart2 className="w-3.5 h-3.5" />
              Intelligence & Metrics
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Throughput & Performance</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Timeseries inference volumes, cluster success rates, average generation latency, and pipeline distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 focus:outline-none"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Total Jobs Run</div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatNumber(perf.totalJobs || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">{perf.completedJobs || 0} successfully settled</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Cluster Success Rate</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {perf.successRate || 100}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Completed vs failed jobs</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Average Latency</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">
            {perf.avgLatencyMs || 0} ms
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">End-to-end inference execution</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Video Tasks Ratio</div>
          <div className="text-2xl font-extrabold text-pink-400 mt-1">
            {perf.totalJobs > 0
              ? `${Math.round(((breakdown.TEXT_TO_VIDEO || 0) / perf.totalJobs) * 100)}%`
              : '0%'}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Proportion of compute on video</div>
        </div>
      </div>

      {/* Breakdown by Generation Type */}
      <div className="p-6 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-xl space-y-4">
        <h3 className="font-semibold text-xs text-white">Generation Pipeline Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(breakdown).map(([type, count]) => (
            <div key={type} className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <div className="text-[10px] text-neutral-400 font-mono truncate">{type}</div>
              <div className="text-lg font-extrabold text-cyan-400 mt-1">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Trend Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40">
          <h3 className="font-semibold text-xs text-white">Daily Throughput & Credit Consumption</h3>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/20 text-neutral-400 font-semibold sticky top-0">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Generations Executed</th>
                <th className="py-3 px-4">Credits Consumed</th>
                <th className="py-3 px-4">Revenue Settled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {trend.slice(-14).reverse().map((day) => (
                <tr key={day.date} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-neutral-300">{day.date}</td>
                  <td className="py-2.5 px-4 font-semibold text-white">{day.jobsCount}</td>
                  <td className="py-2.5 px-4 text-cyan-400">{day.creditsBurned}</td>
                  <td className="py-2.5 px-4 text-emerald-400">${day.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminAnalyticsPage
