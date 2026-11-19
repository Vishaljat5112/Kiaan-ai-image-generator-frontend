import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles, Cpu, Video, Layers, ShieldCheck, Zap, Sliders, Maximize2,
  Eye, Download, Film, Camera, CheckCircle2, ArrowRight, ChevronRight,
  Server, HardDrive, Terminal, Lock, RefreshCw, BarChart3, Clock,
  Image as ImageIcon, Wand2, Compass, Play, Boxes, Radio, ArrowUpRight
} from 'lucide-react'

export function FeaturesPage() {
  const { hash } = useLocation()
  const [selectedModelTab, setSelectedModelTab] = useState('flux')
  const [selectedVideoPreset, setSelectedVideoPreset] = useState('cinema')
  const [selectedCameraMotion, setSelectedCameraMotion] = useState('pan')

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

  // Model catalog details
  const models = {
    flux: {
      id: 'flux-2-klein-4b',
      name: 'FLUX.2 Klein 4B',
      headline: 'Sub-Second Distilled Rectified Flow Transformer',
      badge: 'Primary Image Engine • Distilled 4-Step',
      badgeColor: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
      description:
        'Engineered for blazing fast inference without sacrificing photorealistic micro-textures. FLUX.2 Klein leverages rectified flow matching to achieve convergence in just 4 sampling steps, delivering 1024×1024 visuals in ~1.1 seconds on standard datacenter or workstation GPUs.',
      image: '/images/landing/hero-astronaut.jpg',
      samplePrompt: 'Cinematic portrait of an astronaut on a distant celestial observatory, neon bioluminescent reflections on visor, hyperrealistic textures, 8k resolution, volumetric lighting',
      specs: [
        { label: 'Architecture', value: 'Rectified Flow DiT' },
        { label: 'Parameters', value: '4.2 Billion' },
        { label: 'Inference Steps', value: '4 Distilled Steps' },
        { label: 'Average Latency', value: '~1.1s (RTX 4090)' },
        { label: 'Max Native Res', value: '1024 × 1024 px' },
        { label: 'Credit Cost', value: '1 Credit / render' },
        { label: 'VRAM Footprint', value: '12 GB - 16 GB' },
        { label: 'Open License', value: 'Apache 2.0 (Commercial)' }
      ],
      capabilities: [
        'Photorealistic portraiture with natural skin porosity and optical bokeh',
        'Complex multi-subject spatial scene composition and lighting consistency',
        'Sub-second turnaround ideal for interactive creative ideation sessions',
        'Full support for Text-to-Image, Image-to-Image, and Inpainting masking'
      ]
    },
    zimage: {
      id: 'z-image-turbo',
      name: 'Z-Image Turbo',
      headline: 'Scalable Diffusion Transformer with Bilingual Typography',
      badge: 'Typography & Micro-Geometry Specialist',
      badgeColor: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40',
      description:
        'Designed specifically for razor-sharp typography, graphic signboards, and intricate architectural geometry. Z-Image Turbo excels in complex lettering without spelling artifacts, making it the premier choice for marketing collateral, brand mockups, and structured concept art.',
      image: '/images/landing/gallery-architecture.jpg',
      samplePrompt: 'Futuristic architectural pavilion with bold illuminated typographic signage reading "KIAAN AI", brutalist concrete textures, glass reflections, dusk golden hour lighting',
      specs: [
        { label: 'Architecture', value: 'Scalable S3-DiT' },
        { label: 'Parameters', value: '6.0 Billion' },
        { label: 'Inference Steps', value: '8 Steps Turbo' },
        { label: 'Average Latency', value: '~2.2s (RTX 4090)' },
        { label: 'Max Native Res', value: '1536 × 1536 px' },
        { label: 'Credit Cost', value: '1 Credit / render' },
        { label: 'VRAM Footprint', value: '16 GB' },
        { label: 'Open License', value: 'Apache 2.0 (Commercial)' }
      ],
      capabilities: [
        'Near-perfect in-image Latin and Asian typography rendering',
        'Crisp architectural edges, fine metallic lines, and product surfaces',
        'Advanced aesthetic guidance adhering strictly to nuanced style descriptors',
        'Multi-lingual prompt comprehension with high fidelity prompt adherence'
      ]
    },
    wan: {
      id: 'wan-2.2-video',
      name: 'Wan 2.2 / 2.1 Video Suite',
      headline: '3D Spatio-Temporal Diffusion for Coherent Cinematic Motion',
      badge: 'Cinematic Video Engine • 81 Frames',
      badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-500/40',
      description:
        'A breakthrough self-hosted 3D spatio-temporal diffusion transformer capable of generating 5.0 seconds of continuous cinematic video. Unlike fragile frame-stitching generators, Wan generates volumetric latent representations ensuring physical motion coherence across all 81 frames.',
      image: '/images/landing/gallery-motorsport.jpg',
      samplePrompt: 'High-speed rally car drifting along a dirt hairpin curve, dynamic dust clouds swirling into the sunset, cinematic low-angle camera tracking shot, 24fps motion blur',
      specs: [
        { label: 'Architecture', value: '3D Spatio-Temporal DiT' },
        { label: 'Parameters', value: '14B (Cinema) / 1.3B (Draft)' },
        { label: 'Frame Count', value: '81 Continuous Frames' },
        { label: 'Duration & FPS', value: '5.0 Seconds @ 16/24 FPS' },
        { label: 'Resolution Tiers', value: '480p, 720p & 1080p' },
        { label: 'Credit Cost', value: '12 - 25 Credits' },
        { label: 'VRAM Footprint', value: '24 GB (Single Node)' },
        { label: 'Open License', value: 'Apache 2.0 (Commercial)' }
      ],
      capabilities: [
        'Natural physics simulation for water ripples, fabric sway, smoke, and dust',
        'Controllable camera trajectories: dynamic pan, tilt, zoom, and drone orbits',
        'Seamless Image-to-Video bringing existing high-resolution stills to life',
        'Temporal consistency eliminating annoying flickering between sequential frames'
      ]
    }
  }

  const activeModel = models[selectedModelTab]

  const videoPresets = {
    draft: {
      title: 'Draft Preview (480p)',
      resolution: '854 × 480',
      aspectRatio: '16:9 Landscape',
      duration: '5.0 seconds',
      frames: '81 frames (16 fps)',
      creditCost: '12 Credits',
      renderTime: '~28s on RTX 4090',
      recommendedFor: 'Rapid scene prototyping, motion checking, and prompt iteration.'
    },
    cinema: {
      title: 'Cinema HD (720p)',
      resolution: '1280 × 720',
      aspectRatio: '16:9 Cinematic',
      duration: '5.0 seconds',
      frames: '81 frames (16 fps)',
      creditCost: '25 Credits',
      renderTime: '~65s on RTX 4090',
      recommendedFor: 'Commercial social ads, title sequences, and cinematic production b-roll.'
    },
    studio: {
      title: 'Studio Ultra (1080p)',
      resolution: '1920 × 1080',
      aspectRatio: '16:9 Full HD',
      duration: '5.0 seconds',
      frames: '120 frames (24 fps)',
      creditCost: '45 Credits (Pro/Ent)',
      renderTime: '~120s on A100 SXM4',
      recommendedFor: 'Broadcast commercial deliverables, theatrical visual effects, and music videos.'
    }
  }

  const cameraMotions = [
    { id: 'pan', name: 'Horizontal Pan', desc: 'Smooth horizontal tracking shot across expansive landscapes or characters.' },
    { id: 'tilt', name: 'Cinematic Tilt', desc: 'Vertical upward or downward camera tilt capturing architectural majesty.' },
    { id: 'zoom', name: 'Dolly Zoom', desc: 'Dramatic depth manipulation preserving focal subject while shifting background.' },
    { id: 'orbit', name: 'Orbital Rotation', desc: '360° circular trajectory showcasing full three-dimensional product geometry.' }
  ]

  const aspectRatios = [
    { ratio: '1:1', name: 'Square', dims: '1024 × 1024', useCase: 'Instagram posts, avatars, product tiles' },
    { ratio: '16:9', name: 'Landscape', dims: '1344 × 768', useCase: 'Cinematic b-roll, hero banners, YouTube' },
    { ratio: '9:16', name: 'Vertical Story', dims: '768 × 1344', useCase: 'TikTok, Reels, mobile fullscreen stories' },
    { ratio: '4:5', name: 'Social Portrait', dims: '896 × 1152', useCase: 'Editorial portraits, feed showcases' },
    { ratio: '21:9', name: 'Ultrawide', dims: '1536 × 640', useCase: 'Anamorphic feature film visuals' }
  ]

  return (
    <div className="bg-[#06080F] text-white selection:bg-pink-500/30 selection:text-pink-200 overflow-x-hidden relative min-h-screen">
      {/* Background Ambient Glows (SYNTHPULSE style matching HomePage) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-12 border-b border-neutral-800/80 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Platform Capabilities & Engine Specs</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.15]">
              Sovereign Generative <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 bg-clip-text text-transparent">Visual Intelligence</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Inspect the state-of-the-art open-weight diffusion models, cinematic 3D video engines, and self-hosted infrastructure powering Kiaan Studio.
            </p>

            {/* Quick-Jump Section Navigator Pills */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <a
                href="#models"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-cyan-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Models Suite</span>
              </a>
              <a
                href="#video-specs"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-pink-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Video className="w-3.5 h-3.5 text-pink-400" />
                <span>AI Video Engine</span>
              </a>
              <a
                href="#creative-tools"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-purple-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Studio Tooling</span>
              </a>
              <a
                href="#architecture"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-emerald-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Platform Architecture</span>
              </a>
            </div>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard/image-generator"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                <span>Launch Studio Generator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Pricing & Credits</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: AI MODEL SUITE (#models) */}
      <section className="py-6 sm:py-8 lg:py-9 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="models">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 sm:mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-mono uppercase tracking-wider border border-cyan-500/40">
              <Cpu className="w-3.5 h-3.5" />
              <span>Section 01 • Neural Models Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              State-of-the-Art Open Model Weights
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Kiaan Studio runs exclusively on permissive Apache 2.0 open-weight foundations. Zero per-prompt vendor markups, zero cloud lock-in, and full commercial usage rights.
            </p>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 p-1 rounded-xl bg-[#0B0F19] border border-neutral-800 max-w-fit shadow-md">
            <button
              onClick={() => setSelectedModelTab('flux')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedModelTab === 'flux'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
            >
              FLUX.2 Klein 4B
            </button>
            <button
              onClick={() => setSelectedModelTab('zimage')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedModelTab === 'zimage'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
            >
              Z-Image Turbo
            </button>
            <button
              onClick={() => setSelectedModelTab('wan')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedModelTab === 'wan'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
            >
              Wan 2.2 / 2.1 Video
            </button>
          </div>

          {/* Active Model Showcase Card */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
              {/* Left Column: Model Specs & Capabilities */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border mb-2 ${activeModel.badgeColor}`}>
                    {activeModel.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {activeModel.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-cyan-400 mt-0.5">
                    {activeModel.headline}
                  </p>
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mt-2">
                    {activeModel.description}
                  </p>
                </div>

                {/* Technical Specifications Grid */}
                <div>
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 font-mono">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {activeModel.specs.map((spec) => (
                      <div key={spec.label} className="p-2 sm:p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between">
                        <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 block">{spec.label}</span>
                        <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block font-mono leading-snug break-words">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Strengths & Capabilities */}
                <div>
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 font-mono">
                    Core Strengths & Use Cases
                  </h4>
                  <ul className="space-y-1.5">
                    {activeModel.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Launch Button */}
                <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <Link
                    to={selectedModelTab === 'wan' ? '/dashboard/video-generator' : '/dashboard/image-generator'}
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Generate with {activeModel.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/about#evaluation"
                    className="px-4 py-2.5 rounded-full text-xs font-semibold border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>View Benchmarks</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Preview & Prompt Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 shadow-xl relative group border border-neutral-800">
                  <img
                    src={activeModel.image}
                    alt={activeModel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-neutral-900/90 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Native 1024×1024 Output</span>
                  </div>
                </div>

                {/* Sample Prompt Container */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B0F19]/90 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Sample Prompt
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500">Seed: 914028</span>
                  </div>
                  <p className="text-xs text-neutral-200 font-mono leading-relaxed bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800">
                    "{activeModel.samplePrompt}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Model Matrix Comparison Table */}
          <div className="mt-7 sm:mt-8">
            <h3 className="text-lg font-bold text-white mb-2.5">
              Side-by-Side Model Comparison
            </h3>
            <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-[#0B0F19]/90 shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0D111C] border-b border-neutral-800 text-neutral-300 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                    <th className="p-2.5 sm:p-3 whitespace-nowrap">Model Name</th>
                    <th className="p-2.5 sm:p-3 whitespace-nowrap">Primary Type</th>
                    <th className="p-2.5 sm:p-3 whitespace-nowrap">Steps / Speed</th>
                    <th className="p-2.5 sm:p-3 whitespace-nowrap">Max Resolution</th>
                    <th className="p-2.5 sm:p-3 whitespace-nowrap">Cost</th>
                    <th className="p-2.5 sm:p-3 whitespace-nowrap">License</th>
                    <th className="p-2.5 sm:p-3">Ideal Production Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-2.5 sm:p-3 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      FLUX.2 Klein 4B
                    </td>
                    <td className="p-2.5 sm:p-3 text-neutral-200 whitespace-nowrap">Text-to-Image / Inpainting</td>
                    <td className="p-2.5 sm:p-3 font-mono font-medium text-cyan-400 whitespace-nowrap">4 steps • ~1.1s</td>
                    <td className="p-2.5 sm:p-3 font-mono text-neutral-200 whitespace-nowrap">1024 × 1024 (4K Upscale)</td>
                    <td className="p-2.5 sm:p-3 font-semibold text-white whitespace-nowrap">1 Credit</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold">Apache 2.0</span></td>
                    <td className="p-2.5 sm:p-3 text-neutral-200">Photorealism, characters, fast iterations</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-2.5 sm:p-3 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Z-Image Turbo
                    </td>
                    <td className="p-2.5 sm:p-3 text-neutral-200 whitespace-nowrap">Bilingual Typography / DiT</td>
                    <td className="p-2.5 sm:p-3 font-mono font-medium text-cyan-400 whitespace-nowrap">8 steps • ~2.2s</td>
                    <td className="p-2.5 sm:p-3 font-mono text-neutral-200 whitespace-nowrap">1536 × 1536</td>
                    <td className="p-2.5 sm:p-3 font-semibold text-white whitespace-nowrap">1 Credit</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold">Apache 2.0</span></td>
                    <td className="p-2.5 sm:p-3 text-neutral-200">Posters, typography, packaging, architecture</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-2.5 sm:p-3 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Wan 2.1 Video Draft
                    </td>
                    <td className="p-2.5 sm:p-3 text-neutral-200 whitespace-nowrap">Text & Image to Video</td>
                    <td className="p-2.5 sm:p-3 font-mono font-medium text-pink-400 whitespace-nowrap">81 frames • ~28s</td>
                    <td className="p-2.5 sm:p-3 font-mono text-neutral-200 whitespace-nowrap">854 × 480 (16fps)</td>
                    <td className="p-2.5 sm:p-3 font-semibold text-white whitespace-nowrap">12 Credits</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold">Apache 2.0</span></td>
                    <td className="p-2.5 sm:p-3 text-neutral-200">Rapid video scene prototyping & draft cuts</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-2.5 sm:p-3 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                      Wan 2.2 Video Cinema
                    </td>
                    <td className="p-2.5 sm:p-3 text-neutral-200 whitespace-nowrap">Cinematic 3D Video</td>
                    <td className="p-2.5 sm:p-3 font-mono font-medium text-pink-400 whitespace-nowrap">81 frames • ~65s</td>
                    <td className="p-2.5 sm:p-3 font-mono text-neutral-200 whitespace-nowrap">1280 × 720 / 1080p</td>
                    <td className="p-2.5 sm:p-3 font-semibold text-white whitespace-nowrap">25 Credits</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap"><span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold">Apache 2.0</span></td>
                    <td className="p-2.5 sm:p-3 text-neutral-200">Production ads, b-roll, broadcast motion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: AI VIDEO SPECS & MOTION ENGINE (#video-specs) */}
      <section className="py-6 sm:py-8 lg:py-9 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="video-specs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 sm:mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/40 text-pink-400 text-xs font-mono uppercase tracking-wider border border-pink-500/40">
              <Film className="w-3.5 h-3.5" />
              <span>Section 02 • AI Video Specifications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              3D Spatio-Temporal Video Synthesis
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Explore the technical video specifications, temporal coherence mechanisms, frame rates, and camera motion controllers powering Kiaan Studio Video.
            </p>
          </div>

          {/* Interactive Resolution Preset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-7 sm:mb-8 items-stretch">
            {Object.entries(videoPresets).map(([key, preset]) => {
              const isSelected = selectedVideoPreset === key
              return (
                <div
                  key={key}
                  onClick={() => setSelectedVideoPreset(key)}
                  className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer relative bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] flex flex-col justify-between h-full ${isSelected
                    ? 'border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                    : 'border-neutral-800 hover:border-neutral-700 shadow-xl'
                    }`}
                >
                  <div>
                    {isSelected && (
                      <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        Active Tier
                      </span>
                    )}
                    <h4 className="text-base font-bold text-white mb-0.5">
                      {preset.title}
                    </h4>
                    <div className="text-xl font-black text-cyan-400 font-mono mb-2">
                      {preset.resolution}
                    </div>
                    <div className="space-y-1.5 text-xs border-t border-neutral-800 pt-2">
                      <div className="flex justify-between text-neutral-400">
                        <span>Temporal Frames:</span>
                        <strong className="text-white font-mono">{preset.frames}</strong>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Clip Duration:</span>
                        <strong className="text-white">{preset.duration}</strong>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Credit Tariff:</span>
                        <strong className="text-pink-400 font-bold">{preset.creditCost}</strong>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Avg Compute Time:</span>
                        <strong className="text-cyan-400 font-mono">{preset.renderTime}</strong>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    {preset.recommendedFor}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Camera Motion Trajectories Showcase */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <div className="lg:col-span-6 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Cinematic Camera Trajectories</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Full 3-Axis Camera Path Control
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Direct synthetic camera motion precisely. Our 3D spatio-temporal conditioning lets you inject explicit translation matrices into the diffusion sampling loop without post-processing warping.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {cameraMotions.map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => setSelectedCameraMotion(cam.id)}
                      className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all cursor-pointer ${selectedCameraMotion === cam.id
                        ? 'border-cyan-500/80 bg-cyan-950/40 text-white font-semibold'
                        : 'border-neutral-800 hover:border-neutral-700 text-neutral-300 bg-neutral-900/60'
                        }`}
                    >
                      <span className="text-xs font-bold block text-white">{cam.name}</span>
                      <span className="text-[11px] text-neutral-400 leading-relaxed block mt-0.5">
                        {cam.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Simulation Mockup Container */}
              <div className="lg:col-span-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-neutral-950 shadow-xl relative border border-neutral-800">
                  <img
                    src="/images/landing/gallery-motorsport.jpg"
                    alt="Video Simulation"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />

                  {/* Playhead overlay */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Wan 2.1 • 1280×720 @ 16fps</span>
                    </div>
                    <span className="font-mono text-neutral-400 text-[11px]">00:03.2 / 00:05.0</span>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: CREATIVE STUDIO TOOLS (#creative-tools) */}
      <section className="py-6 sm:py-8 lg:py-9 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="creative-tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 sm:mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-purple-400 text-xs font-mono uppercase tracking-wider border border-purple-500/40">
              <Layers className="w-3.5 h-3.5" />
              <span>Section 03 • Studio Workstation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              A Complete Professional Visual Suite
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              From initial raw concept prompts to non-destructive canvas inpainting and project organization, everything happens inside an integrated workstation.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-7 sm:mb-8 items-stretch">
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-violet-950/80 border border-violet-800/60 text-violet-400 flex items-center justify-center">
                  <Wand2 className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Text-to-Image</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Hyper-responsive prompt synthesis with negative prompt exclusion, CFG scale precision, and repeatable seed reproducibility.
                </p>
              </div>
              <Link to="/dashboard/image-generator" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 pt-1">
                <span>Launch Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Image-to-Image</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Upload existing reference photos or sketches. Denoising sliders (0.10 to 0.90) preserve composition while reimagining artistic styling.
                </p>
              </div>
              <Link to="/dashboard/image-to-image" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 pt-1">
                <span>Image-to-Image Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-pink-950/80 border border-pink-800/60 text-pink-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Inpainting & Canvas</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Interactive brush masking for seamless object removal, background substitution, face refinement, and non-destructive neural relighting.
                </p>
              </div>
              <Link to="/dashboard/image-editor" className="text-xs font-bold text-pink-400 hover:text-pink-300 inline-flex items-center gap-1 pt-1">
                <span>Open Canvas Editor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-400 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-white">Projects & Gallery</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Organize generated assets by client campaign in dedicated folders. Inspect generation parameters, toggle favorites, and bulk export.
                </p>
              </div>
              <Link to="/dashboard/projects" className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 pt-1">
                <span>Explore Workspaces</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Aspect Ratio Presets Showcase */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-[#0B0F19]/90 border border-neutral-800 shadow-xl" id="aspect-ratios">
            <h3 className="text-lg font-bold text-white mb-1">
              Supported Aspect Ratio Framing
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mb-4">
              One-click framing presets configured with native latent dimensions preventing spatial stretching or distortion.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {aspectRatios.map((item) => (
                <div key={item.ratio} className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black text-cyan-400 font-mono">{item.ratio}</span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                      {item.dims}
                    </span>
                  </div>
                  <strong className="text-xs text-white block">{item.name}</strong>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-relaxed">{item.useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: SOVEREIGN PLATFORM ARCHITECTURE (#architecture) */}
      <section className="py-6 sm:py-8 lg:py-9 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="architecture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 sm:mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Server className="w-3.5 h-3.5" />
              <span>Section 04 • Sovereign Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Sovereignty & Zero Vendor Lock-In
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Unlike cloud services that resell closed third-party APIs with high markups, Kiaan Studio runs on a sovereign full-stack architecture with private GPU dispatch.
            </p>
          </div>

          {/* Full-Stack Architecture Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-7 sm:mb-8 items-stretch">
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-950 border border-violet-800/80 text-violet-400 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Client Tier (React 19)</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Vite 8 SPA with responsive workstation controls, client-side token caching, real-time job progress polling, and image manipulation canvas.
                </p>
              </div>
              <div className="pt-1.5 text-[11px] font-mono text-cyan-400">
                React 19 • Vite • Tailwind • Lucide
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/80 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                  02
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">API Gateway & Auth</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Node.js Express REST API with RS256/HS256 JWT rotation, HttpOnly refresh cookies, atomic credit reservations, and strict RBAC authorization.
                </p>
              </div>
              <div className="pt-1.5 text-[11px] font-mono text-cyan-400">
                Express • JWT • Bcrypt • Sanitization
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/80 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                  03
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Data & State Store</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Relational tenant schema managed via Prisma ORM v5 on MySQL. Guaranteed atomic wallet ledger, download tracking, and audit logging.
                </p>
              </div>
              <div className="pt-1.5 text-[11px] font-mono text-cyan-400">
                Prisma v5 • MySQL 8 • ACID Transactions
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2.5 shadow-lg flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-950 border border-pink-800/80 text-pink-400 flex items-center justify-center font-mono font-bold text-xs">
                  04
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Autonomous GPU Fleet</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Dedicated worker nodes (RTX 4090 / A100 SXM4) polling inference jobs via pre-shared worker auth. Automatic credit refunds on any GPU failure.
                </p>
              </div>
              <div className="pt-1.5 text-[11px] font-mono text-cyan-400">
                PyTorch 2.4 • Diffusers • FlashAttention-2
              </div>
            </div>
          </div>

          {/* Architectural Comparison Matrix */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-[#0B0F19]/90 border border-neutral-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-3 sm:mb-4">
              Why Sovereign Compute Beats Closed API Gateways
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/90 border border-emerald-800/40 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kiaan Studio Sovereign Cluster</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Zero token markups:</strong> Pay only for real GPU compute time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">100% prompt privacy:</strong> Your proprietary prompts are never logged for third-party training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Permanent open weights:</strong> Models never disappear or change arbitrarily overnight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Self-hosted flexibility:</strong> Run locally on private RTX 4090 rigs or in private cloud VPCs</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-neutral-900/90 border border-rose-900/40 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Closed Third-Party SaaS Gateways</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>High recurring subscription markups and arbitrary rate-limit penalties</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>Prompts may be monitored, filtered, or used to fine-tune competitive models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>Vendor lock-in: Prompt syntaxes and image pipelines broken by sudden deprecations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>No capability to deploy behind an enterprise air-gapped firewall</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL-TO-ACTION (Compact Banner) */}
      <section className="py-6 sm:py-8 lg:py-10 bg-[#06080F] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 flex items-center justify-center p-6 sm:p-8 lg:p-9 shadow-2xl border border-neutral-800 group">
            <img
              src="/images/landing/cta-cinematic-banner.jpg"
              alt="Cinematic atmospheric horizon"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/55 pointer-events-none" />

            <div className="relative z-10 max-w-xl text-center space-y-3 sm:space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mx-auto shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kiaan Studio Creative Workstation</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Experience Sovereign Visual AI
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Create an account in 30 seconds and receive 25 welcome credits. Zero credit card required to explore the full studio workstation.
              </p>

              <div className="pt-1.5 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Start Free Trial (25 Credits)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 shadow-sm transition-all"
                >
                  <span>Compare Plans</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesPage
