import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react'

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
    <section className="py-16 sm:py-24 bg-[#06080F] border-t border-neutral-800/80 scroll-mt-24" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subheading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider text-cyan-400">
            <span>Flexible Self-Hosted Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Creative Plan
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Explore flexible plans designed for different creative needs. Pricing and credit quotas
            represent platform tier fixtures for self-hosted evaluation.
          </p>

          {/* Billing Cycle Selector (Screenshot 7) */}
          <div className="pt-2 inline-flex items-center p-1 rounded-full bg-neutral-900 border border-neutral-800">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
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
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
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
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* 4 Responsive Pricing Cards Grid (Screenshot 7) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isFeatured = plan.featured
            const isDark = plan.theme !== 'light'

            return (
              <div
                key={plan.id}
                className={`rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  isFeatured
                    ? 'bg-[#0D111C] text-white ring-2 ring-pink-500 shadow-2xl shadow-pink-500/20 lg:-translate-y-2'
                    : isDark
                    ? 'bg-[#0B0F19]/90 text-white border border-neutral-800 shadow-lg hover:border-cyan-500/40'
                    : 'bg-[#0B0F19]/90 text-white border border-neutral-800 shadow-lg hover:border-cyan-500/40'
                }`}
              >
                {/* Top Badge for Featured or Enterprise */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md border border-pink-400/40 font-mono">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-extrabold tracking-tight">
                      {plan.name}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="space-y-1 pt-2 border-t border-neutral-200/20">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {plan.previewPrice}
                      </span>
                      <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        / month
                      </span>
                    </div>
                    <p className={`text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {plan.periodNote}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2">
                    <span className={`text-[11px] uppercase tracking-wider font-bold block ${
                      isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}>
                      Included Features
                    </span>
                    <ul className="space-y-2.5 text-xs">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isFeatured ? 'text-pink-400' : 'text-cyan-400'
                          }`} />
                          <span className="text-neutral-300">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-8">
                  <Link
                    to={plan.ctaTo}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold shadow-lg shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98]'
                        : isDark
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 shadow-sm'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 shadow-sm'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Disclaimer Note */}
        <p className="text-center text-xs text-neutral-400 mt-8 font-medium">
          Note: Preview fixture pricing for self-hosted demonstration. Real billing integration active in Phase 8.
        </p>
      </div>
    </section>
  )
}

export default PricingSection

