import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, Shield, Crown, ArrowRight } from 'lucide-react'

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly', 'quarterly', 'yearly'

  const plans = [
    {
      id: 'free',
      name: 'Free',
      tagline: 'For newcomers taking their first creative steps',
      previewPrice: '$0',
      periodNote: 'Always Free Preview',
      icon: Zap,
      featured: false,
      ctaText: 'Start Free Trial',
      ctaTo: '/register',
      theme: 'light',
      features: [
        '100 monthly generation credits',
        'Standard queue priority',
        'FLUX.2 Klein 4B image synthesis',
        '1024×1024 maximum resolution',
        'Community showcase access',
        'Personal non-commercial license'
      ]
    },
    {
      id: 'creator',
      name: 'Creator',
      tagline: 'For rising creators and digital designers',
      previewPrice: '$29',
      periodNote: billingCycle === 'yearly' ? 'Billed annually' : billingCycle === 'quarterly' ? 'Billed quarterly' : 'Billed monthly',
      icon: Sparkles,
      featured: false,
      ctaText: 'Explore Plan',
      ctaTo: '/register',
      theme: 'dark-navy',
      features: [
        '2,500 monthly generation credits',
        'Expedited GPU queue priority',
        'FLUX.2 Klein + Z-Image Turbo',
        'Up to 2K resolution & upscaling',
        'Reference image-to-image synthesis',
        'Full commercial generation rights',
        'Private project workspaces'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'Peak performance and unlimited creativity for pros',
      badge: 'Studio Pro',
      previewPrice: '$59',
      periodNote: billingCycle === 'yearly' ? 'Billed annually' : billingCycle === 'quarterly' ? 'Billed quarterly' : 'Billed monthly',
      icon: Crown,
      featured: true,
      ctaText: 'Start Free Trial',
      ctaTo: '/register',
      theme: 'highlight-violet',
      features: [
        '8,000 monthly generation credits',
        'Highest GPU priority allocation',
        'Complete model suite including Wan 2.1 Video',
        'Full 4K Ultra-HD synthesis',
        'Generative inpainting & canvas tools',
        'Full commercial production license',
        'Priority community & email support'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      tagline: 'A full production engine for studios and powerhouses',
      badge: 'Enterprise Tier',
      previewPrice: '$199',
      periodNote: billingCycle === 'yearly' ? 'Billed annually' : billingCycle === 'quarterly' ? 'Billed quarterly' : 'Billed monthly',
      icon: Shield,
      featured: false,
      ctaText: 'Contact Sales',
      ctaTo: '/contact',
      theme: 'dark-charcoal',
      features: [
        '30,000 monthly generation credits',
        'Dedicated self-hosted GPU node access',
        'Concurrent parallel generation jobs',
        'Multi-seat studio team collaboration',
        'Custom model weights fine-tuning support',
        'Enterprise SLA & dedicated support engineer'
      ]
    }
  ]

  return (
    <section className="relative py-8 sm:py-10 lg:py-12 bg-[#06080F] border-t border-neutral-800/80 scroll-mt-20 overflow-hidden" id="pricing">
      {/* Top subtle light beam separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent pointer-events-none" />

      {/* Atmospheric background spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subheading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 backdrop-blur-md border border-cyan-400/50 text-xs font-mono uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span>Flexible Self-Hosted Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Choose Your Creative Plan
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Explore flexible plans designed for different creative needs. Pricing and credit quotas
            represent platform tier fixtures for self-hosted evaluation.
          </p>

          {/* Billing Cycle Selector */}
          <div className="pt-1 inline-flex items-center p-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 shadow-md shadow-cyan-500/30 font-bold ring-1 ring-cyan-300/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('quarterly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 shadow-md shadow-cyan-500/30 font-bold ring-1 ring-cyan-300/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 shadow-md shadow-cyan-500/30 font-bold ring-1 ring-cyan-300/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* 4 Responsive Pricing Cards Grid — Compact Proportions */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 items-stretch">
            {plans.map((plan) => {
              const isFeatured = plan.featured

              return (
                <div
                  key={plan.id}
                  className={`rounded-[18px] sm:rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 relative h-full ${
                    isFeatured
                      ? 'bg-gradient-to-b from-[#13172E] via-[#0E1325] to-[#0A0D1A] text-white ring-2 ring-pink-500/70 border border-pink-400/40 shadow-lg shadow-pink-500/15 lg:-translate-y-1.5'
                      : 'bg-[#0B0F19]/90 backdrop-blur-md text-white border border-white/10 shadow-md hover:border-cyan-400/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)]'
                  }`}
                >
                  {/* Top Badge for Featured or Enterprise */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest font-mono shadow-md ${
                          isFeatured
                            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white border border-pink-300/50 shadow-pink-500/40'
                            : 'bg-neutral-900 text-cyan-300 border border-cyan-400/50 shadow-xs'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col space-y-2.5 sm:space-y-3">
                    {/* Card Header */}
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                        {plan.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-neutral-300/80 leading-snug min-h-[26px]">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Pricing Display */}
                    <div className="space-y-0 pt-2 border-t border-white/10">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                          {plan.previewPrice}
                        </span>
                        <span className="text-[11px] font-medium text-neutral-400">
                          / month
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
                        {plan.periodNote}
                      </p>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-1.5 pt-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-bold block text-neutral-400">
                        Included Features
                      </span>
                      <ul className="space-y-1.5 text-[11px] sm:text-xs">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-1.5">
                            <Check
                              className={`w-3 h-3 shrink-0 mt-0.5 ${
                                isFeatured
                                  ? 'text-pink-400 drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]'
                                  : 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]'
                              }`}
                            />
                            <span className="text-neutral-200 leading-tight">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card CTA Button (Pushed cleanly to bottom baseline) */}
                  <div className="pt-3 sm:pt-3.5 mt-auto">
                    <Link
                      to={plan.ctaTo}
                      className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                        isFeatured
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-white/15 hover:border-cyan-400/40 shadow-xs transition-all hover:scale-[1.01]'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* See Full Pricing Table CTA Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-800 text-white border border-white/15 hover:border-pink-500/40 shadow-lg transition-all hover:scale-105"
          >
            <span>See Full Pricing & Comparison Table</span>
            <ArrowRight className="w-4 h-4 text-pink-400" />
          </Link>
        </div>

        {/* Disclaimer Note */}
        <p className="text-center text-xs text-neutral-400 mt-4 font-medium">
          Note: Preview fixture pricing for self-hosted demonstration. Real billing integration active in Phase 8.
        </p>
      </div>
    </section>
  )
}

export default PricingSection

