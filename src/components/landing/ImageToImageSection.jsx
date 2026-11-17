import React, { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'

export function ImageToImageSection() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const sliderContainerRef = useRef(null)

  // Handle pointer drag (mouse & touch)
  const handleMove = useCallback((clientX) => {
    if (!sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(Math.round(percent))
  }, [])

  const handlePointerDown = (e) => {
    setIsDragging(true)
    handleMove(e.clientX)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handlePointerUp = (e) => {
    setIsDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (_) {}
  }

  // Keyboard accessibility (Arrow keys, Home, End)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setSliderPosition((prev) => Math.max(0, prev - 5))
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setSliderPosition((prev) => Math.min(100, prev + 5))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSliderPosition(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSliderPosition(100)
    }
  }

  return (
    <section id="image-to-image" className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#06080F] scroll-mt-20 border-t border-neutral-800/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Heading, Description & Pill CTA */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <span>Reference Synthesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-[1.2]">
              Generate Images Using A Reference Image
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Kiaan Studio photo generator allows creators to upload a reference image to guide
              your creation. Whether it&apos;s for capturing a specific pose, color palette, or visual
              structure, the image to image AI intelligently interprets your reference to deliver
              accurate and enhanced results.
            </p>
            <p className="text-sm text-neutral-300/90 leading-relaxed">
              It&apos;s a great way to fine-tune your AI generated image while still enjoying the freedom
              of creativity. When you&apos;re ready to animate images, Kiaan Studio AI video generator turns
              the same ideas into motion.
            </p>
          </div>

          <div className="pt-1 sm:pt-2">
            <Link
              to="/dashboard/image-editor"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Generate Image to Image
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Before/After Comparison Showcase */}
        <div className="lg:col-span-6">
          <div className="relative rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800/90 shadow-2xl overflow-hidden max-w-[490px] xl:max-w-[510px] lg:ml-auto w-full">
            {/* Subtle Dotted Background Pattern */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#06b6d4 1.2px, transparent 1.2px)',
                backgroundSize: '18px 18px'
              }}
            />

            {/* Interactive Image Container */}
            <div className="relative z-10 space-y-3.5">
              {/* Before/After Dual Frame with Draggable Divider */}
              <div
                ref={sliderContainerRef}
                role="slider"
                tabIndex={0}
                aria-label="Before and after image comparison slider"
                aria-valuenow={sliderPosition}
                aria-valuemin={0}
                aria-valuemax={100}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onKeyDown={handleKeyDown}
                style={{ touchAction: 'none' }}
                className="relative rounded-2xl sm:rounded-[20px] overflow-hidden shadow-xl bg-neutral-900 aspect-[4/3] group border border-white/10 select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              >
                {/* AFTER Image (Full Base Layer: AI Output) */}
                <img
                  src="/images/landing/img2img-result-burger.jpg"
                  alt="AI Enhanced Gourmet Burger"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                />

                {/* BEFORE Image (Clipped Top Layer: Reference Photo) */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src="/images/landing/img2img-ref-burger.jpg"
                    alt="Source Reference Photo"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                  />
                </div>

                {/* Draggable Vertical Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.7)] pointer-events-none z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Centered Circular Handle */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-950/95 border-2 border-cyan-400 text-cyan-300 shadow-xl shadow-black/80 flex items-center justify-center cursor-ew-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform duration-150">
                    <svg
                      className="w-4 h-4 text-cyan-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="8 7 3 12 8 17" />
                      <polyline points="16 7 21 12 16 17" />
                    </svg>
                  </div>
                </div>

                {/* Top Corner Quick Preset Snap Chips */}
                <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/60 backdrop-blur-md text-neutral-200 border border-white/15 shadow-sm">
                    BEFORE: Reference
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/40 shadow-sm">
                    AFTER: AI Output
                  </span>
                </div>

                {/* Bottom Center Hint Overlay */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md rounded-full px-2.5 py-0.5 border border-white/10 text-[11px] font-medium text-neutral-300">
                    <button
                      type="button"
                      onClick={() => setSliderPosition(100)}
                      className={`hover:text-white transition-colors ${sliderPosition === 100 ? 'text-cyan-400 font-bold' : ''}`}
                    >
                      Before
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => setSliderPosition(50)}
                      className={`hover:text-white transition-colors ${sliderPosition === 50 ? 'text-cyan-400 font-bold' : ''}`}
                    >
                      50/50
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => setSliderPosition(0)}
                      className={`hover:text-white transition-colors ${sliderPosition === 0 ? 'text-cyan-400 font-bold' : ''}`}
                    >
                      After
                    </button>
                  </div>

                  <span className="text-[10px] text-neutral-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hidden sm:inline-block">
                    Drag or use &larr; &rarr; keys
                  </span>
                </div>
              </div>

              {/* Bottom Dark Floating Prompt Bar */}
              <div className="rounded-xl sm:rounded-2xl bg-neutral-950/95 text-white p-3 sm:p-3.5 shadow-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <img
                    src="/images/landing/img2img-ref-burger.jpg"
                    alt="Ref thumbnail"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-mono text-neutral-100 truncate">
                      create a gourmet burger shot with melting cheddar, macro commercial lighting
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-300">
                      <span>FLUX.2 Klein / 1:1</span>
                      <span>&bull;</span>
                      <span className="text-cyan-400">Reference: 85% fidelity</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSliderPosition(50)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    title="Reset to 50/50 comparison"
                    aria-label="Reset to 50/50 comparison"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <Link
                    to="/dashboard/image-editor"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-pink-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    Create
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImageToImageSection
