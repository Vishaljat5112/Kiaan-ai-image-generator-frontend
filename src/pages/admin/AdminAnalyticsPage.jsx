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
    <div className="max-w-7xl mx-auto space-y-6 pt-1">
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

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-xs text-neutral-200 focus:outline-none cursor-pointer"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-medium">Total Jobs Run</div>
            <div className="text-2xl font-extrabold text-white mt-1 truncate" title={String(perf.totalJobs || 0)}>
              {formatNumber(perf.totalJobs || 0)}
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5">{perf.completedJobs || 0} successfully settled</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-medium">Cluster Success Rate</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 truncate" title={`${perf.successRate || 100}%`}>
              {perf.successRate || 100}%
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5">Completed vs failed jobs</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-medium">Average Latency</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1 truncate" title={`${perf.avgLatencyMs || 0} ms`}>
              {perf.avgLatencyMs || 0} ms
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5">End-to-end inference execution</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-medium">Video Tasks Ratio</div>
            <div className="text-2xl font-extrabold text-pink-400 mt-1 truncate">
              {perf.totalJobs > 0
                ? `${Math.round(((breakdown.TEXT_TO_VIDEO || 0) / perf.totalJobs) * 100)}%`
                : '0%'}
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5">Proportion of compute on video</div>
        </div>
      </div>

      {/* Breakdown by Generation Type */}
      <div className="p-6 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-xl space-y-4">
        <h3 className="font-semibold text-xs text-white">Generation Pipeline Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(breakdown).map(([type, count]) => (
            <div
              key={type}
              className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-center flex flex-col justify-between h-full"
            >
              <div className="text-[11px] text-neutral-300/80 font-mono tracking-tight truncate" title={type}>
                {type}
              </div>
              <div className="text-xl font-extrabold text-cyan-400 mt-1.5">
                {formatNumber(count)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Trend Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40">
          <h3 className="font-semibold text-xs text-white">Daily Throughput & Credit Consumption</h3>
        </div>

        <div className="overflow-x-auto max-h-96 [scrollbar-width:thin] [scrollbar-color:rgba(115,115,115,0.4)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700/80 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/60 text-neutral-300 font-semibold sticky top-0 backdrop-blur z-10 select-none">
                <th className="py-3 px-4 w-[25%]">Date</th>
                <th className="py-3 px-4 w-[25%]">Generations Executed</th>
                <th className="py-3 px-4 w-[25%]">Credits Consumed</th>
                <th className="py-3 px-4 w-[25%]">Revenue Settled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {trend.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-xs text-neutral-400">
                    No daily throughput records found.
                  </td>
                </tr>
              ) : (
                trend.slice(-14).reverse().map((day) => (
                  <tr key={day.date} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-neutral-300 text-[11px] whitespace-nowrap">{day.date}</td>
                    <td className="py-2.5 px-4 font-semibold text-white whitespace-nowrap">{formatNumber(day.jobsCount)}</td>
                    <td className="py-2.5 px-4 text-cyan-400 font-mono whitespace-nowrap">{formatNumber(day.creditsBurned)}</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-semibold whitespace-nowrap">${day.revenue.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminAnalyticsPage
