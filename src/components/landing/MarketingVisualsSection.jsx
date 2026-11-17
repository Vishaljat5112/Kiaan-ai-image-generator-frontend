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
    <section id="marketing-demo" className="py-8 sm:py-10 lg:py-12 bg-[#06080F] border-t border-neutral-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, Copy, & CTA */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commercial Marketing Studio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-[1.2]">
                Create Visuals That Make an Impression
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Turn product concepts into striking campaign visuals without expensive photoshoots.
                Generate social media graphics, ad creatives, email headers, and promotional images
                that feel intentional and polished.
              </p>
              <p className="text-sm text-neutral-300/90 leading-relaxed">
                Control composition, lock brand shapes, refine aesthetics, and transition from raw idea
                to finished visual asset in minutes.
              </p>
            </div>

            <div className="pt-2 sm:pt-3">
              <Link
                to="/dashboard/image-generator"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Creative Tools
              </Link>
            </div>
          </div>

          {/* Right Column: Balanced Container with Interactive Walkthrough */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[24px] sm:rounded-[28px] p-4 sm:p-5.5 bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800/90 shadow-2xl overflow-hidden max-w-[540px] xl:max-w-[560px] lg:ml-auto w-full">
              {/* Dotted Background Texture */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#06b6d4 1.2px, transparent 1.2px)',
                  backgroundSize: '18px 18px'
                }}
              />

              <div className="relative z-10 space-y-4">
                {/* Visual Preview Screen */}
                <div className="relative rounded-2xl sm:rounded-[20px] overflow-hidden shadow-xl bg-neutral-950 aspect-[16/10.5] group border border-white/10">
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
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      Product Preview &bull; {steps[activeStep].badge}
                    </span>

                    {/* Play / Pause / Reset Interactive Controls */}
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20 text-white">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
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
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                        title="Restart Walkthrough"
                        aria-label="Restart Walkthrough"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Prompt Bar inside Preview */}
                  <div className="absolute bottom-3 inset-x-3 z-20">
                    <div className="rounded-xl bg-black/80 backdrop-blur-md p-2.5 sm:p-3 border border-white/20 text-white flex items-center justify-between gap-2.5 shadow-lg">
                      <p className="text-xs font-mono text-neutral-200 truncate">
                        {steps[activeStep].promptText}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 shrink-0">
                        {steps[activeStep].short}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
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
                        className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col gap-1 cursor-pointer select-none ${
                          isCurrent
                            ? 'bg-[#0B0F19] border-cyan-500/60 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                            : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComp className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-cyan-400' : 'text-neutral-500'}`} />
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

