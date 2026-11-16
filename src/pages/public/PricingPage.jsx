import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Check, Sparkles, Zap, Shield, Crown, HelpCircle, ArrowRight,
  ChevronDown, ChevronUp, RefreshCw, Layers, Sliders, Cpu, Lock,
  Video, Film, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'

export function PricingPage() {
  const { hash } = useLocation()
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'yearly'
  const [openFaq, setOpenFaq] = useState(0)

  // Smooth scroll to anchor on navigation
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 80)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [hash])

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      tagline: 'Ideal for newcomers taking their first creative steps.',
      badge: 'Always Free Preview',
      badgeColor: 'bg-neutral-900/90 text-neutral-300 border-neutral-700',
      priceMonthly: 0,
      priceYearly: 0,
      credits: '25 initial + 100/mo',
      queuePriority: 'Standard Queue',
      concurrentJobs: 1,
      maxResolution: '1024 × 1024 px',
      videoAccess: 'Draft 480p preview',
      commercialUse: 'Personal non-commercial',
      featured: false,
      ctaText: 'Start Free Trial',
      ctaTo: '/register',
      buttonStyle: 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700',
      features: [
        '25 instant signup welcome credits',
        '100 monthly generation credits',
        'FLUX.2 Klein 4B image generation',
        'Z-Image Turbo typography generation',
        '1 concurrent generation job slot',
        'Standard queue scheduling',
        'Asset gallery & private project folder',
        'Community showcase access'
      ]
    },
    {
      id: 'creator',
      name: 'Creator',
      tagline: 'For independent creators, illustrators and designers.',
      badge: 'Most Popular for Artists',
      badgeColor: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40',
      priceMonthly: 19,
      priceYearly: 15,
      credits: '600 credits / mo',
      queuePriority: 'Priority Level 3',
      concurrentJobs: 2,
      maxResolution: 'Up to 2K (2048px)',
      videoAccess: 'Draft 480p & 720p',
      commercialUse: 'Full commercial license',
      featured: false,
      ctaText: 'Choose Creator',
      ctaTo: '/register',
      buttonStyle: 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700',
      features: [
        '600 monthly generation credits',
        'Expedited GPU queue priority (Level 3)',
        '2 concurrent parallel generation slots',
        'Full commercial generation & monetization rights',
        'High-resolution upscaling up to 2K',
        'Reference Image-to-Image synthesis',
        'Wan 2.1 Video Draft (480p) access',
        'Private project workspaces & history'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Studio',
      tagline: 'Peak velocity and unconstrained visual power for pros.',
      badge: 'Studio Pro • Highest Value',
      badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-400/40',
      priceMonthly: 49,
      priceYearly: 39,
      credits: '2,000 credits / mo',
      queuePriority: 'Highest GPU Priority (Level 5)',
      concurrentJobs: 5,
      maxResolution: 'Full 4K Ultra-HD',
      videoAccess: 'Full Suite (720p & 1080p)',
      commercialUse: 'Full commercial license',
      featured: true,
      ctaText: 'Start Pro Trial',
      ctaTo: '/register',
      buttonStyle: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/25',
      features: [
        '2,000 monthly generation credits',
        'Highest GPU priority allocation (Level 5)',
        '5 concurrent parallel generation slots',
        'Wan 2.2 / 2.1 Video Cinema (720p & 1080p)',
        'Full 4K Ultra-HD native upscaling',
        'Inpainting canvas & neural relighting editor',
        'Multi-aspect ratio framing presets',
        'Fast-track email & community support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Dedicated node cluster routing for studios and agencies.',
      badge: 'Dedicated GPU Fleet',
      badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-500/40',
      priceMonthly: 199,
      priceYearly: 159,
      credits: '10,000 credits / mo',
      queuePriority: 'Dedicated Node Fast-Track',
      concurrentJobs: 20,
      maxResolution: '4K + Raw Tensor Exports',
      videoAccess: 'Unlimited 1080p Cinema',
      commercialUse: 'Enterprise production license',
      featured: false,
      ctaText: 'Contact Enterprise',
      ctaTo: '/contact',
      buttonStyle: 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700',
      features: [
        '10,000 monthly generation credits',
        'Dedicated self-hosted GPU worker routing',
        '20 concurrent parallel generation slots',
        'Multi-seat agency team collaboration',
        'Custom LoRA fine-tuning & weight imports',
        'Private storage VPC integration options',
        '99.9% uptime SLA guarantee',
        '24/7 dedicated support engineer'
      ]
    }
  ]

  const comparisonCategories = [
    {
      category: 'Generation Credits & Tariffs',
      rows: [
        { name: 'Monthly Credits Allowance', free: '100 / mo', creator: '600 / mo', pro: '2,000 / mo', enterprise: '10,000 / mo' },
        { name: 'Initial Welcome Credits', free: '25 credits', creator: '25 credits', pro: '25 credits', enterprise: '100 credits' },
        { name: 'Image Render Tariff (FLUX / Z-Image)', free: '1 credit', creator: '1 credit', pro: '1 credit', enterprise: '1 credit' },
        { name: 'Video Draft Tariff (480p • 5s)', free: '12 credits', creator: '12 credits', pro: '12 credits', enterprise: '12 credits' },
        { name: 'Video Cinema Tariff (720p • 5s)', free: 'Unavailable', creator: '25 credits', pro: '25 credits', enterprise: '25 credits' },
        { name: 'Automatic Refund on GPU Failure', free: true, creator: true, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Compute & Performance Scheduling',
      rows: [
        { name: 'Queue Scheduling Priority', free: 'Standard', creator: 'Priority Level 3', pro: 'High Priority Level 5', enterprise: 'Dedicated Fast-Track' },
        { name: 'Max Concurrent Generation Jobs', free: '1 job', creator: '2 parallel jobs', pro: '5 parallel jobs', enterprise: '20 parallel jobs' },
        { name: 'Estimated Image Dispatch Latency', free: '~3 - 5s', creator: '~1.5 - 2s', pro: '~1.1s (Instant)', enterprise: '< 0.8s (Real-Time)' },
        { name: 'Dedicated Node Worker Routing', free: false, creator: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'Model Catalog & Output Quality',
      rows: [
        { name: 'FLUX.2 Klein 4B Access', free: true, creator: true, pro: true, enterprise: true },
        { name: 'Z-Image Turbo (Typography)', free: true, creator: true, pro: true, enterprise: true },
        { name: 'Wan 2.1 Video Draft (480p)', free: true, creator: true, pro: true, enterprise: true },
        { name: 'Wan 2.2 Video Cinema (720p/1080p)', free: false, creator: false, pro: true, enterprise: true },
        { name: 'Max Image Resolution', free: '1024 × 1024', creator: '2K (2048px)', pro: '4K Ultra-HD', enterprise: '4K + Raw Latents' },
        { name: 'Custom Aspect Ratio Presets (16:9, 9:16, 21:9)', free: true, creator: true, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Studio Workstation & Tooling',
      rows: [
        { name: 'Reference Image-to-Image Studio', free: true, creator: true, pro: true, enterprise: true },
        { name: 'Inpainting & Interactive Brush Canvas', free: false, creator: true, pro: true, enterprise: true },
        { name: 'Neural Relighting & Background Removal', free: false, creator: true, pro: true, enterprise: true },
        { name: 'Project Workspaces & Nested Folders', free: '1 project', creator: '10 projects', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Bulk ZIP Download & Metadata Inspection', free: true, creator: true, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Commercial Rights & Support',
      rows: [
        { name: 'Permissive Commercial Rights', free: 'Non-Commercial', creator: 'Full Commercial', pro: 'Full Commercial', enterprise: 'Enterprise Commercial' },
        { name: 'Zero Prompt Telemetry Guarantee', free: true, creator: true, pro: true, enterprise: true },
        { name: 'Multi-Seat Team Accounts', free: false, creator: false, pro: false, enterprise: true },
        { name: 'Support Channel', free: 'Community', creator: 'Standard Email', pro: 'Priority Email', enterprise: '24/7 Dedicated SLA' }
      ]
    }
  ]

  const topupPacks = [
    {
      name: 'Starter Pack',
      credits: 500,
      price: '$10',
      unitCost: '$0.020 / credit',
      highlight: 'Great for occasional projects',
      equivalent: '~500 images or 41 draft video clips'
    },
    {
      name: 'Creator Pack',
      credits: 2500,
      price: '$40',
      unitCost: '$0.016 / credit',
      bonus: '20% Bonus Included',
      highlight: 'Best for ongoing production',
      equivalent: '~2,500 images or 100 cinema video shots'
    },
    {
      name: 'Studio Powerhouse',
      credits: 10000,
      price: '$120',
      unitCost: '$0.012 / credit',
      bonus: '40% Bonus Included',
      highlight: 'Maximum credit discount',
      equivalent: '~10,000 images or 400 cinema video shots'
    }
  ]

  const faqs = [
    {
      q: 'How do generation credits work?',
      a: 'Credits are our universal platform currency. Text-to-Image and Image-to-Image generations cost 1 credit on FLUX.2 Klein 4B and Z-Image Turbo. 5-second video clips cost 12 credits for Draft 480p and 25 credits for Cinema 720p. You only spend credits when you generate.'
    },
    {
      q: 'What happens if a generation fails or is canceled?',
      a: 'We have an absolute Auto-Refund Guarantee. When you submit a job, credits are reserved atomically. If a GPU worker fails (due to VRAM error, connection glitch, or timeout) or if you cancel a queued job before it starts processing, 100% of reserved credits are instantly restored to your available wallet balance.'
    },
    {
      q: 'Do unused monthly credits roll over?',
      a: 'Subscription credits refresh on each monthly billing cycle to keep capacity allocated. If you need permanent credits that never expire, our Credit Top-Up Packs never expire and remain in your wallet indefinitely.'
    },
    {
      q: 'Can I switch or cancel my plan anytime?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any moment from your Customer Studio Dashboard under Account & Billing. If you cancel, your plan remains active until the end of the current billing cycle.'
    },
    {
      q: 'Are generated visuals licensed for commercial use?',
      a: 'Yes. All paid subscription tiers (Creator, Pro, and Enterprise) grant full commercial usage rights. You can use your generated visuals and videos in client projects, advertisements, social campaigns, merchandise, and broadcasts without royalty obligations.'
    },
    {
      q: 'How does GPU queue priority work?',
      a: 'Our backend dispatch engine prioritizes generation jobs based on tier hierarchy: Enterprise (Fast-Track) > Pro Studio (Level 5) > Creator (Level 3) > Free Trial (Standard). Pro and Enterprise users experience near-instantaneous job claim by available GPU workers.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We support all major credit cards (Visa, Mastercard, American Express), debit cards, and Apple Pay/Google Pay via secure encrypted processing. Enterprise customers can also arrange invoice-based ACH bank transfers.'
    },
    {
      q: 'Can our organization host Kiaan Studio on our private GPU servers?',
      a: 'Yes! Kiaan Studio was specifically architected for sovereign self-hosted deployments. Enterprise customers can deploy the complete stack (React frontend, Node.js API, Prisma/MySQL store, and Python worker daemons) on their own local hardware (e.g. RTX 4090 or A100 rigs) behind their corporate firewall.'
    }
  ]

  return (
    <div className="bg-[#06080F] text-white selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden relative min-h-screen">
      {/* Ambient Cosmic Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[480px] h-[480px] bg-pink-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[180px]" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-neutral-800/80 bg-gradient-to-b from-[#0B0F19]/80 via-[#06080F] to-[#06080F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Transparent, Predictable Billing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Simple Plans for{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 bg-clip-text text-transparent">
                Every Creative Ambition
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Choose the recurring subscription tier that fits your creative rhythm, or scale on demand with non-expiring credit packs. No hidden markups, guaranteed auto-refunds.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-6 flex items-center justify-center">
              <div className="p-1 rounded-full bg-[#0B0F19] border border-neutral-800 flex items-center shadow-lg">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Yearly Billing</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-pink-950/60 border border-pink-500/40 text-pink-300 tracking-wide font-mono">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Jump links */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-neutral-400">
              <a href="#plans" className="hover:text-cyan-400 transition-colors">Plan Cards ↓</a>
              <span>•</span>
              <a href="#comparison" className="hover:text-cyan-400 transition-colors">Full Feature Matrix ↓</a>
              <span>•</span>
              <a href="#topups" className="hover:text-cyan-400 transition-colors">Credit Top-Ups ↓</a>
              <span>•</span>
              <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQs ↓</a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: THE 4 PLAN CARDS (#plans) */}
      <section className="py-16 sm:py-24 border-b border-neutral-800/80 bg-[#06080F] scroll-mt-20" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly
              return (
                <div
                  key={plan.id}
                  className={`rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                    plan.featured
                      ? 'bg-gradient-to-br from-[#0E1322] via-[#141B2D] to-[#0E1322] text-white border-2 border-pink-500 shadow-2xl shadow-pink-500/20 scale-[1.02] z-10'
                      : 'bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] text-white border border-neutral-800 shadow-lg hover:border-cyan-500/40'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30 border border-pink-400/40 font-mono">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      {!plan.featured && (
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border mb-2 font-mono ${plan.badgeColor}`}>
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-xs mt-1 leading-relaxed text-neutral-400">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 pb-6 border-b border-neutral-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white font-mono">
                          ${price}
                        </span>
                        <span className="text-xs font-semibold text-neutral-400">
                          / month
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 font-mono font-medium ${plan.featured ? 'text-pink-300' : 'text-cyan-400'}`}>
                        {billingCycle === 'yearly' && price > 0 ? `Billed annually ($${price * 12}/yr)` : 'Flexible monthly cancellation'}
                      </p>
                    </div>

                    {/* Quick Specs Pill Highlights */}
                    <div className={`p-3.5 rounded-2xl mb-6 space-y-1.5 text-xs ${plan.featured ? 'bg-neutral-900/90 border border-pink-500/30' : 'bg-neutral-900/70 border border-neutral-800'}`}>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Credits:</span>
                        <strong className="font-bold text-white font-mono">{plan.credits}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">GPU Queue:</span>
                        <strong className="font-bold text-white">{plan.queuePriority}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Concurrency:</span>
                        <strong className="font-bold text-white">{plan.concurrentJobs} {plan.concurrentJobs === 1 ? 'job' : 'parallel jobs'}</strong>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <ul className="space-y-2.5 text-xs mb-8">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.featured ? 'text-pink-400' : 'text-cyan-400'}`} />
                          <span className="text-neutral-300">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={plan.ctaTo}
                    className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-center block transition-all shadow-md ${plan.buttonStyle}`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: COMPREHENSIVE FEATURE COMPARISON MATRIX (#comparison) */}
      <section className="py-20 sm:py-28 border-b border-neutral-800/80 bg-[#06080F]/90 scroll-mt-20" id="comparison">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-mono uppercase tracking-wider border border-cyan-500/40">
              <Layers className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Compare Every Plan Specification
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              Transparent, complete breakdown of credits, GPU priority tiers, model capabilities, and commercial licensing across all 4 plans.
            </p>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-[28px] border border-neutral-800 bg-[#0B0F19]/90 shadow-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0D111C] border-b border-neutral-800 text-neutral-300 font-extrabold text-xs">
                  <th className="p-4 sm:p-5 w-1/3">Features & Specifications</th>
                  <th className="p-4 sm:p-5 text-center">Free Trial</th>
                  <th className="p-4 sm:p-5 text-center">Creator ($19)</th>
                  <th className="p-4 sm:p-5 text-center bg-pink-950/40 text-pink-300 border-x border-pink-500/30">Studio Pro ($49)</th>
                  <th className="p-4 sm:p-5 text-center">Enterprise ($199)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {comparisonCategories.map((cat, catIdx) => (
                  <React.Fragment key={catIdx}>
                    <tr className="bg-[#0D111C]/90 border-t border-b border-neutral-800">
                      <td colSpan="5" className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-cyan-400 font-mono">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="p-4 sm:p-5 font-medium text-neutral-200">
                          {row.name}
                        </td>
                        <td className="p-4 sm:p-5 text-center text-neutral-400">
                          {typeof row.free === 'boolean' ? (
                            row.free ? (
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" />
                            ) : (
                              <span className="text-neutral-600 font-bold">—</span>
                            )
                          ) : (
                            row.free
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-center text-neutral-300">
                          {typeof row.creator === 'boolean' ? (
                            row.creator ? (
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" />
                            ) : (
                              <span className="text-neutral-600 font-bold">—</span>
                            )
                          ) : (
                            row.creator
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-center font-semibold text-pink-200 bg-pink-950/20 border-x border-pink-500/20">
                          {typeof row.pro === 'boolean' ? (
                            row.pro ? (
                              <CheckCircle2 className="w-4 h-4 text-pink-400 mx-auto" />
                            ) : (
                              <span className="text-neutral-600 font-bold">—</span>
                            )
                          ) : (
                            row.pro
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-center font-semibold text-neutral-200">
                          {typeof row.enterprise === 'boolean' ? (
                            row.enterprise ? (
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" />
                            ) : (
                              <span className="text-neutral-600 font-bold">—</span>
                            )
                          ) : (
                            row.enterprise
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: NON-EXPIRING CREDIT TOP-UPS (#topups) */}
      <section className="py-20 sm:py-28 border-b border-neutral-800/80 bg-[#06080F] scroll-mt-20" id="topups">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-400 text-xs font-mono uppercase tracking-wider border border-emerald-500/40">
              <Zap className="w-3.5 h-3.5" />
              <span>On-Demand Credit Scaling</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Non-Expiring Credit Top-Up Packs
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              Need extra capacity for an intensive client campaign? Top-up packs never expire and can be used on any image model, canvas tool, or cinematic video render.
            </p>
          </div>

          {/* Topup Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {topupPacks.map((pack) => (
              <div
                key={pack.name}
                className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 shadow-xl space-y-4 relative flex flex-col justify-between hover:border-cyan-500/40 transition-all"
              >
                {pack.bonus && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-950/60 border border-pink-500/40 text-pink-300 font-mono">
                    {pack.bonus}
                  </span>
                )}
                <div>
                  <h4 className="text-xl font-bold text-white">{pack.name}</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white font-mono">{pack.price}</span>
                    <span className="text-xs text-neutral-400 font-medium">one-time payment</span>
                  </div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
                    {pack.credits.toLocaleString()} Credits
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">{pack.unitCost}</p>

                  <div className="pt-4 mt-4 border-t border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                    <p className="font-semibold text-neutral-200">{pack.highlight}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">{pack.equivalent}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard/credits"
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-center block bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors shadow-sm"
                >
                  Purchase in Studio
                </Link>
              </div>
            ))}
          </div>

          {/* Auto-Refund Guarantee Banner */}
          <div className="rounded-[24px] bg-gradient-to-r from-teal-950/50 via-cyan-950/40 to-neutral-900 border border-teal-500/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-lg font-bold text-white">
                100% Zero-Risk Auto-Refund Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We believe you should only pay for completed visuals. If an inference worker experiences a hardware error, network timeout, or CUDA out-of-memory exception, your reserved credits are refunded automatically to your wallet in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: INTERACTIVE ACCORDION FAQS (#faq) */}
      <section className="py-20 sm:py-28 border-b border-neutral-800/80 bg-[#06080F]/90 scroll-mt-20" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-purple-400 text-xs font-mono uppercase tracking-wider border border-purple-500/40">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Pricing & Credit Clarifications
            </h2>
            <p className="text-base text-neutral-300 leading-relaxed">
              Everything you need to know about billing, plan switching, credit consumption, and enterprise options.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#0D111C] border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0B0F19]/90 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.q}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen
                        ? 'bg-cyan-950/60 text-cyan-400 rotate-180 border border-cyan-500/40'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL-TO-ACTION (Cinematic CTA) */}
      <section className="py-20 sm:py-28 bg-[#06080F] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden border border-neutral-800 bg-[#0B0F19] p-8 sm:p-14 text-center shadow-2xl">
            {/* Background Image with Dark Cyberpunk Overlay */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              <img
                src="/images/landing/cta-cinematic-banner.jpg"
                alt="Studio Banner"
                className="w-full h-full object-cover object-center opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/85 to-transparent" />
            </div>

            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-mono uppercase tracking-wider border border-cyan-500/40 mx-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Latency Creative Flow</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Ready to Unleash Your Creative Vision?
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
                Register now for 25 instant welcome credits. No credit card required. Experience sub-second photorealism and cinematic video in your own private studio.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <span>Start Free Trial (25 Credits)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
                >
                  Talk to Sales & Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
