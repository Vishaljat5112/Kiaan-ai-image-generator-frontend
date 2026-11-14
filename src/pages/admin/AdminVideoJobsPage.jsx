import React, { useEffect, useState, useCallback } from 'react'
import {
  Video,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { api } from '../../services/api'
import { formatDateTime } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminVideoJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchJobs = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', '10')
      params.append('type', 'TEXT_TO_VIDEO')
      if (search.trim()) params.append('search', search.trim())
      if (statusFilter) params.append('status', statusFilter)

      const res = await api.get(`/admin/jobs?${params.toString()}`)
      if (res.data?.data) {
        setJobs(res.data.data.jobs || [])
        setPagination(res.data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to fetch video jobs', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchJobs(1)
  }, [fetchJobs])

  const handleCancel = async (id) => {
    try {
      await api.post(`/admin/jobs/${id}/cancel`, { reason: 'Admin canceled video job' })
      setToast({ message: 'Video job canceled and refunded' })
      fetchJobs(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Cancel failed', type: 'error' })
    }
  }

  const handleRetry = async (id) => {
    try {
      await api.post(`/admin/jobs/${id}/retry`)
      setToast({ message: 'Video job re-queued successfully' })
      fetchJobs(pagination.page)
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Retry failed', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400">
              <Video className="w-3.5 h-3.5" />
              Heavy Inference
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Video Generation Tasks</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor and govern Text-to-Video and Image-to-Video pipelines running on Wan 2.1 clusters.
          </p>
        </div>

        <button
          onClick={() => fetchJobs(pagination.page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-md flex items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompt, video job ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="QUEUED">Queued</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELED">Canceled</option>
        </select>
      </div>

      {/* Jobs Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 font-semibold">
                <th className="py-3 px-4">Job / Prompt</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    No video generation tasks found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="font-medium text-neutral-200 truncate">{job.prompt || 'No prompt specified'}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{job.id}</div>
                    </td>
                    <td className="py-3 px-4 text-pink-400 font-medium">{job.modelId}</td>
                    <td className="py-3 px-4 text-neutral-400">{job.user?.email || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          job.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : job.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : job.status === 'CANCELED'
                            ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-semibold">{job.creditCost}</td>
                    <td className="py-3 px-4 text-neutral-400">{formatDateTime(job.createdAt)}</td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {['QUEUED', 'PROCESSING'].includes(job.status) && (
                        <button
                          onClick={() => handleCancel(job.id)}
                          className="px-2 py-1 rounded-lg text-[11px] font-medium bg-neutral-800 hover:bg-rose-950/40 text-rose-400 border border-neutral-700"
                        >
                          Cancel
                        </button>
                      )}
                      {['FAILED', 'CANCELED'].includes(job.status) && (
                        <button
                          onClick={() => handleRetry(job.id)}
                          className="px-2 py-1 rounded-lg text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-cyan-400 border border-neutral-700"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400">
          <div>
            Showing {jobs.length} of {pagination.total} jobs
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchJobs(pagination.page - 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 text-neutral-300 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchJobs(pagination.page + 1)}
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

export default AdminVideoJobsPage
