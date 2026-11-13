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
    <section id="image-editing" className="py-16 sm:py-24 bg-white overflow-hidden border-t border-neutral-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header: Left Title + Right Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 text-xs font-semibold text-violet-700">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Full Editing Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight">
              Edit, Enhance &amp; Perfect Every Detail
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              Explore creative image transformations, visual refinements, and editing possibilities in
              one streamlined workspace. Add subtle variations, remove backgrounds, or adjust lighting
              in seconds.
            </p>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-11 h-11 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous edit sample"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-11 h-11 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
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
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Middle Horizontal Carousel Track */}
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            role="region"
            aria-label="Image editing showcase gallery"
            className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-3xl select-none"
          >
            {triplicatedItems.map((item, index) => {
              const isClone = item.setIndex !== 1
              return (
                <div
                  key={`${item.id}-set-${item.setIndex}-${index}`}
                  data-card="true"
                  aria-hidden={isClone ? 'true' : undefined}
                  className="w-72 sm:w-88 shrink-0 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col aspect-[4/5] relative select-none"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading={index < 5 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Bottom Content Info */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-600/90 backdrop-blur-xs text-[11px] font-semibold uppercase tracking-wider text-white">
                      {item.tag}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Centered CTA */}
        <div className="mt-12 text-center space-y-2">
          <Link
            to="/dashboard/image-editor"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-base bg-neutral-950 hover:bg-neutral-800 text-white shadow-lg hover:shadow-neutral-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
