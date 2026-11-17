import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CinematicCtaSection() {
  return (
    <section className="relative py-8 sm:py-10 lg:py-12 bg-[#06080F] border-t border-neutral-800/80 scroll-mt-20 overflow-hidden">
      {/* Top subtle light beam separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent pointer-events-none" />

      {/* Atmospheric back-glow behind banner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact banner container */}
        <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden bg-neutral-950 p-6 sm:p-8 lg:p-9 flex items-center justify-center shadow-2xl border border-white/15 ring-1 ring-cyan-500/20 group">
          {/* Cinematic Background Image */}
          <img
            src="/images/landing/cta-cinematic-banner.jpg"
            alt="Cinematic atmospheric horizon"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Dark Overlay Gradient for Rich Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/55 pointer-events-none" />

          {/* Top Glass Surface Reflection Sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

          {/* Centered Content */}
          <div className="relative z-10 max-w-xl text-center space-y-3 sm:space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 backdrop-blur-xl border border-cyan-400/50 text-[11px] font-mono uppercase tracking-wider text-cyan-300 mx-auto shadow-md shadow-cyan-500/10">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Kiaan Studio Creative Workstation</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Your Next Great Creation Starts Here
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 max-w-md mx-auto leading-relaxed">
              Bring your creative ideas into one powerful workspace for AI images and videos.
              Experience open-weight neural generation designed for professional creators.
            </p>

            <div className="pt-1.5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-xl shadow-pink-500/30 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>

            <p className="text-[11px] text-neutral-400 font-medium">
              No credit card required &bull; Self-hosted commercial open weights
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CinematicCtaSection

