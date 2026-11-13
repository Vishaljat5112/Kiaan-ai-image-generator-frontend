import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Layers } from 'lucide-react'

export function AuthImageCarousel({ compact = false, className = '' }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)

  // 4 Reordered Visual Themes:
  // 1. Position 1: Fantasy ("Every Idea Starts Here") - Former Image 4
  // 2. Position 2: Fashion ("Create Without Limits") - Former Image 1
  // 3. Position 3: Sci-Fi Art ("Imagine New Worlds") - Former Image 2
  // 4. Position 4: Commercial ("Bring Products to Life") - Former Image 3
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

  // Auto-advance every 3.5 seconds (3500ms), pausing when page is hidden
  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length)
      }, 3500)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        startTimer()
      }
    }

    startTimer()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [slides.length])

  // Handle manual slide selection
  const selectSlide = (index) => {
    setActiveSlide(index)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length)
      }, 3500)
    }
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-neutral-950 flex flex-col justify-end select-none group ${
        compact ? 'min-h-[460px] md:min-h-full rounded-2xl md:rounded-none md:rounded-l-3xl' : 'min-h-[580px] lg:min-h-[720px] rounded-[32px] shadow-2xl border border-neutral-200/50'
      } ${className}`}
    >
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

      {/* Dark Vignette Overlay for Crisp Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 z-20 pointer-events-none" />

      {/* Bottom Content Overlay */}
      <div className={`relative z-30 space-y-3 text-white ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 lg:p-10 space-y-5'}`}>
        {/* Pills / Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-xs">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>{slides[activeSlide].tag}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-neutral-300 bg-black/40 backdrop-blur-md border border-white/10">
            <Layers className="w-2.5 h-2.5 text-cyan-400" />
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

        {/* 4 Interactive Progress Indicators */}
        <div className="pt-1 space-y-1.5">
          <div className="grid grid-cols-4 gap-1.5">
            {slides.map((slide, index) => {
              const isActive = activeSlide === index
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => selectSlide(index)}
                  className="group/bar py-1.5 flex flex-col gap-1 text-left focus:outline-none cursor-pointer"
                  aria-label={`Switch to slide ${index + 1}: ${slide.title}`}
                >
                  {/* Progress Bar Line */}
                  <div className="h-1 w-full rounded-full bg-white/25 overflow-hidden transition-colors group-hover/bar:bg-white/40">
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        isActive ? 'w-full shadow-xs' : 'w-0'
                      }`}
                    />
                  </div>
                  {/* Slide Label */}
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider transition-colors truncate hidden sm:block ${
                      isActive ? 'text-white' : 'text-neutral-400 group-hover/bar:text-neutral-200'
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
