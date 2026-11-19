import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles, ShieldCheck, Heart, Award, Users, Terminal, Cpu,
  CheckCircle2, ArrowRight, ArrowUpRight, BarChart3, Database,
  Lock, RefreshCw, Zap, Video, Film, Eye, Server, Compass, FileCheck
} from 'lucide-react'

export function AboutPage() {
  const { hash } = useLocation()

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

  const benchmarkMetrics = [
    {
      model: 'FLUX.2 Klein 4B',
      type: 'Text & Img to Image',
      promptAdherence: '92.4%',
      anatomyScore: '94.8%',
      typographyScore: '86.2%',
      latency: '~1.1s (RTX 4090)',
      vram: '12-16 GB',
      license: 'Apache 2.0'
    },
    {
      model: 'Z-Image Turbo',
      type: 'Bilingual Typography DiT',
      promptAdherence: '94.1%',
      anatomyScore: '91.6%',
      typographyScore: '98.2%',
      latency: '~2.2s (RTX 4090)',
      vram: '16 GB',
      license: 'Apache 2.0'
    },
    {
      model: 'Wan 2.1 Video Draft',
      type: '3D Spatio-Temporal Video',
      promptAdherence: '87.5%',
      anatomyScore: '89.0%',
      typographyScore: '78.5%',
      latency: '~28s (RTX 4090)',
      vram: '24 GB',
      license: 'Apache 2.0'
    },
    {
      model: 'Wan 2.2 Video Cinema',
      type: 'Cinematic 3D Video',
      promptAdherence: '91.8%',
      anatomyScore: '93.4%',
      typographyScore: '84.0%',
      latency: '~65s (RTX 4090)',
      vram: '24 GB',
      license: 'Apache 2.0'
    }
  ]

  const hardwareSizing = [
    {
      tier: 'Entry Workstation',
      gpu: 'NVIDIA RTX 3060 / 4070 (12 GB VRAM)',
      throughput: 'FLUX.2 Klein 4B @ ~2.4s • Text-to-Image 1024×1024',
      idealFor: 'Independent creators, solo illustrators, and local prompt experimentation.'
    },
    {
      tier: 'Studio Workstation (Standard)',
      gpu: 'NVIDIA RTX 4090 (24 GB VRAM)',
      throughput: 'FLUX.2 Klein @ ~1.1s • Wan 2.1 Video Draft @ ~28s (81 frames)',
      idealFor: 'Boutique creative agencies, freelance directors, and high-volume digital artists.'
    },
    {
      tier: 'Production Fleet Node',
      gpu: 'NVIDIA A100 SXM4 (80 GB VRAM)',
      throughput: 'Batch-4 FLUX.2 Klein @ ~0.6s/img • Wan 2.2 Cinema 1080p @ ~42s',
      idealFor: 'Commercial production studios, enterprise marketing departments, and real-time APIs.'
    }
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
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>About the Project & Mission</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.15]">
              Democratizing Sovereign <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 bg-clip-text text-transparent">Visual Intelligence</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Kiaan Studio is built on the conviction that generative visual AI belongs to artists and studios—free from closed API meters, arbitrary censorship, and recurring vendor price hikes.
            </p>

            {/* Jump Navigation Pills */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <a
                href="#project"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-cyan-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>The Sovereign Philosophy</span>
              </a>
              <a
                href="#evaluation"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-pink-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5 text-pink-400" />
                <span>Model Evaluation & Benchmarks</span>
              </a>
              <a
                href="#hardware"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-emerald-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hardware Sizing</span>
              </a>
              <a
                href="#technology"
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0B0F19] border border-neutral-800 hover:border-purple-500/60 text-neutral-300 hover:text-white transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Technical Stack</span>
              </a>
            </div>
          </div>

          {/* Core Stats Row */}
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">100%</div>
              <div className="text-xs font-semibold text-white">Open Weights</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400">Apache 2.0 Permissive</div>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-pink-400 font-mono">0 Byte</div>
              <div className="text-xs font-semibold text-white">Prompt Telemetry</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400">Zero Model Retraining</div>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">~1.1s</div>
              <div className="text-xs font-semibold text-white">Sub-Second Latency</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400">4-Step Distilled Flow</div>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">234/234</div>
              <div className="text-xs font-semibold text-white">Verified Test Cases</div>
              <div className="text-[10px] sm:text-[11px] text-neutral-400">100% Automated Audit Pass</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: THE SOVEREIGN AI PHILOSOPHY (#project) */}
      <section className="py-6 sm:py-8 lg:py-10 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="project">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-mono uppercase tracking-wider border border-cyan-500/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The Sovereign Philosophy</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Why Self-Hosted Open Visual AI Is Non-Negotiable
              </h2>

              <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
                For the past three years, creators and digital studios have been subjected to the "Closed API Trap": expensive per-image meters, sudden terms-of-service revisions, opaque prompt filtering, and tech giants quietly scraping artist creations to train successor models.
              </p>

              <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
                Kiaan Studio was engineered as the antidote. By pairing world-class open-weight models (FLUX, Z-Image, and Wan Video) with an enterprise-ready self-hosted control plane, creators enjoy true creative sovereignty.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block">Commercial Monetization Freedom</strong>
                    <span className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed block mt-0.5">
                      Every output generated is 100% yours. Apache 2.0 licensing grants unrestricted commercial rights without licensing royalties or trademark restrictions.
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block">Complete Prompt Secrecy & Privacy</strong>
                    <span className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed block mt-0.5">
                      Your prompts, negative guidance, and uploaded reference images are stored only in your private database tenant. Never logged, inspected, or harvested.
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block">Honest Credit Economics & Auto-Refunds</strong>
                    <span className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed block mt-0.5">
                      Credits are reserved atomically upon job submission and finalized only upon successful asset generation. If any worker experiences CUDA OOM or network error, 100% of credits are refunded automatically.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual showcase card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden bg-neutral-950 shadow-xl border border-neutral-800 relative aspect-[4/3] group">
                <img
                  src="/images/landing/gallery-fantasy.jpg"
                  alt="Kiaan Studio Sovereign Vision"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white space-y-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white uppercase tracking-wider inline-block shadow-sm">
                    Sovereign Visual Arts
                  </span>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white">
                    Built for Creators, Run by Creators
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Synthesized locally on private GPU clusters with zero dependency on proprietary cloud monopolies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: MODEL EVALUATION & QUALITY BENCHMARKS (#evaluation) */}
      <section className="py-6 sm:py-8 lg:py-10 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="evaluation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 sm:mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/40 text-pink-400 text-xs font-mono uppercase tracking-wider border border-pink-500/40">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Model Evaluation & Quality Benchmarks</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rigorous Quality & Latency Benchmarks
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Before deploying any open-weight model to the Kiaan Studio worker fleet, our automated evaluation pipeline stress-tests prompt comprehension, anatomical precision, typography rendering, and temporal consistency.
            </p>
          </div>

          {/* 4 Evaluation Criteria Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7 sm:mb-8">
            <div className="p-4 sm:p-4.5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">Criterion 01</span>
              <h4 className="text-sm sm:text-base font-bold text-white">CLIP-T Prompt Alignment</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Evaluates semantic correlation across complex multi-subject descriptions, lighting, color palettes, and stylistic nuances.
              </p>
            </div>

            <div className="p-4 sm:p-4.5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-pink-400 uppercase tracking-wider block">Criterion 02</span>
              <h4 className="text-sm sm:text-base font-bold text-white">Typography Accuracy</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Measures character-level spelling precision in signboards, book covers, brand packaging, and multi-word phrases.
              </p>
            </div>

            <div className="p-4 sm:p-4.5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Criterion 03</span>
              <h4 className="text-sm sm:text-base font-bold text-white">Anatomical Fidelity</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Assesses facial symmetry, hand and finger articulation, optical perspective, and biological plausibility without uncanny artifacts.
              </p>
            </div>

            <div className="p-4 sm:p-4.5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 shadow-lg space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider block">Criterion 04</span>
              <h4 className="text-sm sm:text-base font-bold text-white">Temporal Optical Coherence</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Applies optical flow vectors across all 81 video frames to ensure motion smoothness and eliminate temporal flickering.
              </p>
            </div>
          </div>

          {/* Benchmark Comparison Table */}
          <div className="rounded-xl border border-neutral-800 bg-[#0B0F19]/90 shadow-xl overflow-x-auto mb-10 sm:mb-12">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0D111C] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Neural Model</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Primary Category</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Prompt Alignment</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Anatomy Precision</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Typography Score</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Inference Latency</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">VRAM Footprint</th>
                  <th className="p-2.5 sm:p-3 whitespace-nowrap">Permissive License</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {benchmarkMetrics.map((row) => (
                  <tr key={row.model} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-2.5 sm:p-3 font-bold text-white whitespace-nowrap">{row.model}</td>
                    <td className="p-2.5 sm:p-3 text-neutral-300 whitespace-nowrap">{row.type}</td>
                    <td className="p-2.5 sm:p-3 font-mono font-bold text-emerald-400 whitespace-nowrap">{row.promptAdherence}</td>
                    <td className="p-2.5 sm:p-3 font-mono font-bold text-cyan-400 whitespace-nowrap">{row.anatomyScore}</td>
                    <td className="p-2.5 sm:p-3 font-mono font-bold text-pink-400 whitespace-nowrap">{row.typographyScore}</td>
                    <td className="p-2.5 sm:p-3 font-mono text-neutral-300 whitespace-nowrap">{row.latency}</td>
                    <td className="p-2.5 sm:p-3 font-mono text-neutral-400 whitespace-nowrap">{row.vram}</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] sm:text-[11px] font-bold">
                        {row.license}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. SECTION 3: HARDWARE SIZING (#hardware) */}
          <div className="scroll-mt-24" id="hardware">
            <div className="max-w-3xl mb-5 sm:mb-6 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Server className="w-3.5 h-3.5" />
                <span>Hardware Sizing & Node Specifications</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Validated Workstation & Cluster GPU Configurations
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Whether deploying on a single local GPU workstation or provisioning an autonomous cloud node pool, here are the validated hardware baselines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {hardwareSizing.map((hw) => (
                <div key={hw.tier} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0B0F19] via-[#0D111C] to-[#0A0D18] border border-neutral-800 shadow-lg space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                      {hw.tier}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {hw.gpu}
                    </h4>
                    <p className="text-xs text-cyan-300 font-mono bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
                      {hw.throughput}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400 pt-2 border-t border-neutral-800 leading-relaxed">
                    {hw.idealFor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: TECHNICAL STACK & ARCHITECTURE (#technology) */}
      <section className="py-6 sm:py-8 lg:py-10 border-b border-neutral-800/80 relative z-10 scroll-mt-24" id="technology">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-5 sm:mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-purple-400 text-xs font-mono uppercase tracking-wider border border-purple-500/40">
              <Cpu className="w-3.5 h-3.5" />
              <span>Full-Stack Engineering Stack</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Modern, Resilient, Production-Ready
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Kiaan Studio is built using proven, scalable enterprise technologies designed for high-concurrency generation workloads, reliable atomic billing, and seamless multi-node fleet clustering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2 shadow-lg">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Frontend Core</span>
              <h4 className="text-sm sm:text-base font-bold text-white">React 19 & Vite 8</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ultra-fast modular single-page architecture with Tailwind CSS styling, responsive canvas brush masking, and robust JWT session management.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2 shadow-lg">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-pink-400 uppercase tracking-wider">Backend Gateway</span>
              <h4 className="text-sm sm:text-base font-bold text-white">Node.js & Express</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                High-throughput REST API with strict request validation, Bcrypt password hashing, HttpOnly cookie security, and pre-shared worker authentication.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2 shadow-lg">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Persistence Layer</span>
              <h4 className="text-sm sm:text-base font-bold text-white">Prisma v5 & MySQL 8</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ACID-compliant relational schema supporting atomic credit reservations, download delivery verification, immutable audit logging, and tenant isolation.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#0D111C] border border-neutral-800 space-y-2 shadow-lg">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">Inference Workers</span>
              <h4 className="text-sm sm:text-base font-bold text-white">PyTorch 2.4 & Diffusers</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Autonomous Python daemons running FlashAttention-2 kernels, 3D spatio-temporal video latents, and automated progress/error telemetry reporting.
              </p>
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
                Ready to Own Your Generative Pipeline?
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Join thousands of creators who have graduated from closed black-box APIs to sovereign visual intelligence.
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
                  to="/features"
                  className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 shadow-sm transition-all"
                >
                  <span>Explore Full Feature Suite</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
