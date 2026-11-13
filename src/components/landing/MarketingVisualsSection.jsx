import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Play, Pause, RotateCcw, CheckCircle2, Sliders, Type, Image as ImageIcon } from 'lucide-react'

export function MarketingVisualsSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const steps = [
    {
      id: 'prompt',
      title: '1. Enter Campaign Prompt',
      short: 'Prompt Input',
      icon: Type,
      promptText: 'Luxury amber cosmetic serum bottle on wet black obsidian stone, subtle water ripples, directional studio lighting, 8k commercial packshot',
      badge: 'Prompt Engine'
    },
    {
      id: 'reference',
      title: '2. Select Brand Asset',
      short: 'Asset Reference',
      icon: ImageIcon,
      promptText: 'Packaging geometry locked • Reference silhouette fidelity 90% • Neutral studio backdrop',
      badge: 'Shape Preservation'
    },
    {
      id: 'parameters',
      title: '3. Fine-Tune Studio Aesthetics',
      short: 'Studio Controls',
      icon: Sliders,
      promptText: '16:9 Landscape • FLUX.2 Klein 4B Engine • 4-Step Distilled Flow • High Dynamic Range',
      badge: 'Commercial Precision'
    },
    {
      id: 'output',
      title: '4. Export High-Impact Asset',
      short: 'Commercial Render',
      icon: CheckCircle2,
      promptText: 'Synthesis Complete • 4K Resolution Ready • Commercial Rights Granted',
      badge: 'Final Creative Asset'
    }
  ]

  // Auto-cycle through the demonstration steps unless paused
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [isPlaying, steps.length])

  return (
    <section id="marketing-demo" className="py-16 sm:py-24 bg-white border-t border-neutral-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading, Copy, & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 text-xs font-semibold text-violet-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commercial Marketing Studio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-neutral-950 tracking-tight leading-[1.15]">
                Create Visuals That Make an Impression
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                Turn product concepts into striking campaign visuals without expensive photoshoots.
                Generate social media graphics, ad creatives, email headers, and promotional images
                that feel intentional and polished.
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Control composition, lock brand shapes, refine aesthetics, and transition from raw idea
                to finished visual asset in minutes.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/dashboard/image-generator"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-base bg-neutral-950 hover:bg-neutral-800 text-white shadow-lg hover:shadow-neutral-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Creative Tools
              </Link>
            </div>
          </div>

          {/* Right Column: Lavender Dotted Container with Interactive Walkthrough */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[32px] p-6 sm:p-10 bg-gradient-to-br from-violet-100/60 via-purple-50/40 to-indigo-100/50 border border-violet-100 shadow-sm overflow-hidden">
              {/* Lavender Dotted Background Texture */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#8b5cf6 1.2px, transparent 1.2px)',
                  backgroundSize: '18px 18px'
                }}
              />

              <div className="relative z-10 space-y-5">
                {/* Visual Preview Screen */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-neutral-950 aspect-[16/10] group border border-black/10">
                  <img
                    src={
                      activeStep === 1
                        ? '/images/landing/marketing-product-ref.jpg'
                        : '/images/landing/marketing-product-poster.jpg'
                    }
                    alt="Commercial product demonstration"
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />

                  {/* Dark gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Demo Status Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      Product Preview &bull; {steps[activeStep].badge}
                    </span>

                    {/* Play / Pause / Reset Interactive Controls */}
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20 text-white">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                        title={isPlaying ? 'Pause Demo' : 'Play Demo'}
                        aria-label={isPlaying ? 'Pause Demo' : 'Play Demo'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStep(0)
                          setIsPlaying(true)
                        }}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                        title="Restart Walkthrough"
                        aria-label="Restart Walkthrough"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Prompt Bar inside Preview */}
                  <div className="absolute bottom-4 inset-x-4 z-20">
                    <div className="rounded-xl bg-black/75 backdrop-blur-md p-3 border border-white/20 text-white flex items-center justify-between gap-3">
                      <p className="text-xs font-mono text-neutral-200 truncate">
                        {steps[activeStep].promptText}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/60 shrink-0">
                        {steps[activeStep].short}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {steps.map((st, idx) => {
                    const isCurrent = activeStep === idx
                    const IconComp = st.icon
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setActiveStep(idx)
                          setIsPlaying(false)
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 ${
                          isCurrent
                            ? 'bg-white border-violet-300 text-neutral-950 shadow-sm ring-2 ring-violet-500/20'
                            : 'bg-white/60 hover:bg-white/90 border-transparent text-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComp className={`w-3.5 h-3.5 ${isCurrent ? 'text-violet-600' : 'text-neutral-400'}`} />
                          <span className="font-bold text-[11px] truncate">{st.short}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">Step 0{idx + 1}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketingVisualsSection

