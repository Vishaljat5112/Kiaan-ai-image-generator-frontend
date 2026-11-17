import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CinematicCtaSection() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-[#06080F] border-t border-neutral-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-width banner container inside max-w-7xl */}
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-950 min-h-[360px] sm:min-h-0 sm:aspect-[21/9] flex items-center justify-center p-6 sm:p-10 shadow-2xl border border-neutral-800/90 group">
          {/* Cinematic Background Image */}
          <img
            src="/images/landing/cta-cinematic-banner.jpg"
            alt="Cinematic atmospheric horizon"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Dark Overlay Gradient for Rich Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50 pointer-events-none" />

          {/* Centered Content */}
          <div className="relative z-10 max-w-2xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 backdrop-blur-md border border-cyan-500/40 text-xs font-mono uppercase tracking-wider text-cyan-300 mx-auto shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kiaan Studio Creative Workstation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.18]">
              Your Next Great Creation Starts Here
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 max-w-lg mx-auto leading-relaxed">
              Bring your creative ideas into one powerful workspace for AI images and videos.
              Experience open-weight neural generation designed for professional creators.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-xl shadow-pink-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

            <p className="text-xs text-neutral-400 font-medium">
              No credit card required &bull; Self-hosted commercial open weights
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CinematicCtaSection

