import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Sliders, CheckCircle2, Wand2, Image as ImageIcon } from 'lucide-react'

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      step: 1,
      title: 'Add Your Prompt or Upload Image',
      description:
        'Enter your text prompt or upload a reference image with your prompt, or use both together. The tool will use your prompt to generate the best results automatically.'
    },
    {
      step: 2,
      title: 'Customize Your Output Style',
      description:
        'Select the aspect ratios, AI image model, artistic styles, and quality settings. Writing the best prompt for AI image generator results means including subject, style, lighting, and mood for better AI pictures that match your vision.'
    },
    {
      step: 3,
      title: 'Generate and Download Images',
      description:
        'Click generate and watch your AI image appear in seconds. Download high-resolution files, continue editing in Kiaan Studio’s editing suite, or create more variations.'
    }
  ]

  return (
    <section id="how-it-works" className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#06080F] scroll-mt-20 border-t border-neutral-800/80">
      {/* Top subtle light beam separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent pointer-events-none" />

      {/* Section Title */}
      <div className="mb-6 sm:mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 backdrop-blur-md border border-cyan-400/50 text-xs font-mono uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span>Workflow Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          How To Make AI Images Instantly
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Interactive 3 Vertical Steps (Aligned Exactly with Right Image Top & Bottom) */}
        <div className="lg:col-span-6 flex flex-col justify-stretch items-start h-full">
          <div className="max-w-[480px] xl:max-w-[500px] w-full h-full flex flex-col justify-between">
            <div className="space-y-2 sm:space-y-2.5">
              {steps.map((item) => {
                const isActive = activeStep === item.step
                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(item.step)}
                    className={`w-full cursor-pointer rounded-xl sm:rounded-2xl p-2.5 sm:p-3 transition-all duration-300 border ${isActive
                      ? 'bg-gradient-to-r from-cyan-950/40 via-[#0D152A] to-[#0B1020] border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-[#0B0F19]/80 backdrop-blur-md border-white/[0.08] hover:border-white/20 hover:bg-[#0E1424] shadow-md'
                      }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      {/* Number Badge */}
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 transition-all ${isActive
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/35 ring-1 ring-cyan-300/50'
                          : 'bg-neutral-900/90 text-neutral-400 border border-neutral-700/60'
                          }`}
                      >
                        {item.step}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <h3 className={`text-xs sm:text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-neutral-200'}`}>
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-neutral-300/90 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Compact CTA (Aligned with Bottom of Right Image) */}
            <div className="pt-2 sm:pt-2.5 flex items-center">
              <Link
                to="/dashboard/image-generator"
                className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Preview Container (Stretches to Exact Height of Left Column) */}
        <div className="lg:col-span-6 flex flex-col justify-stretch items-center lg:items-end h-full">
          <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden bg-neutral-950 border border-neutral-800/90 shadow-2xl aspect-[16/11] lg:aspect-auto w-full max-w-[480px] xl:max-w-[500px] h-full flex flex-col group ring-1 ring-cyan-500/20">

            {/* Step 1 Visual: Prompt & Reference Input */}
            {activeStep === 1 && (
              <div className="w-full h-full relative flex flex-col justify-end p-4 sm:p-5 transition-opacity duration-300">
                <img
                  src="/images/landing/howitworks-step1.jpg"
                  alt="Prompt input demonstration"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/95 via-[#06080F]/45 to-transparent" />

                {/* Floating Mockup UI */}
                <div className="relative z-10 bg-[#0B0F19]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-4.5 shadow-2xl border border-white/15 text-white max-w-lg mx-auto w-full space-y-3 ring-1 ring-cyan-500/20">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Wand2 className="w-4 h-4" />
                      <span>Step 1 &bull; Text &amp; Reference Input</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300/90 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/40">FLUX.2 Klein Engine</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-neutral-100 font-mono leading-relaxed shadow-inner">
                    &quot;Celestial astronaut helmet, fiery orange nebula reflections, hyperrealistic 8k render&quot;
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-0.5">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      Optional reference image attached
                    </span>
                    <span className="font-semibold text-cyan-400 hover:text-cyan-300">Ready to configure &rarr;</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Visual: Style & Model Customization */}
            {activeStep === 2 && (
              <div className="w-full h-full relative flex flex-col justify-center p-4 sm:p-5 transition-opacity duration-300">
                <img
                  src="/images/landing/howitworks-step2.jpg"
                  alt="Style customization demonstration"
                  className="absolute inset-0 w-full h-full object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/75" />

                <div className="relative z-10 bg-[#0B0F19]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/15 text-white max-w-lg mx-auto w-full space-y-3.5 ring-1 ring-cyan-500/20">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <Sliders className="w-4 h-4" />
                      <span>Step 2 &bull; Style &amp; Engine Customization</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300/90 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/40 shadow-xs">FLUX.2 Klein 4B</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-neutral-300 font-bold uppercase tracking-wider">Style Presets</span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {['Photorealistic', 'Cinematic 8K', 'Anime Studio', '3D Concept', 'Macro Shot'].map((style, i) => (
                        <span
                          key={style}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${i === 0
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/25 ring-1 ring-cyan-300/50'
                            : 'bg-neutral-900/80 border border-white/10 text-neutral-300 hover:border-cyan-400/40'
                            }`}
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-white/10 shadow-inner">
                      <span className="text-neutral-400 block text-[11px] uppercase font-bold">Aspect Ratio</span>
                      <span className="font-semibold text-white mt-0.5 block">16:9 Landscape (1024×576)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-white/10 shadow-inner">
                      <span className="text-neutral-400 block text-[11px] uppercase font-bold">Inference Steps</span>
                      <span className="font-semibold text-white mt-0.5 block">4 Steps (Distilled Flow)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Visual: High-Resolution Generation & Download */}
            {activeStep === 3 && (
              <div className="w-full h-full relative flex flex-col justify-end p-4 sm:p-5 transition-opacity duration-300">
                <img
                  src="/images/landing/howitworks-step3.jpg"
                  alt="High-resolution generated asset"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                <div className="relative z-10 bg-[#0B0F19]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-4.5 border border-white/15 text-white flex flex-wrap items-center justify-between gap-3 shadow-2xl max-w-lg mx-auto w-full ring-1 ring-emerald-500/30">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Synthesis Complete &bull; 0.8s Latency</span>
                    </div>
                    <p className="text-sm font-bold text-white">Full 4K Ultra-HD Output</p>
                    <p className="text-xs text-neutral-300">Commercial License Cleared</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/dashboard/image-generator"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-neutral-950 hover:bg-neutral-100 transition-colors shadow-md hover:scale-105 active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download 4K</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
