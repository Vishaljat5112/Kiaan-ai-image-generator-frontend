import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, Shield, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function DemoAccess({ onSelect, compact = false }) {
  const navigate = useNavigate()
  const { loginAsMockUser } = useAuth()
  const [feedback, setFeedback] = useState(null)

  const handleCustomerDemo = () => {
    setFeedback('User Demo active. Entering Studio...')
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
      <div className="pt-2 border-t border-neutral-800 space-y-2 select-none">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Instant 1-Click Demo:</span>
          </div>
          <span className="text-[9px] font-mono uppercase bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/60">
            Mock Auth
          </span>
        </div>

        {feedback && (
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-[11px] font-medium text-cyan-300 flex items-center gap-1.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCustomerDemo}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-neutral-800 hover:border-cyan-500/50 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-bold shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>User Demo &rarr;</span>
          </button>

          <button
            type="button"
            onClick={handleAdminDemo}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-neutral-800 hover:border-pink-500/50 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-bold shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            <span>Admin Demo &rarr;</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Instant Development Demo Access</span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
          1-Click Bypass
        </span>
      </div>

      {feedback && (
        <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-xs font-medium text-cyan-300 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleCustomerDemo}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 text-neutral-200 hover:text-white text-xs font-bold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>User Demo &rarr;</span>
        </button>

        <button
          type="button"
          onClick={handleAdminDemo}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-pink-500/50 text-neutral-200 hover:text-white text-xs font-bold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-pink-400" />
          <span>Admin Demo &rarr;</span>
        </button>
      </div>

      <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
        Bypasses manual credentials: <strong>User Demo</strong> loads <code>/dashboard</code>;{' '}
        <strong>Admin Demo</strong> loads <code>/admin</code>.
      </p>
    </div>
  )
}

export default DemoAccess
