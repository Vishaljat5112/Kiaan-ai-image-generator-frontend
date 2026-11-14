import React, { useMemo, useState, useCallback, useEffect } from 'react'
import {
  Coins, TrendingUp, Sparkles, Video, ArrowUpRight, ArrowDownLeft,
  Calendar, Clock, AlertCircle, Info, RefreshCw, Plus, Check, Loader2
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, SegmentedTabs, LightSelect, LightEmptyState,
  StatCard, Toast
} from '../../components/studio/StudioUI'
import { DEMO_USAGE_DAILY, DEMO_TRANSACTIONS } from '../../mocks/customerDemoData'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'
import { api } from '../../services/api'

const TOP_UP_PACKS = [
  { id: 'topup-100', credits: 100, price: '$5', desc: 'Ideal for small quick edits' },
  { id: 'topup-500', credits: 500, price: '$20', badge: 'Most Popular', desc: 'Perfect for standard creative runs' },
  { id: 'topup-2000', credits: 2000, price: '$70', desc: 'Studio scale for heavy 3D DiT video jobs' }
]

export function CreditsPage() {
  const { user, setUser } = useAuth()
  const [balance, setBalance] = useState(user?.creditBalance ?? 25)
  const [transactions, setTransactions] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [topUpModalOpen, setTopUpModalOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState(TOP_UP_PACKS[1].id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  // Load real balance and transaction history on mount
  useEffect(() => {
    let isMounted = true

    async function loadCreditData() {
      try {
        const [balRes, txRes] = await Promise.allSettled([
          api.get('/credits/balance'),
          api.get('/credits/transactions')
        ])

        if (isMounted) {
          if (balRes.status === 'fulfilled' && balRes.value.data?.success) {
            const b = balRes.value.data.data.balance
            setBalance(b)
            if (setUser) setUser((prev) => (prev ? { ...prev, creditBalance: b } : prev))
          }
          if (txRes.status === 'fulfilled' && txRes.value.data?.success) {
            const list = txRes.value.data.data
            setTransactions(list.length > 0 ? list : DEMO_TRANSACTIONS)
          } else {
            setTransactions(DEMO_TRANSACTIONS)
          }
        }
      } catch {
        if (isMounted) setTransactions(DEMO_TRANSACTIONS)
      }
    }

    loadCreditData()
    return () => { isMounted = false }
  }, [setUser])

  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      if (categoryFilter === 'all') return true
      if (categoryFilter === 'image') return t.category === 'image' || t.rawCategory === 'IMAGE_GENERATION'
      if (categoryFilter === 'video') return t.category === 'video' || t.rawCategory === 'VIDEO_GENERATION'
      if (categoryFilter === 'topup') return t.category === 'topup' || t.type === 'refund' || t.type === 'bonus'
      return true
    })
  }, [transactions, categoryFilter])

  // Consumption totals
  const totals = useMemo(() => {
    let img = 0
    let vid = 0
    let added = 0
    transactions.forEach((t) => {
      if (t.category === 'image' || t.rawCategory === 'IMAGE_GENERATION') img += Math.abs(t.amount)
      if ((t.category === 'video' || t.rawCategory === 'VIDEO_GENERATION') && t.type === 'debit') vid += Math.abs(t.amount)
      if (t.amount > 0) added += t.amount
    })
    return { img, vid, added }
  }, [transactions])

  const maxDaily = Math.max(...DEMO_USAGE_DAILY.map((d) => d.image + d.video), 1)

  const handleSimulateTopUp = async () => {
    const pack = TOP_UP_PACKS.find((p) => p.id === selectedPack) || TOP_UP_PACKS[1]
    setIsSubmitting(true)
    try {
      const res = await api.post('/credits/topup', { packId: pack.id })
      if (res.data?.success) {
        const order = res.data.data
        setTopUpModalOpen(false)
        setToast({
          message: `Order created (${order.invoiceNumber}). Payment gateways will be connected in Phase 6.`
        })
      } else {
        setToast({ message: res.data?.error?.message || 'Failed to create top-up order', tone: 'danger' })
      }
    } catch {
      // Local demo fallback
      const newTx = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString(),
        description: `Credit top-up • ${pack.credits} credit pack (Demo)`,
        type: 'credit',
        category: 'topup',
        amount: pack.credits
      }
      setBalance((prev) => prev + pack.credits)
      setTransactions([newTx, ...transactions])
      setTopUpModalOpen(false)
      setToast({ message: `Simulated top-up: +${pack.credits} credits added to local session.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <StudioPageHeader
        icon={Coins}
        section="Account & Billing"
        crumb="Credits & Usage"
        title="Credits & Usage"
        description="Monitor real-time generative wallet balance, consumption trends and ledger history."
        actions={
          <Button variant="gradient" leftIcon={Plus} onClick={() => setTopUpModalOpen(true)}>
            Top Up Credits
          </Button>
        }
      />

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Coins}
          label="Available Balance"
          value={`${balance} cr`}
          sub="No expiration on purchased credits"
          accent="amber"
        />
        <StatCard
          icon={Sparkles}
          label="Image Synthesis"
          value={`${totals.img} cr`}
          sub="1 credit per standard generation"
          accent="pink"
        />
        <StatCard
          icon={Video}
          label="Video Synthesis"
          value={`${totals.vid} cr`}
          sub="10–25 credits per cinematic run"
          accent="cyan"
        />
        <StatCard
          icon={ArrowUpRight}
          label="Credits Granted"
          value={`+${totals.added} cr`}
          sub="Plan allowances & top-ups"
          accent="emerald"
        />
      </div>

      {/* Visual Usage Breakdown Chart */}
      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              14-Day Consumption Timeline
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Daily generative inference volume across multimodal and video models.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-pink-500" /> Image Synthesis
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> 3D DiT Video
            </span>
          </div>
        </div>

        {/* CSS Flex Bar Chart */}
        <div className="h-44 flex items-end gap-2 pt-4 border-b border-neutral-800">
          {DEMO_USAGE_DAILY.map((day, idx) => {
            const imgPct = (day.image / maxDaily) * 100
            const vidPct = (day.video / maxDaily) * 100
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full max-w-[28px] flex flex-col justify-end h-full gap-0.5">
                  {day.video > 0 && (
                    <div
                      style={{ height: `${vidPct}%` }}
                      className="w-full bg-cyan-400/80 rounded-t-sm group-hover:bg-cyan-300 transition-colors"
                      title={`${day.date}: ${day.video} video credits`}
                    />
                  )}
                  {day.image > 0 && (
                    <div
                      style={{ height: `${imgPct}%` }}
                      className="w-full bg-pink-500/80 rounded-t-sm group-hover:bg-pink-400 transition-colors"
                      title={`${day.date}: ${day.image} image credits`}
                    />
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 font-mono group-hover:text-white transition-colors">
                  {day.date.split(' ')[0]}
                </span>
              </div>
            )
          })}
        </div>
      </Panel>

      {/* Transaction History Ledger */}
      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Credit Transaction Ledger
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Transparent record of all debit reserves, refunds and pack allocations.
            </p>
          </div>
          <SegmentedTabs
            size="sm"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: 'all', label: 'All Activity' },
              { value: 'image', label: 'Image Jobs' },
              { value: 'video', label: 'Video Jobs' },
              { value: 'topup', label: 'Credits Added' }
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#080B14] text-[11px] uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Transaction</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Type</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Timestamp</th>
                <th className="text-right font-semibold px-4 py-3">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredTx.map((tx) => {
                const isPositive = tx.amount > 0
                return (
                  <tr key={tx.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-bold text-white">{tx.description}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{tx.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                        tx.type === 'debit' ? 'bg-neutral-800 text-neutral-300' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-400 hidden md:table-cell">
                      {formatDateTime(tx.date || tx.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        'text-xs font-bold font-mono',
                        isPositive ? 'text-emerald-400' : 'text-neutral-200'
                      )}>
                        {isPositive ? `+${tx.amount}` : tx.amount} cr
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Top-up Modal */}
      <Modal
        theme="dark"
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        title="Purchase Credit Pack"
        description="Select a credit allocation pack for your generative studio pipelines."
      >
        <div className="space-y-4">
          <div className="space-y-2.5">
            {TOP_UP_PACKS.map((pack) => {
              const isSelected = selectedPack === pack.id
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={cn(
                    'p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between',
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 ring-2 ring-cyan-500/20'
                      : 'border-neutral-700 bg-[#080B14] hover:border-neutral-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full border flex items-center justify-center text-white text-xs',
                      isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-neutral-600'
                    )}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{pack.credits} Credits</span>
                        {pack.badge && (
                          <span className="text-[10px] font-semibold bg-pink-950/70 text-pink-300 border border-pink-800/60 px-2 py-0.5 rounded-full">
                            {pack.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{pack.desc}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-white font-mono">{pack.price}</span>
                </div>
              )
            })}
          </div>

          <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/60 flex items-start gap-2 text-xs text-cyan-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
            <span>
              Orders create pending invoices on the backend foundation. Real payment processing gateways will be connected in Phase 6.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setTopUpModalOpen(false)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={handleSimulateTopUp}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Order…' : 'Create Order'}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default CreditsPage
