import React, { useEffect, useState, useCallback } from 'react'
import {
  Layers,
  RefreshCw,
  Clock,
  Cpu,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play
} from 'lucide-react'
import { api } from '../../services/api'
import { formatNumber, formatDateTime } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminQueuePage() {
  const [metrics, setMetrics] = useState(null)
  const [activeJobs, setActiveJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchQueueData = useCallback(async () => {
    try {
      setLoading(true)
      const [metricsRes, jobsRes] = await Promise.all([
        api.get('/admin/queue'),
        api.get('/admin/jobs?status=PROCESSING&limit=10')
      ])
      if (metricsRes.data?.data) {
        setMetrics(metricsRes.data.data)
      }
      if (jobsRes.data?.data?.jobs) {
        setActiveJobs(jobsRes.data.data.jobs)
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load queue metrics', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueueData()
    const interval = setInterval(fetchQueueData, 8000)
    return () => clearInterval(interval)
  }, [fetchQueueData])

  const handleCancel = async (jobId) => {
    if (!confirm('Are you sure you want to cancel this job and refund the user?')) return
    try {
      await api.post(`/admin/jobs/${jobId}/cancel`, { reason: 'Admin canceled from queue monitor' })
      setToast({ message: 'Job canceled and credits refunded' })
      fetchQueueData()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Cancellation failed', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              Real-Time Workload
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Active Task Queues & Workers</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor real-time task queue depth, worker assignments, execution latency, and pipeline backpressure.
          </p>
        </div>

        <button
          onClick={fetchQueueData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Queued Backlog</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">
            {loading && !metrics ? '...' : formatNumber(metrics?.queuedJobs || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Waiting for available worker</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Active Processing</div>
          <div className="text-2xl font-extrabold text-pink-400 mt-1">
            {loading && !metrics ? '...' : formatNumber(metrics?.processingJobs || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Currently running inference</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Active Fleet Nodes</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {loading && !metrics ? '...' : formatNumber(metrics?.activeWorkers || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">GPU workers polling for jobs</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Est. Wait Time</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {loading && !metrics ? '...' : `~${metrics?.estimatedWaitSeconds || 0}s`}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Avg latency: {metrics?.avgExecutionMs || 0}ms</div>
        </div>
      </div>

      {/* Active Jobs Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-white">Jobs In Flight (Running Workers)</h3>
          <span className="text-[11px] text-neutral-400 font-mono">Live Sync every 8s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/20 text-neutral-400 font-semibold">
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {activeJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    Task queue is idle. No jobs currently executing.
                  </td>
                </tr>
              ) : (
                activeJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-300">
                      {job.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{job.type}</td>
                    <td className="py-3 px-4 text-cyan-400">{job.modelId}</td>
                    <td className="py-3 px-4 text-neutral-400">{job.user?.email || 'System'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-pink-500 transition-all duration-300"
                            style={{ width: `${job.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-neutral-300 font-medium">
                          {job.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{formatDateTime(job.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCancel(job.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-800 hover:bg-rose-950/40 text-rose-400 border border-neutral-700 transition-colors"
                      >
                        Cancel & Refund
                      </button>
                    </td>
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

export default AdminQueuePage
