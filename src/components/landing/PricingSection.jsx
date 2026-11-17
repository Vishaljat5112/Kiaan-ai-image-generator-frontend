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
    <section className="py-8 sm:py-10 lg:py-12 bg-[#06080F] border-t border-neutral-800/80 scroll-mt-20" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subheading */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider text-cyan-400">
            <span>Flexible Self-Hosted Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Creative Plan
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Explore flexible plans designed for different creative needs. Pricing and credit quotas
            represent platform tier fixtures for self-hosted evaluation.
          </p>

          {/* Billing Cycle Selector */}
          <div className="pt-1 inline-flex items-center p-1 rounded-full bg-neutral-900 border border-neutral-800">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold'
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
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold'
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
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* 4 Responsive Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan) => {
            const isFeatured = plan.featured

            return (
              <div
                key={plan.id}
                className={`rounded-[24px] p-5 sm:p-5.5 lg:p-6 flex flex-col justify-between transition-all duration-300 relative h-full ${
                  isFeatured
                    ? 'bg-[#0D1322] text-white ring-2 ring-pink-500/90 border border-pink-500/30 shadow-2xl shadow-pink-500/20 lg:-translate-y-2'
                    : 'bg-[#0B0F19]/90 text-white border border-neutral-800/90 shadow-lg hover:border-cyan-500/40'
                }`}
              >
                {/* Top Badge for Featured or Enterprise */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-3.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-mono shadow-md ${
                        isFeatured
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border border-pink-400/40 shadow-pink-500/25'
                          : 'bg-neutral-900 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col space-y-4 sm:space-y-5">
                  {/* Card Header */}
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-neutral-300/80 leading-relaxed min-h-[38px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="space-y-1 pt-3 border-t border-neutral-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        {plan.previewPrice}
                      </span>
                      <span className="text-xs font-medium text-neutral-400">
                        / month
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-400">
                      {plan.periodNote}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-xs uppercase tracking-wider font-bold block text-neutral-400">
                      Included Features
                    </span>
                    <ul className="space-y-2.5 text-xs sm:text-[13px]">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isFeatured ? 'text-pink-400' : 'text-cyan-400'
                            }`}
                          />
                          <span className="text-neutral-200 leading-snug">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button (Pushed cleanly to bottom baseline) */}
                <div className="pt-6 mt-auto">
                  <Link
                    to={plan.ctaTo}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-1.5 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 shadow-sm'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* See Full Pricing Table CTA Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-md transition-all hover:scale-105"
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

