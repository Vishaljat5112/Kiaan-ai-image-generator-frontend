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
            const b = balRes.value.data.data?.balance ?? 25
            setBalance(b)
            if (setUser) setUser((prev) => (prev ? { ...prev, creditBalance: b } : prev))
          }
          if (txRes.status === 'fulfilled' && txRes.value.data?.success) {
            const rawData = txRes.value.data.data
            const list = Array.isArray(rawData)
              ? rawData
              : (Array.isArray(rawData?.transactions) ? rawData.transactions : [])
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
    if (!Array.isArray(transactions)) return []
    return transactions.filter((t) => {
      if (!t) return false
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
    if (Array.isArray(transactions)) {
      transactions.forEach((t) => {
        if (!t) return
        if (t.category === 'image' || t.rawCategory === 'IMAGE_GENERATION') img += Math.abs(t.amount || 0)
        if ((t.category === 'video' || t.rawCategory === 'VIDEO_GENERATION') && t.type === 'debit') vid += Math.abs(t.amount || 0)
        if (t.amount > 0) added += t.amount
      })
    }
    return { img, vid, added }
  }, [transactions])

  // Chart state & animation trigger
  const [hasAnimated, setHasAnimated] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setHasAnimated(true)
      return
    }
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 60)
    return () => clearTimeout(timer)
  }, [])

  const yScale = useMemo(() => {
    const dailyTotals = (DEMO_USAGE_DAILY || []).map((d) => (d.image || 0) + (d.video || 0))
    const maxVal = Math.max(...dailyTotals, 1)

    const roughStep = maxVal / 4
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep || 1)))
    const normalizedStep = roughStep / magnitude

    let step
    if (normalizedStep <= 1) step = 1 * magnitude
    else if (normalizedStep <= 2) step = 2 * magnitude
    else if (normalizedStep <= 5) step = 5 * magnitude
    else step = 10 * magnitude

    step = Math.max(1, Math.ceil(step))
    const niceMax = Math.ceil(maxVal / step) * step

    const ticks = []
    for (let val = 0; val <= niceMax; val += step) {
      ticks.push(val)
    }

    return { max: niceMax, ticks }
  }, [])

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
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pt-1.5 sm:pt-2">
      <StudioPageHeader
        icon={Coins}
        section="Account & Billing"
        crumb="Credits & Usage"
        title="Credits & Usage"
        description="Monitor real-time generative wallet balance, consumption trends and ledger history."
        actions={
          <Button variant="gradient" leftIcon={Plus} onClick={() => setTopUpModalOpen(true)} className="cursor-pointer">
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
      <Panel className="p-5 sm:p-6">
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
              <span className="w-2.5 h-2.5 rounded-sm bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.3)]" /> Image Synthesis
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]" /> 3D DiT Video
            </span>
          </div>
        </div>

        {/* Enhanced Interactive Bar Chart */}
        <div className="overflow-x-auto pb-1 no-scrollbar">
          <div className="min-w-[560px]">
            {/* Plot Area with Y-Axis */}
            <div className="flex items-stretch gap-3">
              {/* Y-Axis numeric scale labels */}
              <div className="flex flex-col justify-between items-end h-48 py-1 select-none text-[10px] font-mono text-neutral-400 w-11 shrink-0">
                {yScale.ticks.slice().reverse().map((tick) => (
                  <span key={tick} className="leading-none">
                    {tick} cr
                  </span>
                ))}
              </div>

              {/* Chart Canvas & Grid */}
              <div className="relative flex-1 h-48 border-b border-neutral-800">
                {/* Horizontal Reference Grid Lines */}
                {yScale.ticks.map((tick) => {
                  if (tick === 0) return null
                  const bottomPct = (tick / yScale.max) * 100
                  return (
                    <div
                      key={tick}
                      className="absolute inset-x-0 border-b border-neutral-800/40 pointer-events-none"
                      style={{ bottom: `${bottomPct}%` }}
                    />
                  )
                })}

                {/* Floating Interactive Tooltip — displays exclusively on active bar hover */}
                {hoveredBar !== null && DEMO_USAGE_DAILY[hoveredBar.index] && (() => {
                  const activeDay = DEMO_USAGE_DAILY[hoveredBar.index]
                  const isVideo = hoveredBar.type === 'video'
                  const value = isVideo ? (activeDay.video || 0) : (activeDay.image || 0)
                  const fullDate = activeDay.day.includes('202')
                    ? activeDay.day
                    : `${activeDay.day} 2026`

                  return (
                    <div
                      className="absolute z-30 pointer-events-none transition-all duration-150 ease-out"
                      style={{
                        left: `${((hoveredBar.index + 0.5) / DEMO_USAGE_DAILY.length) * 100}%`,
                        top: '6px',
                        transform:
                          hoveredBar.index <= 1
                            ? 'translateX(0%)'
                            : hoveredBar.index >= DEMO_USAGE_DAILY.length - 2
                            ? 'translateX(-100%)'
                            : 'translateX(-50%)'
                      }}
                    >
                      <div className="w-44 sm:w-48 p-2.5 rounded-xl bg-[#0B0F19]/95 backdrop-blur-md border border-neutral-700/80 shadow-2xl shadow-black/80 text-white space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800 text-[11px] font-semibold text-neutral-200">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            {fullDate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-0.5">
                          <span className="flex items-center gap-1.5 text-neutral-300">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isVideo
                                  ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                                  : 'bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.5)]'
                              }`}
                            />
                            {isVideo ? '3D DiT Video' : 'Image Synthesis'}
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              isVideo ? 'text-cyan-300' : 'text-pink-300'
                            }`}
                          >
                            {value} cr
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Bars Columns — Pointer events disabled on empty container & columns */}
                <div className="absolute inset-0 flex items-end gap-2 sm:gap-2.5 px-1 pointer-events-none">
                  {(DEMO_USAGE_DAILY || []).map((day, idx) => {
                    const totalCredits = (day.image || 0) + (day.video || 0)
                    const totalPct = yScale.max > 0 ? (totalCredits / yScale.max) * 100 : 0
                    const isVideoHovered = hoveredBar?.index === idx && hoveredBar?.type === 'video'
                    const isImageHovered = hoveredBar?.index === idx && hoveredBar?.type === 'image'

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end relative pointer-events-none select-none"
                      >
                        {totalCredits > 0 ? (
                          <div
                            style={{
                              height: hasAnimated ? `${totalPct}%` : '0%',
                              transition: hasAnimated
                                ? `height 750ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 35}ms`
                                : 'none'
                            }}
                            className="w-full max-w-[28px] sm:max-w-[32px] flex flex-col justify-end gap-0.5 overflow-hidden pointer-events-none"
                          >
                            {day.video > 0 && (
                              <div
                                role="graphics-symbol"
                                tabIndex={0}
                                aria-label={`${day.day}: 3D DiT Video ${day.video} credits`}
                                onMouseEnter={() => setHoveredBar({ index: idx, type: 'video' })}
                                onMouseLeave={() => setHoveredBar(null)}
                                onFocus={() => setHoveredBar({ index: idx, type: 'video' })}
                                onBlur={() => setHoveredBar(null)}
                                onTouchStart={(e) => {
                                  e.stopPropagation()
                                  setHoveredBar({ index: idx, type: 'video' })
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') setHoveredBar(null)
                                }}
                                style={{ height: `${(day.video / totalCredits) * 100}%` }}
                                className={`w-full bg-cyan-400/85 rounded-t-sm transition-all shadow-[0_0_8px_rgba(34,211,238,0.25)] pointer-events-auto cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-300 ${
                                  isVideoHovered ? 'bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.6)] brightness-110' : ''
                                }`}
                              />
                            )}
                            {day.image > 0 && (
                              <div
                                role="graphics-symbol"
                                tabIndex={0}
                                aria-label={`${day.day}: Image Synthesis ${day.image} credits`}
                                onMouseEnter={() => setHoveredBar({ index: idx, type: 'image' })}
                                onMouseLeave={() => setHoveredBar(null)}
                                onFocus={() => setHoveredBar({ index: idx, type: 'image' })}
                                onBlur={() => setHoveredBar(null)}
                                onTouchStart={(e) => {
                                  e.stopPropagation()
                                  setHoveredBar({ index: idx, type: 'image' })
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') setHoveredBar(null)
                                }}
                                style={{ height: `${(day.image / totalCredits) * 100}%` }}
                                className={`w-full bg-pink-500/85 ${
                                  day.video === 0 ? 'rounded-t-sm' : ''
                                } transition-all shadow-[0_0_8px_rgba(236,72,153,0.25)] pointer-events-auto cursor-pointer focus:outline-none focus:ring-1 focus:ring-pink-300 ${
                                  isImageHovered ? 'bg-pink-400 shadow-[0_0_14px_rgba(236,72,153,0.6)] brightness-110' : ''
                                }`}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="h-0 w-full max-w-[28px] sm:max-w-[32px] pointer-events-none" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* X-Axis labels row */}
            <div className="flex items-start gap-3 mt-2 pointer-events-none">
              <div className="w-11 shrink-0" />
              <div className="flex-1 flex gap-2 sm:gap-2.5 px-1">
                {(DEMO_USAGE_DAILY || []).map((day, idx) => {
                  const parts = (day.day || day.date || '').split(' ')
                  const dayNum = parts[0] || `D${idx + 1}`
                  const month = parts[1] || ''
                  const isHovered = hoveredBar?.index === idx

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center select-none"
                    >
                      <span
                        className={`text-[11px] font-medium font-mono transition-colors ${
                          isHovered ? 'text-cyan-300 font-bold' : 'text-neutral-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {month && (
                        <span
                          className={`text-[9px] transition-colors ${
                            isHovered
                              ? 'text-cyan-400/90 font-medium'
                              : 'text-neutral-400'
                          }`}
                        >
                          {month}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Transaction History Ledger */}
      <Panel className="p-5 sm:p-6">
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
            <thead className="bg-[#080B14] text-[11px] uppercase tracking-wider text-neutral-300 font-semibold border-b border-neutral-800">
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
                        <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{tx.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                        tx.type === 'debit' ? 'bg-neutral-800 text-neutral-200 border border-neutral-700/60' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-300 font-medium hidden md:table-cell">
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
