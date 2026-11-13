import React, { useState, useCallback } from 'react'
import {
  CreditCard, Check, Sparkles, Zap, Shield, HelpCircle,
  Clock, ArrowRight, AlertCircle, FileText, Download, Info
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SegmentedTabs, StatCard, Toast
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
      description: `${confirmModalPlan.name} plan � ${billingCycle} (Demo Switch)`,
      amount: billingCycle === 'yearly' ? Math.round(confirmModalPlan.price * 10) : confirmModalPlan.price,
      status: 'Paid'
    }
    setInvoices([newInvoice, ...invoices])
    setToast({ message: `Switched plan to ${confirmModalPlan.name} (${billingCycle}) in local demo session.` })
    setConfirmModalPlan(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <StudioPageHeader
        icon={CreditCard}
        section="Account & Billing"
        crumb="Subscription"
        title="Subscription & Plans"
        description="Manage your recurring creative tier, concurrency limits and invoice history."
      />

      {/* Active Subscription Overview Card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white mb-3">
              <Zap className="w-3.5 h-3.5" /> Active Plan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">{currentPlan.name} Tier</h2>
            <p className="text-violet-100 text-sm mt-1 max-w-xl">
              Includes {currentPlan.credits} credits refreshed monthly, priority queue scheduling, and full commercial license.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="text-right sm:pr-4 sm:border-r border-violet-400/40">
              <p className="text-xs text-violet-200">Next renewal</p>
              <p className="text-base font-bold">01 Dec 2026</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const starter = MOCK_PLANS[0]
                setConfirmModalPlan(starter)
              }}
              className="bg-white text-violet-900 hover:bg-violet-50 border-0 shadow-sm"
            >
              Cancel / Downgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Choose the Plan That Fits Your Workflow</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Scale GPU resources, concurrency pipelines and monthly allowances.</p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all',
              billingCycle === 'monthly' ? 'bg-white text-violet-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
              billingCycle === 'yearly' ? 'bg-white text-violet-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Yearly
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
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
                'bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all relative',
                isCurrent
                  ? 'border-violet-600 ring-2 ring-violet-500/20 shadow-md'
                  : 'border-neutral-200 hover:border-neutral-300 shadow-sm'
              )}
            >
              {plan.id === 'plan_pro' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                <h4 className="text-base font-bold text-neutral-900">{plan.name}</h4>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900">${price}</span>
                  <span className="text-xs text-neutral-500">/ month</span>
                </div>
                <p className="text-xs font-semibold text-violet-700 mt-1">
                  {plan.credits.toLocaleString()} Credits / mo
                </p>

                <div className="mt-6 pt-5 border-t border-neutral-100 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    Included Capabilities
                  </span>
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
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
                  className="w-full text-xs py-2"
                >
                  {isCurrent ? 'Active Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade Plan'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Invoice & Billing History Table */}
      <Panel className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" />
            Billing & Receipt History
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            View generated monthly invoices and payment receipts (Demo).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Invoice</th>
                <th className="text-left font-semibold px-4 py-3">Date</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Description</th>
                <th className="text-left font-semibold px-4 py-3">Amount</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-right font-semibold px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50/70">
                  <td className="px-4 py-3 text-xs font-bold font-mono text-neutral-900">{inv.id}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{formatDateTime(inv.date).split(',')[0]}</td>
                  <td className="px-4 py-3 text-xs text-neutral-700 hidden sm:table-cell">{inv.description}</td>
                  <td className="px-4 py-3 text-xs font-bold text-neutral-900">{formatUSD(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-600'
                    )}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setToast({ message: `Downloaded mock receipt ${inv.id}.pdf` })}
                      className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Confirmation Modal */}
      <Modal
        theme="light"
        isOpen={!!confirmModalPlan}
        onClose={() => setConfirmModalPlan(null)}
        title="Confirm Plan Change"
        description="Demo mode: updates your mock customer session with the selected quota limits."
      >
        {confirmModalPlan && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
              <p className="text-xs text-neutral-500">Switching to</p>
              <h4 className="text-lg font-bold text-violet-900">{confirmModalPlan.name} Plan</h4>
              <p className="text-xs text-violet-800 mt-1">
                Allowance: <strong>{confirmModalPlan.credits} credits</strong> � Billing: <strong>{billingCycle}</strong>
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                No credit card is required. This simulated upgrade/downgrade executes locally in your browser.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <Button variant="outline" size="sm" onClick={() => setConfirmModalPlan(null)} className="text-neutral-700 border-neutral-300">
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
