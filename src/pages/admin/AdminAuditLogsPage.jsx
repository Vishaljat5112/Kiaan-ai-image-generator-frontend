import React, { useEffect, useState, useCallback } from 'react'
import {
  ShieldAlert,
  RefreshCw,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Shield
} from 'lucide-react'
import { api } from '../../services/api'
import { formatDateTime } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 })
  const [actionFilter, setActionFilter] = useState('')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', '15')
      if (actionFilter) params.append('action', actionFilter)

      const res = await api.get(`/admin/audit-logs?${params.toString()}`)
      if (res.data?.data) {
        setLogs(res.data.data.logs || [])
        setPagination(res.data.data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load audit logs', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [actionFilter])

  useEffect(() => {
    fetchLogs(1)
  }, [fetchLogs])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              Security & Compliance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Audit & Governance Logs</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Immutable tracking of administrative mutations, permission changes, credit adjustments, and cluster reconfigurations.
          </p>
        </div>

        <button
          onClick={() => fetchLogs(pagination.page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-md flex items-center justify-between">
        <h3 className="font-semibold text-xs text-white">Immutable Event Ledger</h3>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
        >
          <option value="">All Administrative Actions</option>
          <option value="CREDIT_ADJUSTMENT">Credit Adjustment</option>
          <option value="USER_STATUS_UPDATE">User Status Update</option>
          <option value="USER_ROLE_UPDATE">User Role Update</option>
          <option value="GPU_NODE_UPDATE">GPU Node Update</option>
          <option value="AI_MODEL_UPDATE">AI Model Update</option>
          <option value="SUBSCRIPTION_PLAN_UPDATE">Plan Update</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 font-semibold">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Diff Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{log.actor?.fullName || log.actor?.email}</div>
                      <div className="text-[10px] text-neutral-400">{log.actor?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-300">{log.targetEntity}</span>
                      {log.targetId && (
                        <div className="text-[10px] font-mono text-neutral-500">{log.targetId.slice(0, 8)}...</div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-neutral-300 font-mono">
                      {log.diffJson ? JSON.stringify(log.diffJson) : '—'}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="py-3 px-4 text-neutral-400">{formatDateTime(log.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400">
          <div>
            Showing {logs.length} of {pagination.total} audit records
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchLogs(pagination.page - 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 text-neutral-300 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchLogs(pagination.page + 1)}
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

export default AdminAuditLogsPage
