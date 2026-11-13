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
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#06080F] scroll-mt-24">
      {/* Section Title */}
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          How To Make AI Images Instantly
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Interactive 3 Vertical Steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3">
            {steps.map((item) => {
              const isActive = activeStep === item.step
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-transparent border-transparent hover:bg-neutral-900/40 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-xs'
                          : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      }`}
                    >
                      {item.step}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Compact Violet CTA (Screenshot 4) */}
          <div className="pt-4">
            <Link
              to="/dashboard/image-generator"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Right Column: Dynamic Preview Container Updating with Selected Step */}
        <div className="lg:col-span-7">
          <div className="relative rounded-[32px] overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl aspect-[4/3] group">
            {/* Step 1 Visual: Prompt & Reference Input */}
            {activeStep === 1 && (
              <div className="w-full h-full relative flex flex-col justify-end p-6 sm:p-8 animate-fadeIn">
                <img
                  src="/images/landing/howitworks-step1.jpg"
                  alt="Prompt input demonstration"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Floating Mockup UI (Screenshot 4 Prompt Composer Representation) */}
                <div className="relative z-10 bg-[#0D111C]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-neutral-800 text-white max-w-xl mx-auto w-full space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                    <Wand2 className="w-4 h-4" />
                    <span>Step 1 &bull; Text &amp; Reference Input</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 font-mono">
                    &quot;Celestial astronaut helmet, fiery orange nebula reflections, hyperrealistic 8k render&quot;
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      Optional reference image attached
                    </span>
                    <span className="font-semibold text-white">Ready to configure &rarr;</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Visual: Style & Model Customization */}
            {activeStep === 2 && (
              <div className="w-full h-full relative flex flex-col justify-center p-6 sm:p-8 animate-fadeIn">
                <img
                  src="/images/landing/howitworks-step2.jpg"
                  alt="Style customization demonstration"
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

                <div className="relative z-10 bg-neutral-950/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-neutral-800 text-white max-w-lg mx-auto w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <Sliders className="w-4 h-4" />
                      <span>Step 2 &bull; Style &amp; Engine Customization</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">FLUX.2 Klein 4B</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Style Presets</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Photorealistic', 'Cinematic 8K', 'Anime Studio', '3D Concept', 'Macro Shot'].map((style, i) => (
                        <span
                          key={style}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            i === 0
                              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 font-bold shadow-xs'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Aspect Ratio</span>
                      <span className="font-semibold text-white mt-0.5 block">16:9 Landscape (1024×576)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Inference Steps</span>
                      <span className="font-semibold text-white mt-0.5 block">4 Steps (Distilled Flow)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Visual: High-Resolution Generation & Download */}
            {activeStep === 3 && (
              <div className="w-full h-full relative flex flex-col justify-end p-6 sm:p-8 animate-fadeIn">
                <img
                  src="/images/landing/howitworks-step3.jpg"
                  alt="High-resolution generated asset"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 bg-black/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-white flex flex-wrap items-center justify-between gap-3">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-neutral-950 hover:bg-neutral-100 transition-colors shadow-sm"
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
