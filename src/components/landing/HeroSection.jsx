import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ChevronDown, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

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
    <section id="hero-prompt" className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Headline, Description & Prompt Composer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.1]">
              Free AI <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 bg-clip-text text-transparent">Image Generator</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl">
              Convert text-to-image instantly. Describe your idea, product shots, character art,
              social media graphics, logo concepts, and Kiaan Studio generates photorealistic or
              stylized images matching your exact vision. No design skills required.
            </p>
          </div>

          {/* Interactive Prompt Composer (Screenshot 1) */}
          <div className="relative">
            {/* Subtle Gradient Glow Ring */}
            <div className="rounded-[26px] p-1 bg-gradient-to-r from-cyan-500/40 via-pink-500/30 to-purple-500/40 shadow-xl shadow-cyan-500/10 ring-1 ring-white/10">
              <div className="bg-[#0B0F19]/95 backdrop-blur-md rounded-[22px] p-4 sm:p-5 space-y-4 border border-neutral-800">
                {/* Textarea Input */}
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  rows={3}
                  className="w-full text-base sm:text-lg text-white placeholder:text-neutral-500 placeholder:font-normal bg-transparent border-0 focus:ring-0 focus:outline-none resize-none"
                />

                {/* Reference Image Thumbnail Preview */}
                {referenceImage && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-700 max-w-fit">
                    <img
                      src={referenceImage}
                      alt="Reference preview"
                      className="w-10 h-10 object-cover rounded-lg shadow-xs"
                    />
                    <div className="text-xs text-neutral-300 pr-1">
                      <p className="font-semibold text-cyan-400">Reference attached</p>
                      <p className="text-neutral-500">Image-to-image active</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeReferenceImage}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50"
                      aria-label="Remove reference image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Bottom Composer Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 hover:border-cyan-500/50 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 cursor-pointer transition-colors shadow-2xs select-none"
                    >
                      <Plus className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Add image</span>
                    </label>

                    {/* Settings Tag Button with Popover */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowConfigMenu(!showConfigMenu)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 hover:border-cyan-500/50 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors shadow-2xs select-none"
                      >
                        <span>{aspectRatio}</span>
                        <span className="text-neutral-300">&bull;</span>
                        <span>{model}</span>
                        <span className="text-neutral-300">&bull;</span>
                        <span>{variations}</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      {/* Dropdown Popover */}
                      {showConfigMenu && (
                        <div className="absolute left-0 bottom-full mb-2 w-64 rounded-2xl bg-[#0D111C] border border-neutral-800 shadow-xl shadow-black/80 p-3 z-30 space-y-3 text-white">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Aspect Ratio</span>
                            <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                              {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => setAspectRatio(ratio)}
                                  className={`py-1 rounded-lg text-xs font-semibold transition-colors ${
                                    aspectRatio === ratio
                                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold'
                                      : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                                  }`}
                                >
                                  {ratio}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Model</span>
                            <div className="flex flex-col gap-1 mt-1.5">
                              {['FLUX.2 Klein', 'Z-Image Turbo'].map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setModel(m)}
                                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    model === m
                                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50'
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
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Variations</span>
                            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                              {['1 var', '4 var'].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setVariations(v)}
                                  className={`py-1 rounded-lg text-xs font-semibold transition-colors ${
                                    variations === v
                                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold'
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
                              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
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
            <p className="text-xs text-neutral-400 mt-2.5 pl-2 font-medium">
              No credit card required &bull; Commercial open weights
            </p>
          </div>
        </div>

        {/* Right Column: Large Cinematic Artwork (Screenshot 1) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[480px] lg:max-w-none aspect-[4/4] sm:aspect-[4/3] lg:aspect-[1/1] rounded-[32px] overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950 group ring-1 ring-cyan-500/20">
            {/* The astronaut artwork matching screenshot 1 */}
            <img
              src="/images/landing/hero-astronaut.jpg"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/images/landing/hero-astronaut-fallback.jpg'
              }}
              alt="Cinematic astronaut portrait with fiery reflections"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[32px] pointer-events-none" />

            {/* Floating prompt badge on hover */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs font-mono text-neutral-300 line-clamp-1">
                prompt: &quot;cinematic astronaut, fiery cosmic sparks, 8k render&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
