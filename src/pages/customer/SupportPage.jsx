import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { api } from '../../services/api'
import {
  HelpCircle, Search, MessageSquare, Plus, FileText, ChevronDown,
  ChevronUp, CheckCircle, Clock, Send, Sparkles, LifeBuoy, AlertCircle
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, SegmentedTabs, FieldLabel,
  lightInputClass, LightEmptyState, Toast
} from '../../components/studio/StudioUI'
import { HELP_CATEGORIES, HELP_ARTICLES, FAQS, DEMO_TICKETS } from '../../mocks/customerDemoData'
import { formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

export function SupportPage() {
  const [activeTab, setActiveTab] = useState('kb') // 'kb' | 'faq' | 'tickets'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // FAQ accordion
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Articles modal
  const [activeArticle, setActiveArticle] = useState(null)

  // Tickets state
  const [tickets, setTickets] = useState(DEMO_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  // New ticket form
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Generation')
  const [ticketPriority, setTicketPriority] = useState('Normal')
  const [ticketMessage, setTicketMessage] = useState('')

  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  // Filtered KB articles
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return HELP_ARTICLES.filter((a) => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false
      if (q && !`${a.title} ${a.body}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [searchQuery, selectedCategory])

  const normalizeTicket = useCallback((t) => ({
    ...t,
    status: t.status || 'OPEN',
    messages: (t.messages || []).map((m) => ({
      from: m.from || (m.sender?.role === 'ADMIN' || m.sender?.role === 'SUPER_ADMIN' ? 'support' : 'you'),
      at: m.at || m.createdAt,
      text: m.text || m.message
    }))
  }), [])

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await api.get('/support/tickets')
        if (res.data?.data && res.data.data.length > 0) {
          const normalized = res.data.data.map(normalizeTicket)
          setTickets(normalized)
        }
      } catch (err) {
        // Keep demo tickets if unauthenticated or offline
      }
    }
    loadTickets()
  }, [normalizeTicket])

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) return

    try {
      const res = await api.post('/support/tickets', {
        subject: ticketSubject.trim(),
        category: ticketCategory,
        priority: ticketPriority.toUpperCase(),
        message: ticketMessage.trim()
      })
      const created = normalizeTicket(res.data?.data)
      setTickets([created, ...tickets])
      setSelectedTicket(created)
      setNewTicketModalOpen(false)
      setTicketSubject('')
      setTicketMessage('')
      setActiveTab('tickets')
      setToast({ message: `Ticket ${created.id.slice(0, 8)} submitted. Support will respond shortly.` })
    } catch (err) {
      const newT = {
        id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: ticketSubject.trim(),
        category: ticketCategory,
        priority: ticketPriority,
        status: 'Open',
        createdAt: new Date().toISOString(),
        messages: [
          {
            from: 'you',
            at: new Date().toISOString(),
            text: ticketMessage.trim()
          }
        ]
      }
      setTickets([newT, ...tickets])
      setSelectedTicket(newT)
      setNewTicketModalOpen(false)
      setTicketSubject('')
      setTicketMessage('')
      setActiveTab('tickets')
      setToast({ message: `Ticket ${newT.id} submitted (Offline fallback).` })
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedTicket) return

    const newMsg = {
      from: 'you',
      at: new Date().toISOString(),
      text: replyText.trim()
    }

    try {
      await api.post(`/support/tickets/${selectedTicket.id}/messages`, {
        message: replyText.trim()
      })
      const updated = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMsg]
      }
      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)))
      setSelectedTicket(updated)
      setReplyText('')
      setToast({ message: 'Reply posted to ticket thread.' })
    } catch (err) {
      const updated = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMsg]
      }
      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)))
      setSelectedTicket(updated)
      setReplyText('')
      setToast({ message: 'Reply posted to ticket thread (Local).' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <StudioPageHeader
        icon={HelpCircle}
        section="Account & Billing"
        crumb="Help & Support"
        title="Help & Support Desk"
        description="Search documentation, find answers to common questions or submit a ticket."
        actions={
          <Button variant="gradient" leftIcon={Plus} onClick={() => setNewTicketModalOpen(true)}>
            Open Support Ticket
          </Button>
        }
      />

      {/* Navigation tabs */}
      <SegmentedTabs
        value={activeTab}
        onChange={setActiveTab}
        options={[
          { value: 'kb', label: 'Knowledge Base', icon: FileText },
          { value: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
          { value: 'tickets', label: `My Tickets (${tickets.length})`, icon: MessageSquare }
        ]}
      />

      {/* Knowledge Base Tab */}
      {activeTab === 'kb' && (
        <div className="space-y-5">
          <Panel className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tutorials, prompt engineering guides, model latency…"
                className="flex-1 max-w-lg"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all',
                    selectedCategory === 'all'
                      ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60'
                      : 'bg-[#080B14] text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
                  )}
                >
                  All Categories
                </button>
                {HELP_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all',
                      selectedCategory === cat.id
                        ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60'
                        : 'bg-[#080B14] text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl border border-neutral-800/90 p-5 shadow-sm hover:border-cyan-500/60 hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col justify-between text-neutral-100"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-800/60">
                    {HELP_CATEGORIES.find((c) => c.id === art.category)?.label || 'General'}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2.5 line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2">
                    {art.body}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>{art.readMins} min read</span>
                  <span className="text-cyan-400 font-semibold group-hover:underline">Read article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faq' && (
        <Panel className="space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Frequently Asked Questions</h3>
          <div className="divide-y divide-neutral-800">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx
              return (
                <div key={idx} className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-neutral-100 hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed pr-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </Panel>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Ticket List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={cn(
                      'p-4 rounded-2xl border text-left cursor-pointer transition-all bg-[#0D111C]/90 backdrop-blur-md shadow-sm',
                      isSelected
                        ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                        : 'border-neutral-800 hover:border-neutral-700'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-neutral-400 font-bold">{t.id}</span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                        t.status === 'Open' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      )}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{t.messages[t.messages.length - 1]?.text}</p>
                    <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{t.category} • {t.priority}</span>
                      <span>{formatDateTime(t.createdAt).split(',')[0]}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Conversation Thread (7 cols) */}
            <div className="lg:col-span-7">
              {selectedTicket ? (
                <Panel className="space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-cyan-400">{selectedTicket.id}</span>
                      <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                      <p className="text-[11px] text-neutral-400">
                        Category: {selectedTicket.category} • Priority: {selectedTicket.priority} • Opened {formatDateTime(selectedTicket.createdAt)}
                      </p>
                    </div>
                    <span className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-full uppercase',
                      selectedTicket.status === 'Open' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                    )}>
                      {selectedTicket.status}
                    </span>
                  </div>

                  {/* Message history */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {selectedTicket.messages.map((m, idx) => {
                      const isYou = m.from === 'you'
                      return (
                        <div
                          key={idx}
                          className={cn(
                            'p-3.5 rounded-xl max-w-[85%] text-xs leading-relaxed',
                            isYou
                              ? 'ml-auto bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                              : 'mr-auto bg-[#080B14] text-neutral-200 border border-neutral-800'
                          )}
                        >
                          <div className={cn('text-[10px] font-semibold mb-1 opacity-80', isYou ? 'text-cyan-100' : 'text-neutral-400')}>
                            {isYou ? 'You' : 'Support Specialist'} • {formatDateTime(m.at)}
                          </div>
                          <p>{m.text}</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} className="pt-3 border-t border-neutral-800 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a reply to support team…"
                      className="flex-1 rounded-xl px-3 py-2 text-xs bg-[#080B14] border border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <Button variant="primary" size="sm" type="submit" leftIcon={Send} className="text-xs">
                      Send
                    </Button>
                  </form>
                </Panel>
              ) : (
                <Panel className="flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                  <LifeBuoy className="w-8 h-8 text-neutral-600 mb-2" />
                  <p className="text-xs font-semibold text-neutral-300">Select a ticket to review conversation thread</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Or click Open Support Ticket above.</p>
                </Panel>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      <Modal
        theme="dark"
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title}
        description={activeArticle?.readMins + ' min read • Studio Documentation'}
        className="max-w-2xl bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        {activeArticle && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-300 leading-relaxed">{activeArticle.body}</p>
            <div className="p-3 bg-[#080B14] rounded-xl border border-neutral-800 text-xs text-neutral-400">
              Need more help with this topic? Open a ticket from the support desk and our engineering team will answer.
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveArticle(null)} className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700">
                Close Article
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Ticket Modal */}
      <Modal
        theme="dark"
        isOpen={newTicketModalOpen}
        onClose={() => setNewTicketModalOpen(false)}
        title="Open Support Ticket"
        description="Demo mode: creates a mock ticket in your browser's local state."
        className="max-w-lg bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <FieldLabel htmlFor="tck-sub">Issue Subject *</FieldLabel>
            <input
              id="tck-sub"
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Model inference latency high on Wan 2.1"
              className={lightInputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="tck-cat">Category</FieldLabel>
              <select
                id="tck-cat"
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className={lightInputClass}
              >
                <option value="Generation">Generation</option>
                <option value="Billing">Billing & Credits</option>
                <option value="Account">Account Security</option>
                <option value="API">API Integration</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="tck-pri">Priority</FieldLabel>
              <select
                id="tck-pri"
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value)}
                className={lightInputClass}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="tck-msg">Message & Reproduction Details *</FieldLabel>
            <textarea
              id="tck-msg"
              required
              rows={4}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe the issue, generation parameters, job ID or unexpected error…"
              className={lightInputClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewTicketModalOpen(false)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white">
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Submit Ticket (Demo)
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default SupportPage
