import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, Shield, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function DemoAccess({ onSelect, compact = false }) {
  const navigate = useNavigate()
  const { loginAsMockUser } = useAuth()
  const [feedback, setFeedback] = useState(null)

  const handleCustomerDemo = () => {
    setFeedback('Customer Demo active. Entering Studio...')
    loginAsMockUser('creator', {
      fullName: 'Jane Doe (Demo)',
      email: 'creator.demo@kiaan.studio',
      tier: 'Free Tier',
      creditBalance: 250
    })
    if (onSelect) onSelect('creator')
    setTimeout(() => {
      navigate('/dashboard')
    }, 200)
  }

  const handleAdminDemo = () => {
    setFeedback('Admin Demo active. Entering Admin Portal...')
    loginAsMockUser('super_admin', {
      fullName: 'Admin User (Demo)',
      email: 'admin.demo@kiaan.studio',
      tier: 'Super Admin',
      creditBalance: 99999
    })
    if (onSelect) onSelect('super_admin')
    setTimeout(() => {
      navigate('/admin')
    }, 200)
  }

  if (compact) {
    return (
      <div className="pt-2 border-t border-neutral-100 space-y-2 select-none">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-600" />
            <span>Instant 1-Click Demo:</span>
          </div>
          <span className="text-[9px] font-mono uppercase bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded border border-violet-150">
            Mock Auth
          </span>
        </div>

        {feedback && (
          <div className="p-2 rounded-lg bg-violet-50 border border-violet-200 text-[11px] font-medium text-violet-800 flex items-center gap-1.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCustomerDemo}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-neutral-200 hover:border-violet-300 bg-white hover:bg-violet-50/60 text-neutral-800 text-xs font-bold shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-violet-600" />
            <span>Customer Demo &rarr;</span>
          </button>

          <button
            type="button"
            onClick={handleAdminDemo}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-neutral-200 hover:border-amber-300 bg-white hover:bg-amber-50/60 text-neutral-800 text-xs font-bold shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin Demo &rarr;</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span>Instant Development Demo Access</span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200/60">
          1-Click Bypass
        </span>
      </div>

      {feedback && (
        <div className="p-2.5 rounded-xl bg-violet-100/70 border border-violet-200 text-xs font-medium text-violet-900 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleCustomerDemo}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-violet-50/80 border border-neutral-300 hover:border-violet-300 text-neutral-900 text-xs font-bold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-violet-600" />
          <span>Customer Demo &rarr;</span>
        </button>

        <button
          type="button"
          onClick={handleAdminDemo}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50/80 border border-neutral-300 hover:border-amber-300 text-neutral-900 text-xs font-bold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          <span>Admin Demo &rarr;</span>
        </button>
      </div>

      <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
        Bypasses manual credentials: <strong>Customer Demo</strong> loads <code>/dashboard</code>;{' '}
        <strong>Admin Demo</strong> loads <code>/admin</code>.
      </p>
    </div>
  )
}

export default DemoAccess
