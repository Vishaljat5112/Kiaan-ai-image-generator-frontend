import React from 'react'
import { Link } from 'react-router-dom'
import { Wand2 } from 'lucide-react'

export function ImageEditingSection() {
  // 5 High-Quality Showcase Items
  const editShowcaseItems = [
    {
      id: 'relighting',
      title: 'Atmospheric Studio Relighting',
      tag: 'Neural Relighting',
      desc: 'Add directional beams, color gels, and cinematic depth to existing portraits.',
      image: '/images/landing/edit-relighting.jpg'
    },
    {
      id: 'inpainting',
      title: 'Generative Fill & Background Replace',
      tag: 'Smart Inpainting',
      desc: 'Seamlessly replace scene elements, extend canvas boundaries, or clean unwanted artifacts.',
      image: '/images/landing/edit-node-workflow.jpg'
    },
    {
      id: 'detail-enhancement',
      title: 'Multi-Subject Composition',
      tag: 'Creative Synthesis',
      desc: 'Merge complex subjects and ethereal lighting with coherent focal blending.',
      image: '/images/landing/edit-horse-mist.jpg'
    },
    {
      id: 'upscale',
      title: 'Ultra-Fine Facial Retouch & 4K Upscale',
      tag: 'Hi-Res Upscaler',
      desc: 'Enhance micro-textures, skin fidelity, and hair details without plastic smoothing.',
      image: '/images/landing/edit-macro-upscale.jpg'
    },
    {
      id: 'cyberpunk',
      title: 'Neural Style & Aesthetic Grading',
      tag: 'Style Transfer',
      desc: 'Transform color palettes and lighting models into stylized concept art.',
      image: '/images/landing/edit-cyberpunk.jpg'
    }
  ]

  // Quadruplicate to guarantee smooth, seamless infinite marquee looping matching Community Creations
  const baseItems = [...editShowcaseItems, ...editShowcaseItems]
  const loopItems = [...baseItems, ...baseItems]

  return (
    <section id="image-editing" className="relative py-8 sm:py-10 lg:py-12 bg-[#06080F] overflow-hidden scroll-mt-20 border-t border-neutral-800/80">
      {/* Subtle top divider line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none" />

      {/* Section Header (Matched to Community Creations style) */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 backdrop-blur-md border border-cyan-400/50 text-xs font-mono uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-3">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Full Editing Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Edit, Enhance &amp; Perfect Every Detail
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
          Explore creative image transformations, visual refinements, and editing possibilities in
          one streamlined workspace. Add subtle variations, remove backgrounds, or adjust lighting
          in seconds.
        </p>
      </div>

      {/* Infinite Horizontal Carousel Strip (Same as Community Creations) */}
      <div className="relative w-full group overflow-hidden">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-14 sm:w-28 bg-gradient-to-r from-[#06080F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-14 sm:w-28 bg-gradient-to-l from-[#06080F] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee gap-5 sm:gap-6 px-4 py-2.5">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-56 sm:w-64 h-[350px] sm:h-[390px] rounded-2xl overflow-hidden shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 group/card relative select-none bg-neutral-900 border border-neutral-800/90 hover:border-cyan-500/40"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />

              {/* Bottom Vignette for Caption Legibility */}
              <div className="absolute inset-x-0 bottom-0 h-36 sm:h-40 bg-gradient-to-t from-[#06080F] via-[#06080F]/80 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-4 text-white space-y-1.5 z-10">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] uppercase tracking-wider font-semibold font-mono">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-300/90 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered CTA (Same as Community Creations) */}
      <div className="relative z-10 mt-6 sm:mt-8 flex flex-col items-center justify-center gap-2">
        <Link
          to="/dashboard/image-editor"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Explore Image Editing
        </Link>
        <span className="text-xs text-neutral-400 font-medium">
          Interactive Editor Preview &bull; Connected to self-hosted open-weight diffusion
        </span>
      </div>
    </section>
  )
}

export default ImageEditingSection
