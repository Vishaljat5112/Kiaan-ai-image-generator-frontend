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
    <section className="py-16 sm:py-24 bg-white border-t border-neutral-100 scroll-mt-24" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subheading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 text-xs font-semibold text-violet-700">
            <span>Flexible Self-Hosted Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Choose Your Creative Plan
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Explore flexible plans designed for different creative needs. Pricing and credit quotas
            represent platform tier fixtures for self-hosted evaluation.
          </p>

          {/* Billing Cycle Selector (Screenshot 7) */}
          <div className="pt-2 inline-flex items-center p-1 rounded-full bg-neutral-100 border border-neutral-200/80">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('quarterly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'quarterly'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
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
                    ? 'bg-neutral-950 text-white ring-2 ring-violet-500 shadow-2xl shadow-violet-500/10 lg:-translate-y-2'
                    : isDark
                    ? 'bg-neutral-900 text-white border border-neutral-800 shadow-lg'
                    : 'bg-white text-neutral-900 border border-neutral-200/90 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Badge for Featured or Enterprise */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-violet-600 text-white shadow-sm border border-violet-400/40">
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
                            isFeatured ? 'text-violet-400' : 'text-emerald-500'
                          }`} />
                          <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
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
                        ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:scale-[1.02] active:scale-[0.98]'
                        : isDark
                        ? 'bg-white hover:bg-neutral-100 text-neutral-950 shadow-sm'
                        : 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm'
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

