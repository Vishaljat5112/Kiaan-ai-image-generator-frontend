import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ChevronDown, Check, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

// Four Compact Transformation Showcase Items: 4 AI Capabilities
const HERO_SHOWCASE_ITEMS = [
  {
    id: 'enhance',
    label: 'Image to Image',
    prompt: 'Enhance this car with sharp details and natural HD quality',
    beforeImage: '/hero%20images/hero-car-before.png',
    afterImage: '/hero%20images/hero-car-after.png',
    beforeAlt: 'Original sports car before AI enhancement',
    afterAlt: 'Enhanced sports car with sharp details and professional HD quality',
    hasSlider: true
  },
  {
    id: 'generate',
    label: 'Text to Image',
    prompt: 'Generate a beautiful modern villa with realistic details',
    afterImage: '/hero%20images/hero-villa-after.png',
    afterAlt: 'AI Generated modern luxury villa with landscaped gardens',
    hasSlider: false,
    badgeText: 'AI GENERATED'
  },
  {
    id: 'ai-edit',
    label: 'Edit Image',
    prompt: 'Retouch this portrait with natural lighting and clear details',
    beforeImage: '/hero%20images/hero-girl-before.png',
    afterImage: '/hero%20images/hero-girl-after.png',
    beforeAlt: 'Portrait before retouching',
    afterAlt: 'Retouched portrait with enhanced facial details and natural lighting',
    hasSlider: true
  },
  {
    id: 'animate',
    label: 'Image to Video',
    prompt: 'Bring this playful puppy to life with natural movement',
    beforeImage: '/hero%20images/hero-dog-before.png',
    afterVideo: '/hero%20images/hero-dog-video.mp4',
    afterImage: '/hero%20images/hero-dog-after.png',
    beforeAlt: 'Original golden retriever puppy photo',
    afterAlt: 'Animated golden retriever puppy in motion',
    hasSlider: true
  }
]

export function HeroSection() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  // Interactive Prompt Composer State
  const [prompt, setPrompt] = useState('')
  const [referenceImage, setReferenceImage] = useState(null)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [model, setModel] = useState('FLUX.2 Klein')
  const [variations, setVariations] = useState('4 var')
  const [showConfigMenu, setShowConfigMenu] = useState(false)

  // Hero Transformation Showcase State
  const [selectedShowcaseId, setSelectedShowcaseId] = useState('enhance')
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const viewerRef = useRef(null)
  const videoRef = useRef(null)

  const activeShowcase =
    HERO_SHOWCASE_ITEMS.find((item) => item.id === selectedShowcaseId) || HERO_SHOWCASE_ITEMS[0]

  // Ensure video plays smoothly and inline whenever dog video is active
  useEffect(() => {
    if (activeShowcase.afterVideo && videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [activeShowcase])

  const updateSliderFromClientX = useCallback((clientX) => {
    if (!viewerRef.current) return
    const rect = viewerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(Math.round(percent))
  }, [])

  const handlePointerDown = (e) => {
    setIsDragging(true)
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    if (clientX !== undefined) {
      updateSliderFromClientX(clientX)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX
      if (clientX !== undefined) {
        updateSliderFromClientX(clientX)
      }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchend', handlePointerUp)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }, [isDragging, updateSliderFromClientX])

  // Preload all 8 Before/After hero assets for instant switching without lag
  useEffect(() => {
    HERO_SHOWCASE_ITEMS.forEach((item) => {
      const imgBefore = new Image()
      imgBefore.src = item.beforeImage
      const imgAfter = new Image()
      imgAfter.src = item.afterImage
    })
  }, [])

  // Handle local reference image selection (no upload to server required)
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setReferenceImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReferenceImage = (e) => {
    e.stopPropagation()
    setReferenceImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle Create Button Click -> Route to Studio or Login
  const handleCreate = (e) => {
    e.preventDefault()
    const targetState = {
      prefilledPrompt: prompt || 'Cinematic astronaut with fiery cosmic reflections, 8k resolution',
      aspectRatio,
      model,
      hasReference: !!referenceImage
    }

    if (user) {
      navigate('/dashboard/image-generator', { state: targetState })
    } else {
      navigate('/login', {
        state: {
          redirect: '/dashboard/image-generator',
          promptIntent: targetState
        }
      })
    }
  }

  return (
    <section id="hero-prompt" className="pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headline, Description & Prompt Composer */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-extrabold tracking-tight text-white leading-[1.14]">
              Free AI <span className="bg-gradient-to-r from-cyan-300 via-pink-500 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Image Generator</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              Convert text-to-image instantly. Describe your idea, product shots, character art,
              social media graphics, logo concepts, and Kiaan Studio generates photorealistic or
              stylized images matching your exact vision. No design skills required.
            </p>
          </div>

          {/* Interactive Prompt Composer (Screenshot 1) */}
          <div className="relative">
            {/* Subtle Gradient Ring */}
            <div className="rounded-[24px] p-0.5 sm:p-1 bg-gradient-to-r from-cyan-500/40 via-pink-500/30 to-purple-500/40 shadow-xl shadow-cyan-500/10 ring-1 ring-white/10 transition-all duration-300">
              <div className="bg-[#0B0F19]/95 backdrop-blur-2xl rounded-[20px] p-3.5 sm:p-4 space-y-3 border border-neutral-800">
                {/* Textarea Input */}
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  rows={2}
                  className="w-full text-sm sm:text-base text-white placeholder:text-neutral-400 placeholder:font-normal bg-transparent border-0 focus:ring-0 focus:outline-none resize-none leading-relaxed"
                />

                {/* Reference Image Thumbnail Preview */}
                {referenceImage && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/90 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 max-w-fit backdrop-blur-md">
                    <img
                      src={referenceImage}
                      alt="Reference preview"
                      className="w-10 h-10 object-cover rounded-lg shadow-xs ring-1 ring-white/30"
                    />
                    <div className="text-xs text-neutral-300 pr-1">
                      <p className="font-semibold text-cyan-400">Reference attached</p>
                      <p className="text-neutral-500">Image-to-image active</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeReferenceImage}
                      className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      aria-label="Remove reference image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Bottom Composer Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {/* Add Image Control */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                      id="hero-reference-file"
                    />
                    <label
                      htmlFor="hero-reference-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:border-cyan-400/80 bg-white/[0.06] hover:bg-cyan-950/40 text-xs font-semibold text-neutral-100 hover:text-cyan-200 cursor-pointer transition-all shadow-xs select-none hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Add image</span>
                    </label>

                    {/* Settings Tag Button with Popover */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowConfigMenu(!showConfigMenu)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:border-cyan-400/80 bg-white/[0.06] hover:bg-cyan-950/40 text-xs font-semibold text-neutral-100 hover:text-cyan-200 transition-all shadow-xs select-none hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer"
                      >
                        <span className="text-cyan-300 font-semibold">{aspectRatio}</span>
                        <span className="text-neutral-500">&bull;</span>
                        <span>{model}</span>
                        <span className="text-neutral-500">&bull;</span>
                        <span>{variations}</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      {/* Dropdown Popover */}
                      {showConfigMenu && (
                        <div className="absolute left-0 bottom-full mb-2 w-64 rounded-2xl bg-[#0D111C]/95 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/95 p-3 z-30 space-y-3 text-white ring-1 ring-cyan-500/30">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Aspect Ratio</span>
                            <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                              {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => setAspectRatio(ratio)}
                                  className={`py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${aspectRatio === ratio
                                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300'
                                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                                    }`}
                                >
                                  {ratio}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Model</span>
                            <div className="flex flex-col gap-1 mt-1.5">
                              {['FLUX.2 Klein', 'Z-Image Turbo'].map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setModel(m)}
                                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${model === m
                                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/70 shadow-sm'
                                    : 'text-neutral-300 hover:bg-neutral-900'
                                    }`}
                                >
                                  <span>{m}</span>
                                  {model === m && <Check className="w-3 h-3 text-cyan-400" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Variations</span>
                            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                              {['1 var', '4 var'].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setVariations(v)}
                                  className={`py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${variations === v
                                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300'
                                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                                    }`}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end pt-1 border-t border-neutral-800">
                            <button
                              type="button"
                              onClick={() => setShowConfigMenu(false)}
                              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Create Button (Screenshot 1) */}
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] select-none cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>

            {/* Note below composer */}
            <p className="text-xs text-neutral-300/80 mt-2.5 pl-2 font-medium">
              No credit card required &bull; Commercial open weights
            </p>
          </div>
        </div>

        {/* Right Column: Premium AI Image Transformation Showcase */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] xl:max-w-[460px] mx-auto">
          {/* Outer Frame with Clean Subtle Cyan/Purple Accent Border */}
          <div className="relative w-full rounded-[22px] sm:rounded-[26px] p-[1px] bg-gradient-to-br from-cyan-500/25 via-purple-500/20 to-white/10 shadow-xl shadow-black/60 transition-all duration-300">
            <div className="bg-[#0B0F19]/95 backdrop-blur-xl rounded-[21px] sm:rounded-[25px] p-2.5 sm:p-3 border border-neutral-800/80 space-y-2 sm:space-y-2.5">
              {/* Dynamic AI Prompt Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120F24]/80 border border-purple-500/35 backdrop-blur-md shadow-xs shadow-purple-950/30">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <p className="text-xs text-purple-100/90 font-medium truncate select-none leading-none">
                  {activeShowcase.prompt}
                </p>
              </div>

              {/* Main Showcase Viewer Panel */}
              {activeShowcase.hasSlider ? (
                <div
                  ref={viewerRef}
                  onMouseDown={handlePointerDown}
                  onTouchStart={handlePointerDown}
                  className="relative w-full aspect-[16/10] rounded-[15px] sm:rounded-[17px] overflow-hidden bg-neutral-950 border border-white/10 cursor-ew-resize select-none group"
                >
                  {/* AFTER Layer (Bottom Layer): Video for Dog, Image for Others */}
                  {activeShowcase.afterVideo ? (
                    <video
                      ref={videoRef}
                      key={activeShowcase.afterVideo}
                      src={activeShowcase.afterVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                    />
                  ) : (
                    <img
                      src={activeShowcase.afterImage}
                      alt={activeShowcase.afterAlt}
                      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                      loading="eager"
                    />
                  )}
                  {/* Subtle AFTER Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none select-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-purple-950/80 backdrop-blur-md text-purple-200 border border-purple-400/40 shadow-sm">
                      AFTER
                    </span>
                  </div>

                  {/* BEFORE Image (Clipped Top Layer) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <img
                      src={activeShowcase.beforeImage}
                      alt={activeShowcase.beforeAlt}
                      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                      loading="eager"
                    />
                    {/* Subtle BEFORE Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none select-none">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/65 backdrop-blur-md text-white/90 border border-white/20 shadow-sm">
                        BEFORE
                      </span>
                    </div>
                  </div>

                  {/* Thin Clearly Visible Vertical Divider Line */}
                  <div
                    className="absolute inset-y-0 w-[1.5px] bg-white/95 shadow-[0_0_8px_rgba(255,255,255,0.7)] pointer-events-none z-20 flex items-center justify-center"
                    style={{ left: `${sliderPos}%` }}
                  >
                    {/* Compact circular drag handle with left/right arrows */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-900/95 text-white backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center -ml-3 sm:-ml-3.5 select-none">
                      <span className="text-[10px] sm:text-xs text-cyan-300 font-bold leading-none select-none tracking-tighter">
                        &#8596;
                      </span>
                    </div>
                  </div>

                  {/* Accessible range input overlay for keyboard/screen-readers */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft') {
                        e.preventDefault()
                        setSliderPos((p) => Math.max(0, p - 5))
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault()
                        setSliderPos((p) => Math.min(100, p + 5))
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                    aria-label="Before and after transformation slider"
                  />
                </div>
              ) : (
                /* Non-slider Single Generated Image Panel (Generate Tab) */
                <div className="relative w-full aspect-[16/10] rounded-[15px] sm:rounded-[17px] overflow-hidden bg-neutral-950 border border-white/10 select-none group">
                  <img
                    src={activeShowcase.afterImage}
                    alt={activeShowcase.afterAlt}
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                    loading="eager"
                  />
                  {/* Subtle AI Generated Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none select-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/40 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      AI GENERATED
                    </span>
                  </div>
                </div>
              )}

              {/* Four Compact Clickable Thumbnails: Image to Image, Text to Image, Edit Image, Image to Video */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {HERO_SHOWCASE_ITEMS.map((item) => {
                  const isSelected = item.id === selectedShowcaseId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedShowcaseId(item.id)
                        setSliderPos(50)
                      }}
                      className={`group relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all duration-200 cursor-pointer select-none text-center ${
                        isSelected
                          ? 'bg-purple-950/30 ring-1 ring-cyan-400/80 border border-purple-500/50 shadow-sm shadow-cyan-500/10'
                          : 'bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] opacity-75 hover:opacity-100'
                      }`}
                      aria-label={`Select ${item.label} transformation`}
                      aria-pressed={isSelected}
                    >
                      <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-neutral-900">
                        <img
                          src={item.afterImage}
                          alt={item.label}
                          className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Small Selected Indicator Pip */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-neutral-950 shadow-xs" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-semibold tracking-tight transition-colors line-clamp-1 w-full ${
                          isSelected
                            ? 'text-cyan-300 font-bold'
                            : 'text-neutral-300 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
