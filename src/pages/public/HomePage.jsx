import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroSection } from '../../components/landing/HeroSection'
import { CreativeShowcaseSection } from '../../components/landing/CreativeShowcaseSection'
import { ImageToImageSection } from '../../components/landing/ImageToImageSection'
import { HowItWorksSection } from '../../components/landing/HowItWorksSection'
import { ImageEditingSection } from '../../components/landing/ImageEditingSection'
import { MarketingVisualsSection } from '../../components/landing/MarketingVisualsSection'
import { PricingSection } from '../../components/landing/PricingSection'
import { CinematicCtaSection } from '../../components/landing/CinematicCtaSection'

/**
 * Kiaan Studio — Public Landing Page (Complete Phase 3B)
 *
 * Full 10-tier responsive landing experience:
 * 1. Navbar & Hero + Interactive Prompt Composer (Screenshot 1)
 * 2. Community Creations / Creative Showcase Marquee Carousel + Centered CTA (Screenshot 2)
 * 3. Generate Images Using A Reference Image (Screenshot 3)
 * 4. How To Make AI Images Instantly — 3 Vertical Interactive Steps (Screenshot 4)
 * 5. Edit, Enhance & Perfect Every Detail — Showcase Carousel (Screenshot 5)
 * 6. Create Visuals That Make an Impression — Marketing Demo (Screenshot 6)
 * 7. Choose Your Creative Plan — 4 Subscription Tiers + Billing Cycle (Screenshot 7)
 * 8. Cinematic CTA Banner — Your Next Great Creation Starts Here (Screenshot 8)
 * 9. Premium Multi-Column Dark Footer with Oversized Brand Wordmark (Screenshot 9, in PublicLayout)
 */
export function HomePage() {
  const { hash } = useLocation()

  // Handle smooth scroll when navigating to anchor hashes
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [hash])

  return (
    <div className="bg-white text-neutral-900 overflow-x-hidden">
      {/* 1. Hero Section + Prompt Composer (Screenshot 1) */}
      <HeroSection />

      {/* 2. Community Creations / Creative Showcase (Screenshot 2) */}
      <CreativeShowcaseSection />

      {/* 3. Image-to-Image Feature Section (Screenshot 3) */}
      <ImageToImageSection />

      {/* 4. How It Works Section (Screenshot 4) */}
      <HowItWorksSection />

      {/* 5. AI Image Editing Showcase (Screenshot 5) */}
      <ImageEditingSection />

      {/* 6. Marketing Visuals Section (Screenshot 6) */}
      <MarketingVisualsSection />

      {/* 7. Subscription Pricing Section (Screenshot 7) */}
      <PricingSection />

      {/* 8. Cinematic CTA Banner (Screenshot 8) */}
      <CinematicCtaSection />
    </div>
  )
}

export default HomePage
