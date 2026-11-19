import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  CreditCard, Check, Sparkles, Zap, Shield, HelpCircle,
  Clock, ArrowRight, AlertCircle, FileText, Download, Info,
  ChevronDown, Filter
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, Toast
} from '../../components/studio/StudioUI'
import { DEMO_BILLING_HISTORY } from '../../mocks/customerDemoData'
import { MOCK_PLANS } from '../../mocks/mockData'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime, formatUSD } from '../../utils/format'
import { cn } from '../../utils/cn'

export function SubscriptionPage() {
  const { user } = useAuth()
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'yearly'
  const [currentPlanId, setCurrentPlanId] = useState('plan_creator')
  const [invoices, setInvoices] = useState(DEMO_BILLING_HISTORY)
  const [statusFilter, setStatusFilter] = useState('all')
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const statusMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsStatusMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'pending', label: 'Pending' }
  ]
  const selectedStatus = statusOptions.find((s) => s.value === statusFilter) || statusOptions[0]

  const filteredInvoices = useMemo(() => {
    if (!Array.isArray(invoices)) return []
    return invoices.filter((inv) => {
      if (!inv) return false
      if (statusFilter === 'all') return true
      return String(inv.status || '').toLowerCase() === statusFilter.toLowerCase()
    })
  }, [invoices, statusFilter])
  const [confirmModalPlan, setConfirmModalPlan] = useState(null)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const currentPlan = MOCK_PLANS.find((p) => p.id === currentPlanId) || MOCK_PLANS[1]

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlanId) return
    setConfirmModalPlan(plan)
  }

  const handleConfirmPlanChange = () => {
    if (!confirmModalPlan) return
    setCurrentPlanId(confirmModalPlan.id)
    const newInvoice = {
      id: `INV-${new Date().getFullYear()}-00${invoices.length + 10}`,
      date: new Date().toISOString(),
      description: `${confirmModalPlan.name} plan • ${billingCycle} (Demo Switch)`,
      amount: billingCycle === 'yearly' ? Math.round(confirmModalPlan.price * 10) : confirmModalPlan.price,
      status: 'Paid'
    }
    setInvoices([newInvoice, ...invoices])
    setToast({ message: `Switched plan to ${confirmModalPlan.name} (${billingCycle}) in local demo session.` })
    setConfirmModalPlan(null)
  }

  const handleDownloadReceipt = useCallback((inv) => {
    try {
      const escapePdf = (s) => String(s || '').replace(/[()\\]/g, (c) => '\\' + c)
      const safeId = escapePdf(inv.id || 'INV-RECEIPT')
      const safeDate = escapePdf(inv.date ? inv.date.split('T')[0] : 'N/A')
      const safeDesc = escapePdf(inv.description || 'Creative Subscription')
      const safeAmount = escapePdf(typeof inv.amount === 'number' ? `$${inv.amount.toFixed(2)} USD` : '$0.00 USD')
      const safeStatus = escapePdf(String(inv.status || 'PAID').toUpperCase())

      const streamContent = [
        'BT',
        '/F1 20 Tf',
        '50 720 Td',
        '(KIAAN STUDIO - PAYMENT RECEIPT) Tj',
        '/F1 10 Tf',
        '0 -24 Td',
        '(Sovereign Creative AI Platform - Customer Invoicing) Tj',
        '0 -28 Td',
        '/F1 11 Tf',
        '(======================================================================) Tj',
        '0 -24 Td',
        '/F1 13 Tf',
        '(RECEIPT SUMMARY) Tj',
        '/F1 10 Tf',
        '0 -22 Td',
        '(' + 'Invoice Number : ' + safeId + ') Tj',
        '0 -18 Td',
        '(' + 'Billing Date   : ' + safeDate + ') Tj',
        '0 -18 Td',
        '(' + 'Item / Plan    : ' + safeDesc + ') Tj',
        '0 -18 Td',
        '(' + 'Total Amount   : ' + safeAmount + ') Tj',
        '0 -18 Td',
        '(' + 'Payment Status : ' + safeStatus + ') Tj',
        '0 -18 Td',
        '(' + 'Currency       : USD - United States Dollar) Tj',
        '0 -26 Td',
        '/F1 11 Tf',
        '(======================================================================) Tj',
        '0 -24 Td',
        '/F1 9 Tf',
        '(This is an official computer-generated receipt from Kiaan Studio.) Tj',
        '0 -15 Td',
        '(For billing support and queries: billing@kiaanstudio.ai) Tj',
        '0 -15 Td',
        '(https://kiaan.ai - All rights reserved.) Tj',
        'ET'
      ].join('\n')

      const encoder = new TextEncoder()
      const streamBytes = encoder.encode(streamContent)
      const streamLength = streamBytes.length

      const header = '%PDF-1.4\n'
      const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'
      const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'
      const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n'
      const obj4 = '4 0 obj\n<< /Length ' + streamLength + ' >>\nstream\n' + streamContent + '\nendstream\nendobj\n'
      const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'

      const offset1 = encoder.encode(header).length
      const offset2 = offset1 + encoder.encode(obj1).length
      const offset3 = offset2 + encoder.encode(obj2).length
      const offset4 = offset3 + encoder.encode(obj3).length
      const offset5 = offset4 + encoder.encode(obj4).length
      const xrefOffset = offset5 + encoder.encode(obj5).length

      let xref = 'xref\n0 6\n'
      xref += '0000000000 65535 f \n'
      xref += String(offset1).padStart(10, '0') + ' 00000 n \n'
      xref += String(offset2).padStart(10, '0') + ' 00000 n \n'
      xref += String(offset3).padStart(10, '0') + ' 00000 n \n'
      xref += String(offset4).padStart(10, '0') + ' 00000 n \n'
      xref += String(offset5).padStart(10, '0') + ' 00000 n \n'

      const trailer = 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n'

      const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer
      const blob = new Blob([fullPdf], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${inv.id || 'receipt'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setToast({ message: `Downloaded receipt ${inv.id}.pdf` })
    } catch {
      setToast({ message: `Failed to download receipt for ${inv.id}.` })
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pt-1.5 sm:pt-2">
      <StudioPageHeader
        icon={CreditCard}
        section="Account & Billing"
        crumb="Subscription"
        title="Subscription & Plans"
        description="Manage your recurring creative tier, concurrency limits and invoice history."
      />

      {/* Active Subscription Overview Card */}
      <div className="bg-gradient-to-r from-[#0D111C] via-[#161F30] to-[#0D111C] rounded-2xl p-6 sm:p-8 text-white border border-cyan-800/40 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Active Plan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{currentPlan.name} Tier</h2>
            <p className="text-neutral-300 text-sm mt-1 max-w-xl">
              Includes {currentPlan.credits} credits refreshed monthly, priority queue scheduling, and full commercial license.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="text-left sm:text-right sm:pr-4 sm:border-r border-neutral-700">
              <p className="text-xs text-neutral-400">Next renewal</p>
              <p className="text-base font-bold text-white">01 Dec 2026</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const starter = MOCK_PLANS[0]
                setConfirmModalPlan(starter)
              }}
              className="bg-[#080B14] text-neutral-300 hover:text-white border border-neutral-700 shadow-sm cursor-pointer"
            >
              Cancel / Downgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h3 className="text-lg font-bold text-white">Choose the Plan That Fits Your Workflow</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Scale GPU resources, concurrency pipelines and monthly allowances.</p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-[#080B14] border border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
              billingCycle === 'monthly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs' : 'text-neutral-400 hover:text-white'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
              billingCycle === 'yearly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs' : 'text-neutral-400 hover:text-white'
            )}
          >
            Yearly
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MOCK_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId
          const price = billingCycle === 'yearly' ? Math.round(plan.price * 0.8) : plan.price

          return (
            <div
              key={plan.id}
              className={cn(
                'bg-[#0D111C]/90 backdrop-blur-md rounded-2xl border p-6 flex flex-col justify-between transition-all relative',
                isCurrent
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg'
                  : 'border-neutral-800 hover:border-neutral-700 shadow-sm'
              )}
            >
              {plan.id === 'plan_pro' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                <h4 className="text-base font-bold text-white">{plan.name}</h4>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-neutral-300">/ month</span>
                </div>
                <p className="text-xs font-semibold text-cyan-400 mt-1">
                  {plan.credits.toLocaleString()} Credits / mo
                </p>

                <div className="mt-6 pt-5 border-t border-neutral-800 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                    Included Capabilities
                  </span>
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Button
                  variant={isCurrent ? 'secondary' : 'gradient'}
                  size="sm"
                  disabled={isCurrent}
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full text-xs py-2 cursor-pointer"
                >
                  {isCurrent ? 'Active Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade Plan'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Invoice & Billing History Table */}
      <Panel className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Billing & Receipt History
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              View generated monthly invoices and payment receipts (Demo).
            </p>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative shrink-0" ref={statusMenuRef}>
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen((prev) => !prev)}
              className={cn(
                "h-[38px] px-3.5 rounded-xl bg-[#080B14] border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                isStatusMenuOpen
                  ? "border-cyan-500 text-white shadow-sm shadow-cyan-500/10"
                  : "border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white"
              )}
              aria-expanded={isStatusMenuOpen}
              aria-haspopup="true"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{selectedStatus.label}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ml-0.5",
                  isStatusMenuOpen && "rotate-180"
                )}
              />
            </button>

            {isStatusMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-[#0D111C] border border-neutral-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  STATUS FILTER
                </div>
                <div className="space-y-0.5 px-1">
                  {statusOptions.map((opt) => {
                    const isSelected = statusFilter === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.value)
                          setIsStatusMenuOpen(false)
                        }}
                        className={cn(
                          "w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                          isSelected
                            ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                            : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {opt.value === 'paid' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          )}
                          {opt.value === 'refunded' && (
                            <span className="w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
                          )}
                          {opt.value === 'pending' && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                          )}
                          {opt.value === 'all' && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          )}
                          <span className="truncate">{opt.label}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1.5" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#080B14] text-[11px] uppercase tracking-wider text-neutral-300 font-semibold border-b border-neutral-800">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Invoice</th>
                <th className="text-left font-semibold px-4 py-3">Date</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Description</th>
                <th className="text-left font-semibold px-4 py-3">Amount</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-right font-semibold px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-neutral-400">
                    No invoices found matching &ldquo;{selectedStatus.label}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#161F30]/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold font-mono text-white">{inv.id}</td>
                    <td className="px-4 py-3 text-xs text-neutral-300 font-medium">{formatDateTime(inv.date).split(',')[0]}</td>
                    <td className="px-4 py-3 text-xs text-neutral-200 hidden sm:table-cell">{inv.description}</td>
                    <td className="px-4 py-3 text-xs font-bold text-white">{formatUSD(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                        inv.status === 'Paid'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : inv.status === 'Refunded'
                          ? 'bg-neutral-800 text-neutral-300 border border-neutral-700/60'
                          : 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(inv)}
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Confirmation Modal */}
      <Modal
        theme="dark"
        isOpen={!!confirmModalPlan}
        onClose={() => setConfirmModalPlan(null)}
        title="Confirm Plan Change"
        description="Demo mode: updates your mock customer session with the selected quota limits."
        className="max-w-lg bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        {confirmModalPlan && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#080B14] border border-neutral-800">
              <p className="text-xs text-neutral-400">Switching to</p>
              <h4 className="text-lg font-bold text-white">{confirmModalPlan.name} Plan</h4>
              <p className="text-xs text-neutral-300 mt-1">
                Allowance: <strong className="text-cyan-300">{confirmModalPlan.credits} credits</strong> • Billing: <strong className="text-white">{billingCycle}</strong>
              </p>
            </div>

            <div className="p-3 bg-amber-950/50 rounded-xl border border-amber-800/60 flex items-start gap-2 text-xs text-amber-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                No credit card is required. This simulated upgrade/downgrade executes locally in your browser.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <Button variant="outline" size="sm" onClick={() => setConfirmModalPlan(null)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white">
                Cancel
              </Button>
              <Button variant="gradient" size="sm" onClick={handleConfirmPlanChange}>
                Confirm Switch (Demo)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default SubscriptionPage
