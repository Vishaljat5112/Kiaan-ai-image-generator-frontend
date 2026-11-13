import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'

export function ImageToImageSection() {
  const [activeView, setActiveView] = useState('result') // 'result' or 'reference'

  return (
    <section id="image-to-image" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#06080F] scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Heading, Description & Black Pill CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.15]">
              Generate Images Using A Reference Image
            </h2>
            <p className="text-base text-neutral-300 leading-relaxed">
              Kiaan Studio photo generator allows creators to upload a reference image to guide
              your creation. Whether it&apos;s for capturing a specific pose, color palette, or visual
              structure, the image to image AI intelligently interprets your reference to deliver
              accurate and enhanced results.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              It&apos;s a great way to fine-tune your AI generated image while still enjoying the freedom
              of creativity. When you&apos;re ready to animate images, Kiaan Studio AI video generator turns
              the same ideas into motion.
            </p>
          </div>

          <div>
            <Link
              to="/dashboard/image-editor"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Generate Image to Image
            </Link>
          </div>
        </div>

        {/* Right Column: Light Lavender Dotted Background & Interactive Demonstration (Screenshot 3) */}
        <div className="lg:col-span-7">
          <div className="relative rounded-[32px] p-6 sm:p-10 bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 shadow-2xl overflow-hidden">
            {/* Subtle Lavender Dotted Grid Pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#06b6d4 1.2px, transparent 1.2px)',
                backgroundSize: '18px 18px'
              }}
            />

            {/* Interactive Image Container */}
            <div className="relative z-10 space-y-4">
              {/* Media Card with View Toggle */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-neutral-900 aspect-[4/3] group border border-black/5">
                <img
                  src={
                    activeView === 'result'
                      ? '/images/landing/img2img-result-burger.jpg'
                      : '/images/landing/img2img-ref-burger.jpg'
                  }
                  alt={activeView === 'result' ? 'AI Enhanced Gourmet Burger' : 'Source Reference Image'}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Floating interactive toggle chip in top right */}
                <div className="absolute top-4 right-4 z-20 flex items-center bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20">
                  <button
                    type="button"
                    onClick={() => setActiveView('reference')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      activeView === 'reference'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    Reference
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('result')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      activeView === 'result'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs font-bold'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    AI Output
                  </button>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-white border border-white/10">
                    {activeView === 'result' ? 'Transformed • 8K Commercial Finish' : 'Uploaded Reference Photo'}
                  </span>
                </div>
              </div>

              {/* Bottom Dark Floating Prompt Bar (Screenshot 3) */}
              <div className="rounded-2xl bg-neutral-950 text-white p-3 sm:p-4 shadow-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <img
                    src="/images/landing/img2img-ref-burger.jpg"
                    alt="Ref thumbnail"
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-neutral-200 truncate">
                      create a gourmet burger shot with melting cheddar, macro commercial lighting
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                      <span>FLUX.2 Klein / 1:1</span>
                      <span>&bull;</span>
                      <span className="text-cyan-400">Reference: 85% fidelity</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveView(activeView === 'result' ? 'reference' : 'result')}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    title="Toggle Before / After"
                    aria-label="Toggle Before / After"
                  >
                    <RefreshCw className="w-4 h-4" />
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
