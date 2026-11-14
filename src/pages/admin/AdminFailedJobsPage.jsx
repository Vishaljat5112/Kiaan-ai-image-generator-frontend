import React, { useEffect, useState, useCallback } from 'react'
import {
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { api } from '../../services/api'
import { formatDateTime } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminFailedJobsPage() {
  const [failedJobs, setFailedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchFailed = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const res = await api.get(`/admin/jobs/failed?page=${page}&limit=10`)
      if (res.data?.data) {
        setFailedJobs(res.data.data.jobs || [])
        setPagination(res.data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to fetch failed jobs', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFailed(1)
  }, [fetchFailed])

  const handleRetry = async (jobId) => {
    try {
      await api.post(`/admin/jobs/${jobId}/retry`)
      setToast({ message: 'Job re-queued to worker backlog' })
      fetchFailed(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Retry failed', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Exception Inspector
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Failed Generation Jobs</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Inspect stack traces, hardware OOM exceptions, worker drops, and execute manual re-queues.
          </p>
        </div>

        <button
          onClick={() => fetchFailed(pagination.page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 font-semibold">
                <th className="py-3 px-4">Job ID / User</th>
                <th className="py-3 px-4">Type / Model</th>
                <th className="py-3 px-4">Error Diagnostics</th>
                <th className="py-3 px-4">Failed At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {failedJobs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-400">
                    <CheckCircle className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
                    Zero failed generation tasks. Cluster inference is running smoothly!
                  </td>
                </tr>
              ) : (
                failedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-rose-300">{job.id.slice(0, 8)}...</div>
                      <div className="text-[11px] text-neutral-400">{job.user?.email || 'System'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{job.type}</div>
                      <div className="text-[10px] text-cyan-400">{job.modelId}</div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/50 text-[11px] text-rose-300 font-mono leading-tight">
                        {job.errorMessage || 'Unknown inference runtime failure'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{formatDateTime(job.updatedAt || job.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRetry(job.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-cyan-400 border border-neutral-700 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400">
          <div>
            Showing {failedJobs.length} of {pagination.total} failed jobs
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchFailed(pagination.page - 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 text-neutral-300 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchFailed(pagination.page + 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminFailedJobsPage
