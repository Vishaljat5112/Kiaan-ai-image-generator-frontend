import React, { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Wand2 } from 'lucide-react'

export function ImageEditingSection() {
  const scrollContainerRef = useRef(null)
  const animFrameIdRef = useRef(null)
  const lastTimeRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const isInteractingRef = useRef(false)
  const interactionTimerRef = useRef(null)
  const singleSetWidthRef = useRef(0)

  // 5 High-Quality Showcase Items
  const editShowcaseItems = [
    {
      id: 'relighting',
      title: 'Atmospheric Studio Relighting',
      tag: 'Neural Relighting',
      desc: 'Add directional beams, color gels, and cinematic depth to existing portraits.',
      image: '/images/landing/edit-relighting.jpg'
    },
    {
      id: 'inpainting',
      title: 'Generative Fill & Background Replace',
      tag: 'Smart Inpainting',
      desc: 'Seamlessly replace scene elements, extend canvas boundaries, or clean unwanted artifacts.',
      image: '/images/landing/edit-node-workflow.jpg'
    },
    {
      id: 'detail-enhancement',
      title: 'Multi-Subject Composition',
      tag: 'Creative Synthesis',
      desc: 'Merge complex subjects and ethereal lighting with coherent focal blending.',
      image: '/images/landing/edit-horse-mist.jpg'
    },
    {
      id: 'upscale',
      title: 'Ultra-Fine Facial Retouch & 4K Upscale',
      tag: 'Hi-Res Upscaler',
      desc: 'Enhance micro-textures, skin fidelity, and hair details without plastic smoothing.',
      image: '/images/landing/edit-macro-upscale.jpg'
    },
    {
      id: 'cyberpunk',
      title: 'Neural Style & Aesthetic Grading',
      tag: 'Style Transfer',
      desc: 'Transform color palettes and lighting models into stylized concept art.',
      image: '/images/landing/edit-cyberpunk.jpg'
    }
  ]

  // Triplicate the items array for seamless infinite looping (clone set 0, main set 1, clone set 2)
  const triplicatedItems = [
    ...editShowcaseItems.map((item) => ({ ...item, setIndex: 0 })),
    ...editShowcaseItems.map((item) => ({ ...item, setIndex: 1 })),
    ...editShowcaseItems.map((item) => ({ ...item, setIndex: 2 }))
  ]

  // Dimension measurement and initial scroll positioning
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const updateDimensions = () => {
      const totalWidth = container.scrollWidth
      if (totalWidth > 0) {
        const setWidth = totalWidth / 3
        singleSetWidthRef.current = setWidth
        // Initialize position in middle set if at the very start
        if (container.scrollLeft < setWidth * 0.2) {
          container.scrollLeft = setWidth
        }
      }
    }

    updateDimensions()
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  // Continuous auto-scroll loop via requestAnimationFrame (frame-rate independent)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Honor reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Speed: ~48px per second (approx 38-40 seconds per complete cycle of 5 cards)
    const speed = 0.048

    const animate = (currentTime) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime
      }
      const delta = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      const isPaused =
        isHoveredRef.current ||
        isDraggingRef.current ||
        isInteractingRef.current ||
        document.visibilityState === 'hidden'

      if (!isPaused && singleSetWidthRef.current > 0) {
        // Advance scrollLeft smoothly
        container.scrollLeft += speed * Math.min(delta, 100)

        // Seamless infinite wrap check
        const setWidth = singleSetWidthRef.current
        if (container.scrollLeft >= setWidth * 2) {
          container.scrollLeft -= setWidth
        } else if (container.scrollLeft < setWidth * 0.5) {
          container.scrollLeft += setWidth
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate)
    }

    animFrameIdRef.current = requestAnimationFrame(animate)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTimeRef.current = performance.now()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Previous & Next navigation button handler
  const handleScroll = useCallback((direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    // Pause autoplay during and shortly after manual button interaction
    isInteractingRef.current = true
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current)

    // Resume autoplay smoothly 2.2 seconds after manual interaction settles
    interactionTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
      lastTimeRef.current = performance.now()
    }, 2200)

    // Determine card step dynamically from first card width + gap
    const firstCard = container.querySelector('[data-card="true"]')
    const cardStep = firstCard ? firstCard.offsetWidth + 24 : 376
    const scrollAmount = direction === 'left' ? -cardStep : cardStep

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }, [])

  // Hover handlers: pause on hover, resume on mouse leave
  const handleMouseEnter = () => {
    isHoveredRef.current = true
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    lastTimeRef.current = performance.now()
  }

  // Touch and drag handlers for mobile swipe support
  const handleTouchStart = () => {
    isDraggingRef.current = true
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current)
  }

  const handleTouchEnd = () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current)
    interactionTimerRef.current = setTimeout(() => {
      isDraggingRef.current = false
      lastTimeRef.current = performance.now()
    }, 1200)
  }

  return (
    <section id="image-editing" className="py-8 sm:py-10 lg:py-12 bg-[#06080F] overflow-hidden border-t border-neutral-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header: Left Title + Right Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Full Editing Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Edit, Enhance &amp; Perfect Every Detail
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Explore creative image transformations, visual refinements, and editing possibilities in
              one streamlined workspace. Add subtle variations, remove backgrounds, or adjust lighting
              in seconds.
            </p>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-neutral-700/90 bg-[#0B0F19]/90 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 hover:border-cyan-400/80 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous edit sample"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-neutral-700/90 bg-[#0B0F19]/90 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 hover:border-cyan-400/80 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next edit sample"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Soft Edge Blur Masks */}
        <div
          className="relative w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Subtle edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#06080F] via-[#06080F]/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#06080F] via-[#06080F]/70 to-transparent z-10 pointer-events-none" />

          {/* Middle Horizontal Carousel Track */}
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            role="region"
            aria-label="Image editing showcase gallery"
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-3 pt-1 no-scrollbar focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-2xl select-none scroll-smooth"
          >
            {triplicatedItems.map((item, index) => {
              const isClone = item.setIndex !== 1
              return (
                <div
                  key={`${item.id}-set-${item.setIndex}-${index}`}
                  data-card="true"
                  aria-hidden={isClone ? 'true' : undefined}
                  className="w-56 sm:w-64 h-[350px] sm:h-[390px] rounded-2xl overflow-hidden shrink-0 shadow-md hover:shadow-xl transition-all duration-300 group/card relative select-none bg-neutral-900 border border-neutral-800/90 hover:border-cyan-500/40 flex flex-col"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading={index < 5 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />

                  {/* Clean feathered bottom vignette with no harsh line or dark strip */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-44 sm:h-48 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(6, 8, 15, 0.98) 0%, rgba(6, 8, 15, 0.88) 35%, rgba(6, 8, 15, 0.35) 70%, transparent 100%)'
                    }}
                  />

                  {/* Bottom Content Info — Category badge, title, 2-line description with proper padding and zero clipping */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-white space-y-1.5 z-10">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight drop-shadow-sm line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-300/90 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Centered CTA */}
        <div className="mt-6 sm:mt-8 text-center space-y-2">
          <Link
            to="/dashboard/image-editor"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Image Editing
          </Link>
          <p className="text-xs text-neutral-400 font-medium">
            Interactive Editor Preview &bull; Connected to self-hosted open-weight diffusion
          </p>
        </div>
      </div>
    </section>
  )
}

export default ImageEditingSection
