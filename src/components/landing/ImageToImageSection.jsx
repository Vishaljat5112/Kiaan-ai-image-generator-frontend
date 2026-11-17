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
    // If the click is on an interactive button or control, do not trigger dragging
    if (e.target.closest('button')) return
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
    <section id="image-to-image" className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#06080F] scroll-mt-20 border-t border-neutral-800/80">
      {/* Top subtle light beam separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Heading, Description & Pill CTA */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 backdrop-blur-md border border-cyan-400/50 text-xs font-mono uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span>Reference Synthesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-[1.2] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
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
              className="absolute inset-0 opacity-30 pointer-events-none bg-studio-dots"
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
                className="relative rounded-2xl sm:rounded-[20px] overflow-hidden shadow-2xl bg-neutral-900 aspect-[4/3] group/slider border border-white/15 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
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

                {/* Draggable Vertical Divider Line with Neon Glow */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-300 via-white to-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)] pointer-events-none z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Centered Circular Handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-950/95 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.7)] flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-115 active:scale-95 transition-transform duration-150 ring-2 ring-cyan-500/30"
                    style={{
                      transform:
                        sliderPosition >= 96
                          ? 'translate(-88%, -50%)'
                          : sliderPosition <= 4
                            ? 'translate(-12%, -50%)'
                            : 'translate(-50%, -50%)'
                    }}
                  >
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
                <div
                  className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSliderPosition(100)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold backdrop-blur-xl border transition-all cursor-pointer shadow-md select-none ${
                      sliderPosition === 100
                        ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400 shadow-cyan-500/30'
                        : 'bg-black/70 text-neutral-200 border-white/20 hover:border-white/40'
                    }`}
                  >
                    BEFORE: Reference
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSliderPosition(0)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold backdrop-blur-xl border transition-all cursor-pointer shadow-md select-none ${
                      sliderPosition === 0
                        ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400 shadow-cyan-500/30'
                        : 'bg-black/70 text-cyan-300 border-cyan-400/50 hover:border-cyan-400'
                    }`}
                  >
                    AFTER: AI Output
                  </button>
                </div>

                {/* Bottom Center Hint Overlay with Working Before, 50/50, and After Buttons */}
                <div
                  className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                >
                  <div
                    className="flex items-center gap-1.5 bg-black/80 backdrop-blur-xl rounded-full p-1 border border-white/20 text-[11px] font-medium text-neutral-300 shadow-xl"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSliderPosition(100)
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                      }}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer select-none font-semibold ${
                        sliderPosition === 100
                          ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300'
                          : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                      aria-label="Show Before image on right"
                    >
                      Before
                    </button>
                    <span className="text-neutral-500">&bull;</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSliderPosition(50)
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                      }}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer select-none font-semibold ${
                        sliderPosition === 50
                          ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300'
                          : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                      aria-label="Show 50/50 comparison in between"
                    >
                      50/50
                    </button>
                    <span className="text-neutral-500">&bull;</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSliderPosition(0)
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                      }}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer select-none font-semibold ${
                        sliderPosition === 0
                          ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300'
                          : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                      aria-label="Show After image on left"
                    >
                      After
                    </button>
                  </div>

                  <span className="text-[10px] text-neutral-400 bg-black/70 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/15 hidden sm:inline-block shadow-sm">
                    Drag or use &larr; &rarr; keys
                  </span>
                </div>
              </div>

              {/* Bottom Dark Floating Prompt Bar */}
              <div className="rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-xl text-white p-3 sm:p-3.5 shadow-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <img
                    src="/images/landing/img2img-ref-burger.jpg"
                    alt="Ref thumbnail"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-cyan-500/40 ring-1 ring-white/15 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-mono text-neutral-100 truncate">
                      create a gourmet burger shot with melting cheddar, macro commercial lighting
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-300">
                      <span>FLUX.2 Klein / 1:1</span>
                      <span>&bull;</span>
                      <span className="text-cyan-400 font-medium">Reference: 85% fidelity</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSliderPosition(50)}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-colors cursor-pointer"
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
