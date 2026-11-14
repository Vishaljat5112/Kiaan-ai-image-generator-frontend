import React, { useEffect, useState, useCallback } from 'react'
import {
  DollarSign,
  RefreshCw,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { api } from '../../services/api'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { Toast } from '../../components/studio/StudioUI'

export function AdminRevenuePage() {
  const [revenueData, setRevenueData] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', '10')
      if (statusFilter) params.append('status', statusFilter)

      const [revRes, invRes] = await Promise.all([
        api.get('/admin/revenue'),
        api.get(`/admin/invoices?${params.toString()}`)
      ])

      if (revRes.data?.data) {
        setRevenueData(revRes.data.data)
      }
      if (invRes.data?.data?.invoices) {
        setInvoices(invRes.data.data.invoices)
        setPagination(invRes.data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load revenue data', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              Financial Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Revenue, Invoices & MRR</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Confirmed platform revenue strictly calculated from settled transactions and paid invoices.
          </p>
        </div>

        <button
          onClick={() => fetchData(pagination.page)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Confirmed Revenue</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(revenueData?.confirmedRevenue || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Settled payments only</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Pending Receivables</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {formatCurrency(revenueData?.pendingRevenue || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Unsettled checkout orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Estimated MRR</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">
            {formatCurrency(revenueData?.estimatedMrr || 0)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {revenueData?.activeSubscribers || 0} active subscribers
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg">
          <div className="text-xs text-neutral-400 font-medium">Total Invoices</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">
            {revenueData?.totalInvoices || 0}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">All billing ledger entries</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
          <h3 className="font-semibold text-xs text-white">Billing Invoices & Receipts</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
          >
            <option value="">All Invoices</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/20 text-neutral-400 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    No invoices recorded matching filter.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-400">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-200">{inv.user?.fullName || inv.user?.email}</div>
                      <div className="text-[10px] text-neutral-500">{inv.user?.email}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{inv.description}</td>
                    <td className="py-3 px-4 font-bold text-white">{formatCurrency(inv.amount)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{formatDateTime(inv.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-400">
          <div>
            Showing {invoices.length} of {pagination.total} invoices
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchData(pagination.page - 1)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 text-neutral-300 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchData(pagination.page + 1)}
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

export default AdminRevenuePage
