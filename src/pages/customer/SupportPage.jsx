import React, { useMemo, useState, useCallback } from 'react'
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

  const handleCreateTicket = (e) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) return

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
    setNewTicketModalOpen(false)
    setTicketSubject('')
    setTicketMessage('')
    setActiveTab('tickets')
    setToast({ message: `Ticket ${newT.id} submitted (Demo). Support will respond shortly.` })
  }

  const handleSendReply = (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedTicket) return

    const updated = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          from: 'you',
          at: new Date().toISOString(),
          text: replyText.trim()
        }
      ]
    }

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)))
    setSelectedTicket(updated)
    setReplyText('')
    setToast({ message: 'Reply posted to ticket thread.' })
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
                placeholder="Search tutorials, prompt engineering guides, model latency�"
                className="flex-1 max-w-lg"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all',
                    selectedCategory === 'all'
                      ? 'bg-violet-50 text-violet-700 border-violet-200'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
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
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
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
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:border-violet-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                    {HELP_CATEGORIES.find((c) => c.id === art.category)?.label || 'General'}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-2.5 line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
                    {art.body}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>{art.readMins} min read</span>
                  <span className="text-violet-600 font-semibold group-hover:underline">Read article ?</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faq' && (
        <Panel className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 mb-2">Frequently Asked Questions</h3>
          <div className="divide-y divide-neutral-100">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx
              return (
                <div key={idx} className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-neutral-900 hover:text-violet-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-violet-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed pr-6">
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
                      'p-4 rounded-2xl border text-left cursor-pointer transition-all bg-white shadow-sm',
                      isSelected
                        ? 'border-violet-600 ring-2 ring-violet-500/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-neutral-400 font-bold">{t.id}</span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                        t.status === 'Open' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      )}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{t.messages[t.messages.length - 1]?.text}</p>
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{t.category} � {t.priority}</span>
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
                  <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-violet-600">{selectedTicket.id}</span>
                      <h3 className="text-sm font-bold text-neutral-900">{selectedTicket.subject}</h3>
                      <p className="text-[11px] text-neutral-500">
                        Category: {selectedTicket.category} � Priority: {selectedTicket.priority} � Opened {formatDateTime(selectedTicket.createdAt)}
                      </p>
                    </div>
                    <span className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-full uppercase',
                      selectedTicket.status === 'Open' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                              ? 'ml-auto bg-violet-600 text-white'
                              : 'mr-auto bg-neutral-100 text-neutral-800 border border-neutral-200'
                          )}
                        >
                          <div className={cn('text-[10px] font-semibold mb-1 opacity-80', isYou ? 'text-violet-100' : 'text-neutral-500')}>
                            {isYou ? 'You' : 'Support Specialist'} � {formatDateTime(m.at)}
                          </div>
                          <p>{m.text}</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} className="pt-3 border-t border-neutral-100 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a reply to support team�"
                      className="flex-1 rounded-xl px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <Button variant="primary" size="sm" type="submit" leftIcon={Send} className="text-xs">
                      Send
                    </Button>
                  </form>
                </Panel>
              ) : (
                <Panel className="flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                  <LifeBuoy className="w-8 h-8 text-neutral-300 mb-2" />
                  <p className="text-xs font-semibold text-neutral-600">Select a ticket to review conversation thread</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Or click Open Support Ticket above.</p>
                </Panel>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      <Modal
        theme="light"
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title}
        description={activeArticle?.readMins + ' min read � Studio Documentation'}
        className="max-w-2xl"
      >
        {activeArticle && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-700 leading-relaxed">{activeArticle.body}</p>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
              Need more help with this topic? Open a ticket from the support desk and our engineering team will answer.
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveArticle(null)}>
                Close Article
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Ticket Modal */}
      <Modal
        theme="light"
        isOpen={newTicketModalOpen}
        onClose={() => setNewTicketModalOpen(false)}
        title="Open Support Ticket"
        description="Demo mode: creates a mock ticket in your browser's local state."
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
              placeholder="Describe the issue, generation parameters, job ID or unexpected error�"
              className={lightInputClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewTicketModalOpen(false)} className="text-neutral-700 border-neutral-300">
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
