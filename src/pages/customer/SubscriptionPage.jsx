import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  CreditCard, Check, Sparkles, Zap, Shield, HelpCircle,
  Clock, ArrowRight, AlertCircle, FileText, Download, Info,
  ChevronDown, Filter, RefreshCw
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, Toast
} from '../../components/studio/StudioUI'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime, formatUSD } from '../../utils/format'
import { cn } from '../../utils/cn'
import { api } from '../../services/api'

export function SubscriptionPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'yearly'
  const [statusFilter, setStatusFilter] = useState('all')
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const statusMenuRef = useRef(null)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

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

  const loadSubscriptionData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [plansRes, subRes, invRes] = await Promise.allSettled([
        api.get('/subscriptions/plans'),
        api.get('/subscriptions/current'),
        api.get('/subscriptions/invoices')
      ])

      let loadedPlans = []
      let loadedSub = null
      let loadedInvoices = []

      if (plansRes.status === 'fulfilled' && plansRes.value.data?.success) {
        loadedPlans = plansRes.value.data.data || []
      }
      if (subRes.status === 'fulfilled' && subRes.value.data?.success) {
        loadedSub = subRes.value.data.data
      }
      if (invRes.status === 'fulfilled' && invRes.value.data?.success) {
        loadedInvoices = invRes.value.data.data || []
      }

      setPlans(loadedPlans)
      setCurrentSubscription(loadedSub)
      setInvoices(loadedInvoices)

      if (
        plansRes.status === 'rejected' &&
        subRes.status === 'rejected' &&
        invRes.status === 'rejected'
      ) {
        setError('Unable to load subscription data from server. Please check your connection.')
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve subscription records.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    loadSubscriptionData()
    return () => { isMounted = false }
  }, [loadSubscriptionData])

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

  // Payment safety: payment gateway is not integrated yet
  const handleSelectPlan = (plan) => {
    setToast({
      message: 'Payment integration is not available yet.'
    })
  }

  // Invoice PDF safety: official tax invoice download is unavailable without active gateway
  const handleDownloadReceipt = useCallback((inv) => {
    setToast({
      message: 'Official tax invoice download is currently unavailable.'
    })
  }, [])

  const hasActivePaidSub = Boolean(
    currentSubscription?.hasActiveSubscription &&
    currentSubscription?.plan &&
    currentSubscription?.plan?.slug !== 'free'
  )

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
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {loading
                ? 'Loading Plan Tier...'
                : hasActivePaidSub
                ? `${currentSubscription.plan.name} Tier`
                : 'Free Creator Tier'}
            </h2>
            <p className="text-neutral-300 text-sm mt-1 max-w-xl">
              {loading
                ? 'Retrieving subscription quota and renewal details...'
                : hasActivePaidSub
                ? `Includes ${(currentSubscription.plan.monthlyCredits || 0).toLocaleString()} credits refreshed monthly, priority queue scheduling, and full commercial license.`
                : '50 welcome credits upon registration, standard generation queue, and non-commercial studio access.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="text-left sm:text-right sm:pr-4 sm:border-r border-neutral-700">
              <p className="text-xs text-neutral-400">Next renewal</p>
              <p className="text-base font-bold text-white">
                {hasActivePaidSub && currentSubscription?.currentPeriodEnd
                  ? formatDateTime(currentSubscription.currentPeriodEnd).split(',')[0]
                  : 'No active paid renewal'}
              </p>
            </div>
            {hasActivePaidSub && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setToast({ message: 'Subscription management and cancellation will be available with payment gateway integration.' })}
                className="bg-[#080B14] text-neutral-300 hover:text-white border border-neutral-700 shadow-sm cursor-pointer"
              >
                Cancel / Downgrade
              </Button>
            )}
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
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
              billingCycle === 'monthly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs' : 'text-neutral-400 hover:text-white'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
              billingCycle === 'yearly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs' : 'text-neutral-400 hover:text-white'
            )}
          >
            Yearly
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-400 bg-[#0D111C]/90 rounded-2xl border border-neutral-800">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400 mb-2" />
          <span>Loading subscription plans from server...</span>
        </div>
      ) : error && plans.length === 0 ? (
        <div className="p-8 text-center text-xs text-rose-300 bg-rose-950/30 rounded-2xl border border-rose-800/50 space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto mb-1" />
          <p className="font-semibold">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSubscriptionData}
            className="border-rose-700/60 bg-neutral-900 text-rose-200 mt-2 cursor-pointer"
          >
            Retry Fetch
          </Button>
        </div>
      ) : plans.length === 0 ? (
        <div className="p-12 text-center text-xs text-neutral-400 bg-[#0D111C]/90 rounded-2xl border border-neutral-800">
          <p className="font-semibold text-neutral-300">No Subscription Plans Available</p>
          <p className="text-neutral-500 mt-1">Active plans will appear here once configured.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isCurrent = hasActivePaidSub
              ? currentSubscription?.plan?.slug === plan.slug
              : plan.slug === 'free'
            const price = billingCycle === 'yearly'
              ? (plan.priceAnnual > 0 ? Math.round(plan.priceAnnual / 12) : 0)
              : plan.priceMonthly

            return (
              <div
                key={plan.id || plan.slug}
                className={cn(
                  'bg-[#0D111C]/90 backdrop-blur-md rounded-2xl border p-6 flex flex-col justify-between transition-all relative',
                  isCurrent
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg'
                    : 'border-neutral-800 hover:border-neutral-700 shadow-sm'
                )}
              >
                {plan.slug === 'creator-pro' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular
                  </span>
                )}

                <div>
                  <h4 className="text-base font-bold text-white">{plan.name}</h4>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-neutral-300">
                      / month {billingCycle === 'yearly' && plan.priceAnnual > 0 ? '(billed annually)' : ''}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-400 mt-1">
                    {(plan.monthlyCredits || 0).toLocaleString()} Credits / mo
                  </p>

                  <div className="mt-6 pt-5 border-t border-neutral-800 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                      Included Capabilities
                    </span>
                    {(Array.isArray(plan.features) ? plan.features : []).map((f, idx) => (
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
                    {isCurrent ? 'Active Plan' : plan.priceMonthly === 0 ? 'Downgrade' : 'Upgrade Plan'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Invoice & Billing History Table */}
      <Panel className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Billing & Receipt History
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              View official transaction records and invoices for your account.
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-neutral-400">
                    Loading billing history...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-neutral-400">
                    {statusFilter !== 'all'
                      ? `No invoices found matching "${selectedStatus.label}".`
                      : 'No billing history or invoices found.'}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id || inv.invoiceNumber} className="hover:bg-[#161F30]/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold font-mono text-white">{inv.invoiceNumber || inv.id}</td>
                    <td className="px-4 py-3 text-xs text-neutral-300 font-medium">
                      {formatDateTime(inv.createdAt || inv.date).split(',')[0]}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-200 hidden sm:table-cell">{inv.description}</td>
                    <td className="px-4 py-3 text-xs font-bold text-white">{formatUSD(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                        String(inv.status).toLowerCase() === 'paid'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : String(inv.status).toLowerCase() === 'refunded'
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

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default SubscriptionPage
