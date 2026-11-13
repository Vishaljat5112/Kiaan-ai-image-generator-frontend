import React, { useState, useEffect } from 'react'
import { Sparkles, Layers } from 'lucide-react'

const SLIDE_DURATION = 3500

export function AuthImageCarousel({ compact = false, className = '' }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // 4 Reordered Visual Themes:
  // 1. Position 1: Fantasy ("Every Idea Starts Here")
  // 2. Position 2: Fashion ("Create Without Limits")
  // 3. Position 3: Sci-Fi Art ("Imagine New Worlds")
  // 4. Position 4: Commercial ("Bring Products to Life")
  const slides = [
    {
      id: 'fantasy',
      title: 'Every Idea Starts Here',
      desc: 'Compose expansive fantasy landscapes and architectural spaces with open-weight diffusion.',
      tag: 'Worldbuilding',
      badge: 'Open Weights',
      image: '/images/landing/gallery-fantasy.jpg',
      label: 'Fantasy'
    },
    {
      id: 'fashion',
      title: 'Create Without Limits',
      desc: 'Synthesize photorealistic portraits and editorial aesthetics with granular light control.',
      tag: 'Fashion & Portraiture',
      badge: 'High Fidelity',
      image: '/images/landing/gallery-fashion.jpg',
      label: 'Fashion'
    },
    {
      id: 'scifi',
      title: 'Imagine New Worlds',
      desc: 'Render atmospheric celestial scenes with volumetric lighting and photorealistic depth.',
      tag: 'Sci-Fi & Concept Art',
      badge: 'FLUX.2 Klein',
      image: '/images/landing/hero-astronaut.jpg',
      label: 'Sci-Fi Art'
    },
    {
      id: 'product',
      title: 'Bring Products to Life',
      desc: 'Generate studio commercial packshots, ad creatives, and packaging concepts in seconds.',
      tag: 'Commercial Studio',
      badge: '4K Packshot',
      image: '/images/landing/marketing-product-poster.jpg',
      label: 'Commercial'
    }
  ]

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      const handler = (e) => setPrefersReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  // Pause when browser tab/window is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.visibilityState === 'hidden')
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Fallback timer when reduced motion is preferred
  useEffect(() => {
    if (!prefersReducedMotion || isPaused) return
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [prefersReducedMotion, isPaused, slides.length])

  // When animation finishes, automatically change to the next slide
  const handleAnimationEnd = (index) => {
    if (index === activeSlide && !isPaused) {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }
  }

  // Handle manual tab selection
  const selectSlide = (index) => {
    setActiveSlide(index)
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#06080F] flex flex-col justify-end select-none group ${
        compact ? 'min-h-[460px] md:min-h-full rounded-2xl md:rounded-none md:rounded-l-3xl' : 'min-h-[580px] lg:min-h-[720px] rounded-[32px] shadow-2xl border border-neutral-800/80'
      } ${className}`}
    >
      {/* Scoped CSS Keyframe for smooth left-to-right filling video progress bar */}
      <style>{`
        @keyframes carouselProgressFill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>

      {/* 4 Preloaded Images with Smooth Crossfade */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = activeSlide === index
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover transform scale-100 transition-transform duration-10000 ease-out group-hover:scale-105"
              />
            </div>
          )
        })}
      </div>

      {/* Dark Obsidian & Cyan Atmospheric Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-20" />

      {/* Bottom Content Overlay */}
      <div className={`relative z-30 space-y-3 text-white ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 lg:p-10 space-y-5'}`}>
        {/* Pills / Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{slides[activeSlide].tag}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-neutral-300 bg-black/60 backdrop-blur-md border border-white/10">
            <Layers className="w-2.5 h-2.5 text-pink-400" />
            <span>{slides[activeSlide].badge}</span>
          </span>
        </div>

        {/* Slide Title & Subtitle */}
        <div className="space-y-1">
          <h2 className={`font-extrabold tracking-tight text-white leading-tight ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl'}`}>
            {slides[activeSlide].title}
          </h2>
          <p className="text-xs text-neutral-300 max-w-sm leading-relaxed line-clamp-2">
            {slides[activeSlide].desc}
          </p>
        </div>

        {/* 4 Interactive Video-Style Progress Indicators */}
        <div className="pt-1 space-y-1.5">
          <div className="grid grid-cols-4 gap-1.5">
            {slides.map((slide, index) => {
              const isActive = activeSlide === index
              const isPast = index < activeSlide

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => selectSlide(index)}
                  className="group/bar py-1.5 flex flex-col gap-1 text-left focus:outline-none cursor-pointer"
                  aria-label={`Switch to slide ${index + 1}: ${slide.title}`}
                >
                  {/* Progress Bar Line Track */}
                  <div className="h-1 w-full rounded-full bg-neutral-800/90 overflow-hidden transition-colors group-hover/bar:bg-neutral-700">
                    {isActive ? (
                      /* Active Slide: Live Left-to-Right Video Fill */
                      <div
                        key={`bar-${activeSlide}`}
                        onAnimationEnd={() => handleAnimationEnd(index)}
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        style={{
                          animation: prefersReducedMotion
                            ? 'none'
                            : `carouselProgressFill ${SLIDE_DURATION}ms linear forwards`,
                          animationPlayState: isPaused ? 'paused' : 'running',
                          width: prefersReducedMotion ? '100%' : undefined
                        }}
                      />
                    ) : isPast ? (
                      /* Completed Slide: Solid cyan filled */
                      <div className="h-full w-full bg-cyan-500/70" />
                    ) : (
                      /* Upcoming Slide: Empty track */
                      <div className="h-full w-0" />
                    )}
                  </div>

                  {/* Slide Label */}
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider transition-all truncate hidden sm:block ${
                      isActive
                        ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)] font-extrabold'
                        : isPast
                          ? 'text-neutral-300 font-medium'
                          : 'text-neutral-500 group-hover/bar:text-neutral-300'
                    }`}
                  >
                    {slide.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthImageCarousel
