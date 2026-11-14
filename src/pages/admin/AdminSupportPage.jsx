import React, { useEffect, useState, useCallback } from 'react'
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
import { FieldLabel, lightInputClass, Toast } from '../../components/studio/StudioUI'

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
    <div className="max-w-7xl mx-auto space-y-6">
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
            <h3 className="font-semibold text-xs text-white">Tickets ({tickets.length})</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
            >
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">No support tickets found</div>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTicket(t)}
                  className={`w-full p-4 text-left transition-colors flex flex-col gap-1.5 ${
                    selectedTicket?.id === t.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.status === 'OPEN'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-[10px] text-neutral-500">{t.category}</span>
                  </div>
                  <div className="font-semibold text-xs text-white truncate">{t.subject}</div>
                  <div className="text-[11px] text-neutral-400 truncate">{t.user?.email || 'Customer'}</div>
                  <div className="text-[10px] text-neutral-500">{formatDateTime(t.updatedAt || t.createdAt)}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected Ticket Conversation Thread */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800/80 bg-[#0D111C]/90 shadow-xl overflow-hidden flex flex-col h-[650px]">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedTicket.subject}</h3>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Customer: <span className="text-cyan-400">{selectedTicket.user?.email}</span> • Category: {selectedTicket.category} • Priority: {selectedTicket.priority}
                  </div>
                </div>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedTicket.status === 'OPEN'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#080B14]">
                {selectedTicket.messages?.map((m) => {
                  const isAdmin = m.sender?.role === 'ADMIN' || m.sender?.role === 'SUPER_ADMIN'
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-xl ${
                        isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-neutral-400">
                        {isAdmin ? <ShieldCheck className="w-3 h-3 text-cyan-400" /> : <User className="w-3 h-3" />}
                        <span className="font-semibold text-neutral-300">{isAdmin ? 'Staff Support' : selectedTicket.user?.email}</span>
                        <span>•</span>
                        <span>{formatDateTime(m.createdAt)}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-cyan-950/40 border border-cyan-800/60 text-cyan-100'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 space-y-3">
                <textarea
                  required
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response to customer inquiry..."
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Set Ticket Status:</span>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
                    >
                      <option value="OPEN">Keep Open</option>
                      <option value="RESOLVED">Mark Resolved</option>
                      <option value="CLOSED">Close Ticket</option>
                    </select>
                  </div>

                  <Button variant="gradient" size="sm" type="submit" disabled={sending} leftIcon={Send}>
                    {sending ? 'Sending...' : 'Send Staff Response'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <MessageSquare className="w-8 h-8 text-neutral-600 mb-2" />
              <p className="text-xs font-semibold text-neutral-300">Select an inquiry from the left to inspect conversation</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Real-time two-way support desk thread</p>
            </div>
          )}
        </div>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminSupportPage
