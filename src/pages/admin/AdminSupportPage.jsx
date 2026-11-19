import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  LifeBuoy,
  RefreshCw,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { api } from '../../services/api'
import { formatDateTime } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Toast } from '../../components/studio/StudioUI'
import { cn } from '../../utils/cn'

export function AdminSupportPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyStatus, setReplyStatus] = useState('RESOLVED')
  const [sending, setSending] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const hasActiveContent = tickets.length > 0 || selectedTicket !== null
  const panelHeightClass = hasActiveContent
    ? 'min-h-[460px] lg:h-[calc(100vh-14rem)] lg:min-h-[520px] lg:max-h-[660px]'
    : 'min-h-[300px] sm:min-h-[340px] lg:h-[380px]'

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      const res = await api.get(`/admin/support/tickets?${params.toString()}`)
      if (res.data?.data?.tickets) {
        setTickets(res.data.data.tickets)
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load tickets', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleSelectTicket = async (ticket) => {
    try {
      const res = await api.get(`/admin/support/tickets/${ticket.id}`)
      if (res.data?.data) {
        setSelectedTicket(res.data.data)
      }
    } catch (err) {
      setToast({ message: 'Failed to load ticket details', type: 'error' })
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!selectedTicket || !replyText.trim()) return

    try {
      setSending(true)
      await api.post(`/admin/support/tickets/${selectedTicket.id}/messages`, {
        message: replyText.trim(),
        status: replyStatus
      })
      setToast({ message: 'Reply sent and ticket updated' })
      setReplyText('')
      handleSelectTicket(selectedTicket)
      fetchTickets()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to send reply', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <LifeBuoy className="w-3.5 h-3.5" />
              Customer Success
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Support Desk & Inquiries</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Resolve customer questions, prompt assistance requests, and account inquiries.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#080B14] border border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          title="Refresh support tickets"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Tickets List */}
        <div
          className={cn(
            'rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden flex flex-col transition-all duration-200',
            panelHeightClass
          )}
        >
          {/* Header with fixed height for exact symmetry */}
          <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between gap-3 h-[57px] shrink-0">
            <h3 className="font-bold text-xs text-white shrink-0 flex items-center gap-2">
              <span>Tickets</span>
              <span className="px-1.5 py-0.5 rounded-md bg-neutral-800 border border-neutral-700/60 text-neutral-300 text-[11px] font-mono font-normal">
                {tickets.length}
              </span>
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 hidden sm:inline">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#080B14] border border-neutral-700/80 hover:border-cyan-500/50 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 cursor-pointer shrink-0 transition-colors"
                aria-label="Filter tickets by status"
              >
                <option value="">All</option>
                <option value="OPEN">Open</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mb-2.5" />
                <p className="text-xs font-medium text-neutral-300">Loading support tickets…</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-11 h-11 rounded-2xl bg-neutral-800/70 border border-neutral-700/60 flex items-center justify-center mb-3 text-neutral-400 shadow-inner">
                  <LifeBuoy className="w-5 h-5 text-neutral-300" />
                </div>
                <p className="text-xs font-semibold text-neutral-200">
                  {statusFilter ? `No ${statusFilter.toLowerCase()} tickets found` : 'No support tickets found'}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 max-w-[220px]">
                  {statusFilter ? 'Try switching the status filter back to All.' : 'Inquiries submitted by creators will appear in this list.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/60">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className={cn(
                      'w-full p-4 text-left transition-colors flex flex-col gap-1.5 cursor-pointer',
                      selectedTicket?.id === t.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'hover:bg-neutral-900/40'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0',
                          t.status === 'OPEN'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        )}
                      >
                        {t.status}
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0">{t.category}</span>
                    </div>
                    <div className="font-semibold text-xs text-white truncate" title={t.subject}>{t.subject}</div>
                    <div className="text-[11px] text-neutral-300/80 truncate mt-0.5" title={t.user?.email || 'Customer'}>{t.user?.email || 'Customer'}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{formatDateTime(t.updatedAt || t.createdAt)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Ticket Conversation Thread */}
        <div
          className={cn(
            'lg:col-span-2 rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden flex flex-col transition-all duration-200',
            panelHeightClass
          )}
        >
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between gap-4 min-h-[57px] shrink-0">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white truncate" title={selectedTicket.subject}>{selectedTicket.subject}</h3>
                  <div className="text-xs text-neutral-400 mt-0.5 truncate">
                    Customer: <span className="text-cyan-400 font-medium">{selectedTicket.user?.email || 'N/A'}</span> • Category: {selectedTicket.category || 'General'} • Priority: {selectedTicket.priority || 'Normal'}
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap',
                    selectedTicket.status === 'OPEN'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  )}
                >
                  {selectedTicket.status}
                </span>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 min-h-0 p-5 overflow-y-auto space-y-4 bg-[#080B14]">
                {selectedTicket.messages?.map((m) => {
                  const isAdmin = m.sender?.role === 'ADMIN' || m.sender?.role === 'SUPER_ADMIN'
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col max-w-xl',
                        isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-neutral-400">
                        {isAdmin ? <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" /> : <User className="w-3 h-3 shrink-0" />}
                        <span className="font-semibold text-neutral-300">{isAdmin ? 'Staff Support' : selectedTicket.user?.email}</span>
                        <span>•</span>
                        <span>{formatDateTime(m.createdAt)}</span>
                      </div>
                      <div
                        className={cn(
                          'p-3.5 rounded-2xl text-xs leading-relaxed break-words',
                          isAdmin
                            ? 'bg-cyan-950/40 border border-cyan-800/60 text-cyan-100'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
                        )}
                      >
                        {m.message}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 space-y-3 shrink-0">
                <textarea
                  required
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response to customer inquiry..."
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Set Ticket Status:</span>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none cursor-pointer"
                    >
                      <option value="OPEN">Keep Open</option>
                      <option value="RESOLVED">Mark Resolved</option>
                      <option value="CLOSED">Close Ticket</option>
                    </select>
                  </div>

                  <Button variant="gradient" size="sm" type="submit" disabled={sending} leftIcon={Send} className="cursor-pointer shrink-0">
                    {sending ? 'Sending...' : 'Send Staff Response'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Symmetrical Thread Header for Empty State */}
              <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between gap-3 h-[57px] shrink-0">
                <h3 className="font-bold text-xs text-neutral-300 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Conversation Thread</span>
                </h3>
                <span className="text-[11px] text-neutral-400 font-medium">No ticket selected</span>
              </div>

              <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800/70 border border-neutral-700/60 flex items-center justify-center mb-3 shadow-inner">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-xs font-semibold text-neutral-200">
                  {tickets.length === 0 ? 'No inquiry selected' : 'Select an inquiry from the left to inspect conversation'}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 max-w-sm">
                  {tickets.length === 0
                    ? 'Active two-way customer support tickets and conversation logs will appear here.'
                    : 'Real-time two-way support desk thread. Read message history and post official staff responses.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminSupportPage
