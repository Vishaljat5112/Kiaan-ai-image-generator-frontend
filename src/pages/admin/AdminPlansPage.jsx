import React, { useEffect, useState, useCallback } from 'react'
import {
  CreditCard,
  RefreshCw,
  Edit2,
  Users,
  Coins
} from 'lucide-react'
import { api } from '../../services/api'
import { formatCurrency, formatNumber } from '../../utils/format'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { FieldLabel, lightInputClass, Toast } from '../../components/studio/StudioUI'

export function AdminPlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState(null)
  const [priceMonthly, setPriceMonthly] = useState('')
  const [priceAnnual, setPriceAnnual] = useState('')
  const [monthlyCredits, setMonthlyCredits] = useState('')
  const [maxConcurrency, setMaxConcurrency] = useState('')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/plans')
      if (res.data?.data) {
        setPlans(res.data.data)
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load plans', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const handleSavePlan = async (e) => {
    e.preventDefault()
    if (!editingPlan) return
    try {
      await api.patch(`/admin/plans/${editingPlan.id}`, {
        priceMonthly: parseFloat(priceMonthly),
        priceAnnual: parseFloat(priceAnnual),
        monthlyCredits: parseInt(monthlyCredits, 10),
        maxConcurrentJobs: parseInt(maxConcurrency, 10)
      })
      setToast({ message: `${editingPlan.name} updated successfully` })
      setEditingPlan(null)
      fetchPlans()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Plan update failed', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              <CreditCard className="w-3.5 h-3.5" />
              SaaS Monetization
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Subscription Plans & Quotas</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure subscription tiers, monthly recurring allowance credits, and concurrency limits.
          </p>
        </div>

        <button
          onClick={fetchPlans}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-white">{plan.name}</h3>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{plan.slug}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Users className="w-3 h-3" />
                  {plan.activeSubscribers || 0} active
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-2">
                <div className="text-2xl font-extrabold text-white">
                  {formatCurrency(plan.priceMonthly)}
                  <span className="text-xs font-normal text-neutral-400"> / month</span>
                </div>
                <div className="text-xs text-neutral-400">
                  Annual billing: {formatCurrency(plan.priceAnnual)} / yr
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Monthly Allowance</span>
                  <span className="font-semibold text-cyan-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {formatNumber(plan.monthlyCredits)} credits
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Concurrency Limit</span>
                  <span className="text-neutral-200 font-medium">{plan.maxConcurrentJobs} parallel jobs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800/80">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs text-neutral-200 border-neutral-700 hover:bg-neutral-800"
                leftIcon={Edit2}
                onClick={() => {
                  setEditingPlan(plan)
                  setPriceMonthly(String(plan.priceMonthly))
                  setPriceAnnual(String(plan.priceAnnual))
                  setMonthlyCredits(String(plan.monthlyCredits))
                  setMaxConcurrency(String(plan.maxConcurrentJobs))
                }}
              >
                Modify Tier Quotas
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        theme="dark"
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title={`Edit ${editingPlan?.name || ''} Plan`}
        description="Update pricing and quota allocations."
        className="max-w-md bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="p-monthly">Monthly Price ($) *</FieldLabel>
              <input
                id="p-monthly"
                type="number"
                step="0.01"
                required
                value={priceMonthly}
                onChange={(e) => setPriceMonthly(e.target.value)}
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="p-annual">Annual Price ($) *</FieldLabel>
              <input
                id="p-annual"
                type="number"
                step="0.01"
                required
                value={priceAnnual}
                onChange={(e) => setPriceAnnual(e.target.value)}
                className={lightInputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="p-credits">Monthly Credits *</FieldLabel>
              <input
                id="p-credits"
                type="number"
                required
                value={monthlyCredits}
                onChange={(e) => setMonthlyCredits(e.target.value)}
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="p-conc">Max Concurrency *</FieldLabel>
              <input
                id="p-conc"
                type="number"
                required
                value={maxConcurrency}
                onChange={(e) => setMaxConcurrency(e.target.value)}
                className={lightInputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEditingPlan(null)}
              className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Save Plan
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminPlansPage
