import React, { useEffect, useState, useCallback } from 'react'
import {
  Coins,
  RefreshCw,
  TrendingDown,
  Gift,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { api } from '../../services/api'
import { formatNumber, formatDateTime } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminCreditsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [categoryFilter, setCategoryFilter] = useState('')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchCredits = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', '10')
      if (categoryFilter) params.append('category', categoryFilter)

      const res = await api.get(`/admin/credits?${params.toString()}`)
      if (res.data?.data) {
        setData(res.data.data)
        setPagination(res.data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load credits overview', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [categoryFilter])

  useEffect(() => {
    fetchCredits(1)
  }, [fetchCredits])

  const metrics = data?.metrics || {}
  const transactions = data?.transactions || []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Coins className="w-3.5 h-3.5" />
              Token Economics
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Credit Circulation & Ledger</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor system-wide wallet balances, inference burn rates, admin grants, and refund integrity.
          </p>
        </div>

        <button
          onClick={() => fetchCredits(pagination.page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">In Circulation</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1 flex items-center gap-1">
            <Coins className="w-5 h-5 text-cyan-400" />
            {formatNumber(metrics.totalCirculating || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Sum of active customer wallet balances</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Burned on Inference</div>
          <div className="text-2xl font-extrabold text-pink-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-5 h-5 text-pink-400" />
            {formatNumber(metrics.totalConsumed || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Deducted on completed generation jobs</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Platform Grants & Top-Ups</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-1">
            <Gift className="w-5 h-5 text-emerald-400" />
            {formatNumber(metrics.totalGranted || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Welcome bonuses, top-ups & plan allowances</div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-white">System-Wide Transaction Ledger</h3>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="IMAGE_GENERATION">Image Generation</option>
            <option value="VIDEO_GENERATION">Video Generation</option>
            <option value="ADMIN_GRANT">Admin Grant</option>
            <option value="REFUND">Refund</option>
            <option value="TOPUP_PACK">Top-Up Pack</option>
            <option value="PLAN_ALLOWANCE">Plan Allowance</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/20 text-neutral-400 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    No transactions recorded matching filter.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-200">{tx.user?.fullName || tx.user?.email || 'N/A'}</div>
                      <div className="text-[10px] text-neutral-500">{tx.user?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-cyan-300">{tx.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-extrabold flex items-center gap-0.5 ${
                          tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? '+' : '-'}
                        {formatNumber(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.type === 'CREDIT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{tx.description}</td>
                    <td className="py-3 px-4 text-neutral-400">{formatDateTime(tx.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400">
          <div>
            Showing {transactions.length} of {pagination.total} transactions
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchCredits(pagination.page - 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 text-neutral-300 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchCredits(pagination.page + 1)}
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

export default AdminCreditsPage
