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
              Kiaan Studio transforms your reference images into stunning AI-generated visuals. Upload a photo to preserve its composition, style, or subject while enhancing details, lighting, and overall quality.
            </p>
            <p className="text-sm text-neutral-300/90 leading-relaxed">
              From product photography to creative transformations, turn ordinary images into professional results in just a few clicks.
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
        <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-end w-full">
          <div className="relative rounded-[20px] sm:rounded-[24px] p-3 sm:p-3.5 bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800/90 shadow-2xl overflow-hidden max-w-[400px] sm:max-w-[415px] lg:max-w-[420px] xl:max-w-[430px] w-full mx-auto lg:ml-auto lg:mr-0">
            {/* Subtle Dotted Background Pattern */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none bg-studio-dots"
            />

            {/* Interactive Image Container */}
            <div className="relative z-10 space-y-2.5 sm:space-y-3">
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
                className="relative rounded-xl sm:rounded-[18px] overflow-hidden shadow-2xl bg-neutral-900 aspect-[4/3] group/slider border border-white/15 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
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
                    className="absolute top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-950/95 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.7)] flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-115 active:scale-95 transition-transform duration-150 ring-2 ring-cyan-500/30"
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
                      className="w-3.5 h-3.5 text-cyan-300"
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

                {/* Subtle BEFORE Badge (Top Left) */}
                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none select-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/65 backdrop-blur-md text-white/90 border border-white/20 shadow-sm">
                    BEFORE
                  </span>
                </div>

                {/* Subtle AFTER Badge (Top Right) */}
                <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none select-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/40 shadow-sm">
                    AFTER
                  </span>
                </div>
              </div>

              {/* Bottom Dark Floating Prompt Bar */}
              <div className="rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-xl text-white p-2.5 sm:p-3 shadow-2xl border border-white/10 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <img
                    src="/images/landing/img2img-ref-burger.jpg"
                    alt="Ref thumbnail"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-cyan-500/40 ring-1 ring-white/15 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-mono text-neutral-100 font-medium truncate sm:whitespace-normal sm:line-clamp-1 leading-snug">
                      Create a premium gourmet burger product photo
                    </p>
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-400 whitespace-nowrap">
                      <span className="text-neutral-300">FLUX.2 Klein / 1:1</span>
                      <span className="text-neutral-600">&bull;</span>
                      <span className="text-cyan-400 font-medium">Reference: 85% fidelity</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSliderPosition(50)}
                    className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-colors cursor-pointer"
                    title="Reset to 50/50 comparison"
                    aria-label="Reset to 50/50 comparison"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    to="/dashboard/image-editor"
                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
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
