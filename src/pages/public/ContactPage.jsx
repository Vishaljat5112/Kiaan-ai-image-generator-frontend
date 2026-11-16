import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Building2, Mail, Phone, MessageSquare, ShieldCheck, Zap,
  Cpu, Server, CheckCircle2, ChevronDown, Sparkles, Layers,
  Headphones, Lock, ArrowRight, HelpCircle, AlertCircle, Clock,
  Loader2, RefreshCw, LogIn
} from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const PENDING_INQUIRY_STORAGE_KEY = 'kiaan_pending_contact_inquiry'

export function ContactPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phone: '',
    companySize: '11-50',
    service: 'both',
    monthlyUsage: '25k-100k',
    message: ''
  })

  // Spam protection honeypot
  const [honeypot, setHoneypot] = useState('')

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submittedData, setSubmittedData] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)

  // 1. Restore preserved form data from sessionStorage & prefill user details
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PENDING_INQUIRY_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          // If logged in, prefer current user email & name unless already typed
          fullName: parsed.fullName || user?.fullName || prev.fullName,
          email: parsed.email || user?.email || prev.email
        }))
      } else if (user) {
        // Auto-fill authenticated user's name & email if empty
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || user.fullName || '',
          email: prev.email || user.email || ''
        }))
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, [user])

  // Enterprise benefits list
  const enterpriseBenefits = [
    {
      icon: Cpu,
      title: 'Dedicated GPU Infrastructure',
      description:
        'Access isolated, high-throughput GPU clusters (RTX 4090, A100, L40S) with zero concurrency throttling and sub-second queue dispatch.'
    },
    {
      icon: Layers,
      title: 'Custom AI Workflows',
      description:
        'Deploy bespoke LoRA adapters, domain-specific visual weights, and custom aspect-ratio pipelines tailored to your corporate brand system.'
    },
    {
      icon: Zap,
      title: 'Scalable Image & Video Generation',
      description:
        'Seamless multimodal generation on FLUX.2 Klein 4B, Z-Image Turbo, and Wan 2.2 Cinematic Video with massive parallel job execution.'
    },
    {
      icon: Headphones,
      title: 'Priority Technical Support',
      description:
        'Direct SLA-backed channel with dedicated AI systems architects, fast-track incident triage, and 24/7 mission-critical coverage.'
    },
    {
      icon: ShieldCheck,
      title: 'Custom Pricing & Private Integrations',
      description:
        'High-volume discount tiers, flexible invoice billing, private VPC storage routing, and sovereign on-premises deployment support.'
    }
  ]

  // Enterprise FAQ list
  const enterpriseFaqs = [
    {
      q: 'How does Enterprise pricing compare to standard subscription tiers?',
      a: 'The $199/mo Enterprise tier includes 10,000 monthly credits, 20 parallel job slots, and dedicated worker dispatch. For multi-seat studios and high-volume workloads (>100k generations/month), we structure custom annual agreements with preferential credit tariffs, invoicing terms, and private cluster provisioning.'
    },
    {
      q: 'Can we connect our self-hosted GPU nodes to Kiaan Studio?',
      a: 'Yes! Kiaan Studio was specifically designed for sovereign computing. Enterprise clients can register their own on-premises GPU nodes (such as NVIDIA RTX 4090, A10G, or A100 rigs) via encrypted node worker tokens, ensuring proprietary datasets never leave your private network.'
    },
    {
      q: 'What integration options, APIs, and SDKs are provided?',
      a: 'Enterprise plans include unrestricted access to our REST API suite, real-time WebSocket generation feeds, automated batch queue endpoints, raw tensor latent exports, and private S3-compatible cloud storage connectors.'
    },
    {
      q: 'What deployment assistance and SLAs do enterprise clients receive?',
      a: 'Enterprise agreements include end-to-end deployment consultation, hardware sizing audits, model quantization optimization, and a 99.9% uptime Service Level Agreement backed by 24/7 engineering escalations.'
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) {
      setSubmitError(null)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your project requirements'
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Please provide at least 15 characters describing your needs'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    // 1. Validate fields first
    if (!validateForm()) {
      return
    }

    // 2. Enforce Authentication Requirement
    if (!isAuthenticated || !user) {
      try {
        // Save form data into sessionStorage so customer does not lose their input
        sessionStorage.setItem(PENDING_INQUIRY_STORAGE_KEY, JSON.stringify(formData))
      } catch {
        // Ignore storage errors
      }

      // Redirect to /login with state to return to /contact after login
      navigate('/login', {
        state: {
          redirect: '/contact',
          background: { pathname: '/contact' },
          authMessage: 'Please sign in to submit your enterprise architecture consultation.'
        }
      })
      return
    }

    // 3. User is authenticated -> submit to backend API
    try {
      setSubmitting(true)
      const res = await api.post('/contact/inquiries', {
        ...formData,
        honeypot
      })

      if (res.data?.success) {
        setSubmittedData(res.data.data)
        // Clean up pending storage on successful submission
        try {
          sessionStorage.removeItem(PENDING_INQUIRY_STORAGE_KEY)
        } catch {
          // Ignore
        }
      } else {
        throw new Error(res.data?.error?.message || 'Failed to submit inquiry')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Session expired while on page
        try {
          sessionStorage.setItem(PENDING_INQUIRY_STORAGE_KEY, JSON.stringify(formData))
        } catch {
          // Ignore
        }
        setSubmitError('Your session has expired. Please sign in again to submit your inquiry.')
        navigate('/login', {
          state: {
            redirect: '/contact',
            background: { pathname: '/contact' },
            authMessage: 'Your session expired. Please sign in again to complete your submission.'
          }
        })
      } else {
        const msg =
          err.response?.data?.error?.message ||
          err.message ||
          'Unable to submit consultation request. Please check your network and try again.'
        setSubmitError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      companyName: '',
      phone: '',
      companySize: '11-50',
      service: 'both',
      monthlyUsage: '25k-100k',
      message: ''
    })
    setSubmittedData(null)
    setSubmitError(null)
    setErrors({})
    try {
      sessionStorage.removeItem(PENDING_INQUIRY_STORAGE_KEY)
    } catch {
      // Ignore
    }
  }

  return (
    <div className="bg-[#06080F] text-white selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden relative min-h-screen">
      {/* Ambient Cosmic Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[480px] h-[480px] bg-pink-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[180px]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-neutral-800/80 bg-gradient-to-b from-[#0B0F19]/80 via-[#06080F] to-[#06080F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise AI Solutions & Sovereign Clusters</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Let's Build Something{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Empower your production pipeline with high-throughput image and video generation, dedicated GPU cluster routing, bespoke LoRA weights, and SLA-backed engineering support.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" /> Dedicated GPU Nodes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-pink-400">
                <CheckCircle2 className="w-4 h-4" /> 99.9% Uptime SLA
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <CheckCircle2 className="w-4 h-4" /> Private VPC Deployment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT: FORM + ENTERPRISE BENEFITS */}
      <section className="py-16 sm:py-24 border-b border-neutral-800/80 bg-[#06080F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Enterprise Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 rounded-[28px] bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 p-6 sm:p-10 shadow-2xl relative">
              <div className="mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-purple-400 text-xs font-mono uppercase tracking-wider border border-purple-500/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enterprise Inquiry</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Request an Architecture Consultation
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Fill out the form below to discuss custom model deployments, dedicated GPU nodes, or volume discounts.
                </p>
              </div>

              {submittedData ? (
                /* REAL DATABASE SUCCESS CONFIRMATION STATE */
                <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 via-[#0B0F19] to-[#0D111C] p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center border border-cyan-500/50 shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                      Inquiry Stored In Database • Status: {submittedData.status || 'NEW'}
                    </div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      Consultation Request Confirmed
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      Thank you, <strong className="text-white">{submittedData.fullName}</strong>. Your enterprise consultation request for <strong className="text-white">{submittedData.companyName}</strong> has been stored securely in our system.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-xs font-mono text-neutral-300">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                      <span className="text-neutral-500">Reference ID:</span>
                      <span className="text-cyan-400 font-bold">{submittedData.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Registered Email:</span>
                      <span className="text-white">{submittedData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Organization:</span>
                      <span className="text-white">{submittedData.companyName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Submitted Timestamp:</span>
                      <span className="text-neutral-400">
                        {new Date(submittedData.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs text-neutral-300">
                    <div className="flex items-center gap-2 font-bold text-purple-300">
                      <Clock className="w-4 h-4" />
                      <span>Next Steps & Response Time</span>
                    </div>
                    <p className="leading-relaxed">
                      Our Enterprise Solutions team reviews each technical specification individually. You will receive an architecture brief and calendar invitation at <strong className="text-cyan-400">{submittedData.email}</strong> within 1 business day.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                      to="/features"
                      className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-center shadow-lg shadow-pink-500/25 transition-all"
                    >
                      Explore Model Benchmarks
                    </Link>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-6 py-3 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field (hidden from view for anti-spam) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="website_url">Website</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Submission Error Alert */}
                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-rose-300 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="block font-bold text-rose-200">Submission Notice</strong>
                        <p className="leading-relaxed">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Auth Requirement Notice if not logged in */}
                  {!isAuthenticated && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/60 flex items-center justify-between gap-3 text-xs text-cyan-300">
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Sign-in required to submit consultation requests. Your entered data will be preserved automatically.</span>
                      </span>
                      <Link
                        to="/login"
                        state={{ redirect: '/contact' }}
                        className="underline font-bold text-white hover:text-cyan-200 shrink-0"
                      >
                        Sign In Now
                      </Link>
                    </div>
                  )}

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                        Full Name <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Elena Rostova"
                        className={`w-full px-4 py-3 rounded-xl bg-neutral-900/90 border ${
                          errors.fullName ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-neutral-800'
                        } focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white placeholder-neutral-500 text-sm outline-none transition-all disabled:opacity-50`}
                      />
                      {errors.fullName && (
                        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                        Business Email <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="elena@studio.com"
                        className={`w-full px-4 py-3 rounded-xl bg-neutral-900/90 border ${
                          errors.email ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-neutral-800'
                        } focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white placeholder-neutral-500 text-sm outline-none transition-all disabled:opacity-50`}
                      />
                      {errors.email && (
                        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Company & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                        Company / Agency Name <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Apex Visual FX"
                        className={`w-full px-4 py-3 rounded-xl bg-neutral-900/90 border ${
                          errors.companyName ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-neutral-800'
                        } focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white placeholder-neutral-500 text-sm outline-none transition-all disabled:opacity-50`}
                      />
                      {errors.companyName && (
                        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3" /> {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                        Phone Number <span className="text-neutral-500 text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white placeholder-neutral-500 text-sm outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Row 3: Company Size & Services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                        Company Size
                      </label>
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white text-sm outline-none transition-all cursor-pointer disabled:opacity-50"
                      >
                        <option value="1-10">1 – 10 Team Members</option>
                        <option value="11-50">11 – 50 Team Members</option>
                        <option value="51-200">51 – 200 Enterprise</option>
                        <option value="201-1000">201 – 1,000 Global Org</option>
                        <option value="1000+">1,000+ Multi-Studio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                        Interested Solutions
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white text-sm outline-none transition-all cursor-pointer disabled:opacity-50"
                      >
                        <option value="both">Full Multimodal Suite (Image + Video)</option>
                        <option value="image">AI Image Synthesis (FLUX.2 / Z-Image)</option>
                        <option value="video">Cinematic Video Synthesis (Wan 2.2)</option>
                        <option value="custom">Sovereign On-Premises GPU Cluster</option>
                      </select>
                    </div>
                  </div>

                  {/* Monthly Volume */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Estimated Monthly Generation Volume
                    </label>
                    <select
                      name="monthlyUsage"
                      value={formData.monthlyUsage}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white text-sm outline-none transition-all cursor-pointer disabled:opacity-50"
                    >
                      <option value="<5k">Under 5,000 generations / mo</option>
                      <option value="5k-25k">5,000 – 25,000 generations / mo</option>
                      <option value="25k-100k">25,000 – 100,000 generations / mo</option>
                      <option value="100k+">100,000+ High-Throughput Batch Pipeline</option>
                    </select>
                  </div>

                  {/* Project Requirements / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Project Requirements & Technical Objectives <span className="text-pink-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Describe your production workflow, target resolution, desired GPU latency, or private cloud VPC requirements..."
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-900/90 border ${
                        errors.message ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-neutral-800'
                      } focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 text-white placeholder-neutral-500 text-sm outline-none transition-all resize-y disabled:opacity-50`}
                    />
                    {errors.message && (
                      <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Form Submission Notice */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono pt-1">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Lock className="w-3.5 h-3.5" /> Zero Prompt Telemetry Policy
                    </span>
                    <span>100% NDA Protected</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Submitting Consultation Request...</span>
                      </>
                    ) : !isAuthenticated ? (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Submit Consultation</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        <span>Submit Enterprise Inquiry</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Enterprise Benefits & Verified Contact (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Enterprise Benefits Bento */}
              <div className="rounded-[28px] bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-mono uppercase tracking-wider border border-cyan-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Why Enterprises Choose Kiaan</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight pt-2">
                    Sovereign Performance Without Limits
                  </h3>
                </div>

                <div className="space-y-4">
                  {enterpriseBenefits.map((benefit, idx) => {
                    const Icon = benefit.icon
                    return (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Verified Contact Details Card */}
              <div className="rounded-[28px] bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 p-6 sm:p-8 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Verified Contact & Channels
                </h4>

                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-white">Enterprise Architecture Desk</span>
                      <span className="text-neutral-400 font-mono">support@kiaanstudio.local</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <Headphones className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-white">Customer Support Desk</span>
                      <Link
                        to="/dashboard/support"
                        className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                      >
                        Open Ticket via Customer Studio →
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-white">Sovereign Deployment Model</span>
                      <span className="text-neutral-400">
                        Self-Hosted Private VPC & On-Premises Node Worker Architecture
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/pricing"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-center block bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
                  >
                    View All Standard Pricing Tiers ($0 – $199)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENTERPRISE FAQS SECTION */}
      <section className="py-20 sm:py-28 border-b border-neutral-800/80 bg-[#06080F]/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-purple-400 text-xs font-mono uppercase tracking-wider border border-purple-500/40">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Enterprise Clarifications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Enterprise & Architecture FAQs
            </h2>
            <p className="text-base text-neutral-300 leading-relaxed">
              Common questions regarding our $199 Enterprise plan, cluster integrations, SLA support, and hardware sizing.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {enterpriseFaqs.map((faq, index) => {
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

      {/* 4. CINEMATIC BOTTOM CTA */}
      <section className="py-20 sm:py-28 bg-[#06080F] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden border border-neutral-800 bg-[#0B0F19] p-8 sm:p-14 text-center shadow-2xl">
            {/* Background image overlay */}
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
                <span>Instant Self-Hosted Access</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Not Ready for Enterprise? Start Free Today
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
                Test our high-performance open-weight models with 25 instant welcome credits on the Free Trial tier. No credit card required.
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
                  to="/features"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
                >
                  Explore AI Models & Specs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
