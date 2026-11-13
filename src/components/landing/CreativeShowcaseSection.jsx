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
    <section id="creative-showcase" className="py-16 sm:py-24 bg-white overflow-hidden scroll-mt-24">
      {/* Section Header (Screenshot 2) */}
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight">
          Community Creations
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
          Turn your ideas into images instantly. Just enter a text prompt along with optional reference
          images, select your styles &amp; effects, and watch Kiaan Studio&apos;s Image Generator work its magic.
        </p>
      </div>

      {/* Infinite Horizontal Carousel Strip (Screenshot 2) */}
      <div className="relative w-full group overflow-hidden">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee gap-5 sm:gap-6 px-4">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-56 sm:w-68 h-[380px] sm:h-[430px] rounded-2xl overflow-hidden shrink-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 group/card relative select-none bg-neutral-100 border border-neutral-200/60"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />

              {/* Bottom Gradient Label Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-4 text-white space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider">
                    {item.genre}
                  </span>
                  <span className="text-neutral-300 font-mono text-[10px]">
                    {item.model}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered CTA (Screenshot 2) */}
      <div className="mt-12 sm:mt-14 flex flex-col items-center justify-center gap-2">
        <Link
          to="/dashboard/image-generator"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-base bg-neutral-950 hover:bg-neutral-800 text-white shadow-lg hover:shadow-neutral-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
