import React from 'react'
import { Link } from 'react-router-dom'


export function CreativeShowcaseSection() {
  const showcaseItems = [
    {
      id: 'fantasy',
      image: '/images/landing/gallery-fantasy.jpg',
      title: 'Mystic Waterfall Valley',
      genre: 'Fantasy Landscape',
      model: 'FLUX.2 Klein'
    },
    {
      id: 'motorsport',
      image: '/images/landing/gallery-motorsport.jpg',
      title: 'Speedway Race Drift',
      genre: 'Motorsport 4K',
      model: 'FLUX.2 Klein'
    },
    {
      id: 'motocross',
      image: '/images/landing/gallery-motocross.jpg',
      title: 'Desert Motocross Stunt',
      genre: 'Action Sports',
      model: 'Z-Image Turbo'
    },
    {
      id: 'hooded',
      image: '/images/landing/gallery-hooded.jpg',
      title: 'Dark Cloaked Gathering',
      genre: 'Dark Fantasy',
      model: 'FLUX.2 Klein'
    },
    {
      id: 'dandelion',
      image: '/images/landing/gallery-dandelion.jpg',
      title: 'Golden Hour Portrait',
      genre: 'Cinematic Portrait',
      model: 'FLUX.2 Klein'
    },
    {
      id: 'architecture',
      image: '/images/landing/gallery-architecture.jpg',
      title: 'Modern Organic Villa',
      genre: 'Architecture',
      model: 'Z-Image Turbo'
    },
    {
      id: 'fashion',
      image: '/images/landing/gallery-fashion.jpg',
      title: 'Haute Couture Editorial',
      genre: 'Fashion Concept',
      model: 'FLUX.2 Klein'
    },
    {
      id: 'product',
      image: '/images/landing/gallery-product.jpg',
      title: 'Smartwatch Studio Shot',
      genre: 'Commercial Product',
      model: 'Z-Image Turbo'
    }
  ]

  // Duplicate for seamless infinite loop in marquee
  const loopItems = [...showcaseItems, ...showcaseItems]

  return (
    <section id="creative-showcase" className="py-8 sm:py-10 lg:py-12 bg-[#06080F] overflow-hidden scroll-mt-20 border-t border-neutral-800/80">
      {/* Section Header (Screenshot 2) */}
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Community Creations
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
          Turn your ideas into images instantly. Just enter a text prompt along with optional reference
          images, select your styles &amp; effects, and watch Kiaan Studio&apos;s Image Generator work its magic.
        </p>
      </div>

      {/* Infinite Horizontal Carousel Strip (Screenshot 2) */}
      <div className="relative w-full group overflow-hidden">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-14 sm:w-28 bg-gradient-to-r from-[#06080F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-14 sm:w-28 bg-gradient-to-l from-[#06080F] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee gap-5 sm:gap-6 px-4 py-2.5">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-56 sm:w-64 h-[350px] sm:h-[390px] rounded-2xl overflow-hidden shrink-0 shadow-md hover:shadow-xl transition-all duration-300 group/card relative select-none bg-neutral-900 border border-neutral-800/90 hover:border-cyan-500/40"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />

              {/* Bottom Vignette for Caption Legibility — Scoped strictly to bottom 140px, eliminating the horizontal dark strip cutting across card centers */}
              <div className="absolute inset-x-0 bottom-0 h-36 sm:h-40 bg-gradient-to-t from-[#06080F] via-[#06080F]/70 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-4 text-white space-y-1.5 z-10">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] uppercase tracking-wider font-semibold font-mono">
                    {item.genre}
                  </span>
                  <span className="text-neutral-300 font-mono text-[11px]">
                    {item.model}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 drop-shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered CTA (Screenshot 2) */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-2">
        <Link
          to="/dashboard/image-generator"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Generating Images
        </Link>
        <span className="text-xs text-neutral-400 font-medium">
          Creative Showcase &bull; 8 high-fidelity synthesis styles
        </span>
      </div>
    </section>
  )
}

export default CreativeShowcaseSection
