import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CinematicCtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-width banner container inside max-w-7xl */}
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-neutral-950 aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center p-6 sm:p-12 shadow-2xl border border-neutral-200/80 group">
          {/* Cinematic Background Image */}
          <img
            src="/images/landing/cta-cinematic-banner.jpg"
            alt="Cinematic atmospheric horizon"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Dark Overlay Gradient for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 pointer-events-none" />

          {/* Centered Content */}
          <div className="relative z-10 max-w-2xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mx-auto shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Kiaan Studio Creative Workstation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Your Next Great Creation Starts Here
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Bring your creative ideas into one powerful workspace for AI images and videos.
              Experience open-weight neural generation designed for professional creators.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
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

