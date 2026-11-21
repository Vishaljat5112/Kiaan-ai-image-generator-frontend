import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  RefreshCw,
  Download,
  Copy,
  Check,
  Maximize2,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Clock,
  Coins,
  AlertTriangle,
  X
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import { cn } from '../../utils/cn'
import { formatDateTime } from '../../utils/format'

// Curated photorealistic prompts for creative exploration
const PROMPT_INSPIRATIONS = [
  'A beautiful mountain lake at sunrise, realistic landscape photography, natural lighting, detailed reflections.',
  'A cozy modern living room with sunlight through large windows, professional interior photography.',
  'A white kitten sitting in a garden, soft morning sunlight, realistic fur details.',
  'A bustling Indian street market during golden hour, candid documentary photography.',
  'A luxury sports car parked on a mountain road, photorealistic automotive photography.',
  'A tropical beach with crystal-clear water, natural daylight, realistic travel photography.',
  'A chef preparing fresh food in a modern restaurant kitchen, professional food photography.',
  'A snow-covered mountain village at dawn, realistic architectural and landscape photography.'
]

// Available AI Generation Models
const AI_MODELS = [
  {
    id: 'flux-2-klein-4b',
    name: 'FLUX.2 Klein 4B',
    badge: 'Fastest (~1.1s)',
    badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    description: 'Sub-second rectified flow matching transformer. Best for photorealism and general concepts.',
    creditCost: 1,
    defaultSteps: 4,
    recommendedCfg: 3.5
  },
  {
    id: 'z-image-turbo',
    name: 'Z-Image Turbo',
    badge: 'Pro Detail (~2.2s)',
    badgeColor: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    description: 'Bilingual typography engine and S3-DiT photorealism with intricate text rendering.',
    creditCost: 1,
    defaultSteps: 8,
    recommendedCfg: 5.0
  },
  {
    id: 'flux-1-schnell',
    name: 'FLUX.1 Schnell',
    badge: 'Ultra Fast',
    badgeColor: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    description: 'Apache 2.0 4-step distilled latent model optimized for instant concept thumbnailing.',
    creditCost: 1,
    defaultSteps: 4,
    recommendedCfg: 2.5
  }
]

// Aspect Ratio Configurations
const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', width: 1024, height: 1024, icon: Square, desc: 'Social feed & avatar' },
  { id: '16:9', label: '16:9 Landscape', width: 1344, height: 768, icon: RectangleHorizontal, desc: 'Cinema & desktop' },
  { id: '9:16', label: '9:16 Portrait', width: 768, height: 1344, icon: RectangleVertical, desc: 'Stories & Reels' },
  { id: '4:3', label: '4:3 Classic', width: 1152, height: 864, icon: RectangleHorizontal, desc: 'Editorial print' },
  { id: '21:9', label: '21:9 Ultra-wide', width: 1536, height: 640, icon: RectangleHorizontal, desc: 'Cinematic banner' }
]

// Canvas preview dimensions per aspect ratio (Real-Time Canvas is the master height driver)
const CANVAS_PREVIEW_CONFIG = {
  '21:9': { previewHeight: 220, containerClass: 'aspect-[21/9] h-[220px] max-w-full' },
  '16:9': { previewHeight: 280, containerClass: 'aspect-video h-[280px] max-w-full' },
  '4:3': { previewHeight: 330, containerClass: 'aspect-[4/3] h-[330px] max-w-full' },
  '1:1': { previewHeight: 370, containerClass: 'aspect-square h-[370px] max-w-full' },
  '9:16': { previewHeight: 440, containerClass: 'aspect-[9/16] h-[440px] max-w-full' }
}

export function ImageGeneratorPage() {
  const { user, setUser } = useAuth()

  // Form State
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [showNegative, setShowNegative] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id)
  const [aspectRatio, setAspectRatio] = useState('1:1')

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStepText, setGenerationStepText] = useState('')
  const [generationError, setGenerationError] = useState(null)
  const [generatedResults, setGeneratedResults] = useState([])
  const [historyGallery, setHistoryGallery] = useState([])
  const [loadingRecent, setLoadingRecent] = useState(true)

  // Layout references for Master-Follower equal-height synchronization
  const canvasCardRef = useRef(null)
  const promptCardRef = useRef(null)
  const promptTopRef = useRef(null)
  const promptBottomRef = useRef(null)
  const presetsHeaderRef = useRef(null)

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 1024
  })

  const [canvasHeight, setCanvasHeight] = useState(() => {
    return (CANVAS_PREVIEW_CONFIG['1:1']?.previewHeight || 370) + 96
  })
  const [visiblePresetsCount, setVisiblePresetsCount] = useState(2)

  // Calculate dynamic presets fitting into available height follower space
  const updatePresetsCount = useCallback(() => {
    if (typeof window === 'undefined') return

    // On narrow/mobile screens, keep preset list compact so cards stack naturally
    if (window.innerWidth < 1024) {
      setVisiblePresetsCount((prev) => (prev !== 2 ? 2 : prev))
      return
    }

    const currentCanvasHeight = canvasCardRef.current?.clientHeight || canvasHeight
    if (!currentCanvasHeight) return

    const topHeight = promptTopRef.current ? promptTopRef.current.offsetHeight : 124
    const bottomHeight = promptBottomRef.current ? promptBottomRef.current.offsetHeight : 28
    const headerHeight = presetsHeaderRef.current ? presetsHeaderRef.current.offsetHeight + 6 : 24
    const cardPadding = 48
    const safetyBuffer = 12

    const usableHeight = currentCanvasHeight - topHeight - bottomHeight - headerHeight - cardPadding - safetyBuffer

    // Each preset button is h-[32px] (32px) + gap-1.5 (6px) = 38px
    // For N items: totalNeeded = 38 * N - 6 => N = Math.floor((usableHeight + 6) / 38)
    const count = Math.max(1, Math.min(PROMPT_INSPIRATIONS.length, Math.floor((usableHeight + 6) / 38)))
    setVisiblePresetsCount((prev) => (prev !== count ? count : prev))
  }, [canvasHeight, showNegative, generationError])

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      if (!desktop) {
        setVisiblePresetsCount(2)
      } else {
        updatePresetsCount()
      }
    }

    window.addEventListener('resize', handleResize)

    const canvasNode = canvasCardRef.current
    if (!canvasNode || typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', handleResize)
    }

    const observer = new ResizeObserver(() => {
      const fullHeight = canvasNode.clientHeight
      if (fullHeight > 0) {
        setCanvasHeight(fullHeight)
      }
      updatePresetsCount()
    })

    observer.observe(canvasNode)

    if (canvasNode.clientHeight > 0) {
      setCanvasHeight(canvasNode.clientHeight)
    }
    updatePresetsCount()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [updatePresetsCount, aspectRatio, generatedResults.length, isGenerating])

  const handleSelectAspectRatio = (ratioId) => {
    setAspectRatio(ratioId)
    if (window.innerWidth >= 1024) {
      const estimatedHeight =
        (CANVAS_PREVIEW_CONFIG[ratioId]?.previewHeight || 370) +
        (generatedResults.length > 0 && !isGenerating ? 122 : 96)
      setCanvasHeight(estimatedHeight)
    }
  }

  // Fetch logged-in user's recent generations from authenticated assets API
  const fetchRecentGenerations = useCallback(async () => {
    try {
      setLoadingRecent(true)
      const res = await api.get('/assets/generations', {
        params: { type: 'image', generationType: 'TEXT_TO_IMAGE', sort: 'newest', limit: 12 }
      })
      const rawList = res.data?.data || []
      const imageItems = rawList
        .filter((item) => {
          if (item.deletedAt) return false
          const isImage = item.type === 'image' || item.mediaType === 'IMAGE'
          const isTextToImage = item.generationType === 'TEXT_TO_IMAGE' || item.jobType === 'TEXT_TO_IMAGE' || item.tool === 'Text-to-Image'
          return isImage && isTextToImage
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((item) => {
          const rawSrc = item.src || item.storagePath || ''
          const imageUrl = rawSrc.startsWith('http') || rawSrc.startsWith('data:')
            ? rawSrc
            : (rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`)

          return {
            id: item.id,
            prompt: item.prompt || 'Generated Image',
            negativePrompt: item.negativePrompt || undefined,
            model: item.model || 'FLUX.2 Klein 4B',
            aspect: item.aspect || '1:1',
            dimensions: item.dimensions || '1024×1024',
            seed: item.seed ? String(item.seed) : '482910385',
            steps: item.steps || 4,
            cfg: item.cfg || 3.5,
            timestamp: formatDateTime(item.createdAt),
            image: imageUrl,
            status: 'COMPLETED'
          }
        })
      setHistoryGallery(imageItems)
    } catch (err) {
      console.error('Failed to load recent generations:', err)
      setHistoryGallery([])
    } finally {
      setLoadingRecent(false)
    }
  }, [])

  useEffect(() => {
    fetchRecentGenerations()
  }, [fetchRecentGenerations])

  // Interactive View Modal
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [copiedNotification, setCopiedNotification] = useState(false)

  // Model object helper
  const currentModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0]
  const currentAspectObj = ASPECT_RATIOS.find(a => a.id === aspectRatio) || ASPECT_RATIOS[0]

  // Handle Model change
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId)
  }

  // Handle Inspiration Click
  const handleApplyInspiration = (item) => {
    setPrompt(item)
  }

  // Prompt Enhancer simulation
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      setPrompt('Majestic ancient castle perched atop a misty alpine peak, ultra-detailed matte painting, dramatic golden hour atmosphere, 8k masterpiece')
      return
    }
    const enhancements = [
      'masterpiece, 8k resolution, highly detailed, photorealistic, cinematic volumetric lighting, 35mm lens, artstation trending',
      'hyper-detailed architectural realism, ray tracing reflections, octane render, soft ambient shadows, pristine 8k',
      'shot on Hasselblad, shallow depth of field, vivid natural color grading, award-winning photography'
    ]
    const chosen = enhancements[Math.floor(Math.random() * enhancements.length)]
    if (!prompt.includes('photorealistic') && !prompt.includes('detailed')) {
      setPrompt(`${prompt.trim()}, ${chosen}`)
    }
  }

  // Handle Generate
  const handleGenerate = async () => {
    setGenerationError(null)
    const finalPrompt = prompt.trim() || PROMPT_INSPIRATIONS[Math.floor(Math.random() * PROMPT_INSPIRATIONS.length)]
    if (!prompt.trim()) {
      setPrompt(finalPrompt)
    }

    setIsGenerating(true)
    setGenerationProgress(10)
    setGenerationStepText('Submitting job to GPU inference queue...')

    const modelSteps = currentModelObj.defaultSteps || 4
    const modelCfg = currentModelObj.recommendedCfg || 3.5
    const modelSampler = 'euler_ancestral'
    const randomSeedVal = Math.floor(Math.random() * 900000000 + 100000000).toString()

    try {
      const res = await api.post('/generation/jobs', {
        type: 'TEXT_TO_IMAGE',
        modelId: currentModelObj.id,
        prompt: finalPrompt,
        negativePrompt: negativePrompt.trim() || undefined,
        parameters: {
          aspect: currentAspectObj.id,
          width: currentAspectObj.width,
          height: currentAspectObj.height,
          steps: modelSteps,
          cfg: modelCfg,
          sampler: modelSampler,
          seed: randomSeedVal
        }
      })

      if (res.data?.success && res.data?.data) {
        const backendJob = res.data.data
        const jobId = backendJob.id

        // Synchronize real credit balance from server after reservation
        try {
          const balRes = await api.get('/credits/balance')
          if (balRes.data?.data && setUser) {
            setUser((prev) => (prev ? { ...prev, creditBalance: balRes.data.data.balance } : prev))
          }
        } catch { }

        setGenerationProgress(20)
        setGenerationStepText(`Job #${jobId.slice(0, 8)} enqueued (Queue pos #${backendJob.queuePosition || 1}) - waiting for AI engine...`)

        const pollInterval = setInterval(async () => {
          try {
            const jobRes = await api.get(`/generation/jobs/${jobId}`)
            const jobData = jobRes.data?.data
            if (!jobData) return

            if (jobData.status === 'PROCESSING') {
              setGenerationProgress((prev) => Math.min(85, Math.max(prev, 50)))
              setGenerationStepText(`AI Engine synthesizing latents on ${currentModelObj.name}...`)
            } else if (jobData.status === 'COMPLETED') {
              clearInterval(pollInterval)

              const asset = jobData.assets?.[0]
              const rawSrc = asset?.src || asset?.storagePath

              if (!asset || !rawSrc) {
                setIsGenerating(false)
                setGenerationStepText('Job completed but no valid asset was returned.')
                alert('AI worker reported completion but no valid asset output was received.')
                return
              }

              setGenerationProgress(100)
              setGenerationStepText('AI Generation completed successfully!')

              const finalImageUrl = rawSrc.startsWith('http') || rawSrc.startsWith('data:')
                ? rawSrc
                : (rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`)

              const newGen = {
                id: asset?.id || jobData.id,
                prompt: finalPrompt,
                negativePrompt: negativePrompt.trim() || undefined,
                model: currentModelObj.name,
                aspect: currentAspectObj.id,
                dimensions: asset?.dimensions || `${currentAspectObj.width}×${currentAspectObj.height}`,
                seed: randomSeedVal,
                steps: modelSteps,
                cfg: modelCfg,
                sampler: modelSampler,
                timestamp: 'Just now',
                image: finalImageUrl,
                status: 'COMPLETED'
              }

              setGeneratedResults([newGen])
              setHistoryGallery((prev) => {
                const combined = [newGen, ...prev.filter((i) => i.id !== newGen.id)]
                return combined.slice(0, 6)
              })
              setIsGenerating(false)

              // Refresh user credit balance
              try {
                const balRes = await api.get('/credits/balance')
                if (balRes.data?.data && setUser) {
                  setUser((prev) => (prev ? { ...prev, creditBalance: balRes.data.data.balance } : prev))
                }
              } catch { }
            } else if (jobData.status === 'FAILED' || jobData.status === 'CANCELED') {
              clearInterval(pollInterval)
              setIsGenerating(false)
              setGenerationProgress(0)

              const isFlagged = /flagged|content moderation|safety/i.test(jobData.errorMessage || '')
              setGenerationStepText(`Generation ${jobData.status.toLowerCase()}: ${jobData.errorMessage || 'AI inference error'}`)

              setGenerationError({
                isFlagged,
                message: jobData.errorMessage || 'AI generation could not complete for this prompt.',
                suggestion: isFlagged
                  ? 'Try describing the scene with different keywords, avoiding specific brand names or sensitive descriptors.'
                  : 'Check your parameters and try again.'
              })

              // Refresh user credit balance after refund
              try {
                const balRes = await api.get('/credits/balance')
                if (balRes.data?.data && setUser) {
                  setUser((prev) => (prev ? { ...prev, creditBalance: balRes.data.data.balance } : prev))
                }
              } catch { }
            }
          } catch (pollErr) {
            console.warn('[AI Poll Warning]', pollErr)
          }
        }, 1200)

        // Safety timeout
        setTimeout(() => {
          clearInterval(pollInterval)
          setIsGenerating((prev) => {
            if (prev) {
              setGenerationStepText('AI job is still queued or processing on the engine. View status under My Generations.')
              return false
            }
            return false
          })
        }, 60000)

        return
      }
    } catch (err) {
      setIsGenerating(false)
      setGenerationProgress(0)
      setGenerationStepText('')

      if (err.response?.status === 402) {
        setGenerationError({
          isFlagged: false,
          message: 'Insufficient credits! Please add credits to your account.',
          suggestion: 'Top up your account or switch to a lower credit cost model.'
        })
        return
      }
      if (err.response?.status === 503) {
        const msg = err.response?.data?.error || 'AI inference service is currently offline. No credits were deducted.'
        setGenerationError({
          isFlagged: false,
          message: msg,
          suggestion: 'The GPU inference cluster is temporarily offline. Please retry in a few moments.'
        })
        return
      }
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Generation request failed.'
      setGenerationError({
        isFlagged: /flagged|safety/i.test(errMsg),
        message: errMsg,
        suggestion: 'Please verify your prompt description and connection.'
      })
    }
  }

  // Copy prompt to clipboard
  const handleCopyPrompt = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Page Header (Eye-friendly Dark Slate Studio Theme) */}
      <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-neutral-800/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Creation Studio
            </span>
            <span className="text-xs text-neutral-500 font-medium">/</span>
            <span className="text-xs text-neutral-400 font-medium truncate">Text-to-Image Interactive Demo</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            Text-to-Image Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Synthesize high-fidelity photorealistic visuals in sub-second inference using FLUX.2 Klein and Z-Image Turbo.
          </p>
        </div>

        {/* Quick balance display & badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#080B14] border border-neutral-800 text-left">
            <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              Available Credits
            </div>
            <div className="text-base font-bold text-white">
              {user?.creditBalance ?? 250} <span className="text-xs font-normal text-neutral-400">cr</span>
            </div>
          </div>
          <div className="hidden sm:block px-3 py-2 rounded-xl bg-[#080B14] border border-neutral-800 text-xs text-neutral-400">
            Cost per image: <strong className="text-white font-semibold">{currentModelObj.creditCost} credit</strong>
          </div>
        </div>
      </div>

      {/* ROW 1: Prompt Description (Follower) + Real-Time Canvas (Master Height Driver) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:items-start items-start">
        {/* Main Prompt Card (Follower: matches Canvas height exactly) */}
        <div
          ref={promptCardRef}
          style={{ height: isDesktop && canvasHeight ? `${canvasHeight}px` : undefined }}
          className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-neutral-800/90 shadow-sm flex flex-col justify-between text-neutral-100 min-h-0 overflow-hidden"
        >
          {/* Top Section */}
          <div ref={promptTopRef} className="space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <label htmlFor="prompt-input" className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                Prompt Description
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Enhance Prompt
              </button>
            </div>

            {/* Generation Error / Safety Filter Banner */}
            {generationError && (
              <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 transition-all ${generationError.isFlagged
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                }`}>
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${generationError.isFlagged ? 'text-amber-400' : 'text-rose-400'}`} />
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {generationError.isFlagged ? 'AI Output Moderation Notice' : 'Generation Error'}
                  </div>
                  <p className="leading-relaxed opacity-90">{generationError.message}</p>
                  {generationError.suggestion && (
                    <p className="text-[11px] text-amber-300 font-medium pt-1">
                      💡 <strong>Suggestion:</strong> {generationError.suggestion}
                    </p>
                  )}
                  <p className="text-[11px] text-emerald-400 font-medium pt-0.5">
                    ✓ Your reserved credits have been fully restored to your account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGenerationError(null)}
                  className="p-1 hover:bg-neutral-800/80 rounded text-neutral-400 hover:text-white transition-colors"
                  title="Dismiss notice"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                id="prompt-input"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see in rich sensory detail (subject, environment, lighting, shot angle, medium, aesthetic mood)..."
                className="w-full rounded-xl p-3 text-sm bg-[#080B14] border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all resize-none"
              />
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="absolute bottom-2.5 right-2.5 text-xs text-neutral-400 hover:text-white bg-neutral-800/90 px-2 py-0.5 rounded border border-neutral-700 shadow-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Middle Section: Dynamic Inspiration Presets */}
          <div className="flex-1 min-h-0 flex flex-col justify-start py-2 overflow-hidden">
            <div
              ref={presetsHeaderRef}
              className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 shrink-0 mb-1.5"
            >
              Inspiration Presets (Click to Load)
            </div>

            <div className="flex flex-col gap-1.5 overflow-hidden">
              {PROMPT_INSPIRATIONS.slice(0, visiblePresetsCount).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyInspiration(preset)}
                  className="text-left text-xs bg-[#080B14] hover:bg-cyan-950/40 text-neutral-300 hover:text-cyan-200 hover:border-cyan-700/60 border border-neutral-800 px-3 py-1.5 rounded-lg transition-all truncate w-full cursor-pointer h-[32px] shrink-0"
                  title={preset}
                >
                  💡 {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section: Toggle Negative Prompt */}
          <div ref={promptBottomRef} className="pt-2 border-t border-neutral-800/80 shrink-0">
            <button
              type="button"
              onClick={() => setShowNegative(!showNegative)}
              className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showNegative ? 'Hide Negative Prompt' : 'Add Negative Prompt (Avoid specific elements)'}
            </button>

            {showNegative && (
              <div className="mt-2">
                <textarea
                  rows={2}
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g. blur, out of focus, distorted anatomy, low quality, oversaturated, watermark, extra limbs..."
                  className="w-full rounded-xl p-2.5 text-xs bg-[#080B14] border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Canvas (Master Height Driver) */}
        <div
          ref={canvasCardRef}
          className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-neutral-800/90 shadow-sm flex flex-col justify-between text-neutral-100 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Real-Time Canvas
            </h2>
            {isGenerating && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-800/60 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                Generating...
              </span>
            )}
          </div>

          {/* Canvas Display with aspect-ratio-driven responsive height */}
          <div
            className={cn(
              'relative w-full rounded-xl overflow-hidden bg-[#080B14] border border-neutral-800 flex items-center justify-center transition-all duration-300 mx-auto my-auto',
              CANVAS_PREVIEW_CONFIG[aspectRatio]?.containerClass || 'aspect-square h-[370px] max-w-full'
            )}
          >
            {isGenerating ? (
              /* Real-time generation progress overlay */
              <div className="absolute inset-0 bg-[#080B14]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Generating Visual Asset</p>
                  <p className="text-xs text-neutral-400 mt-0.5 max-w-xs">{generationStepText}</p>
                </div>
                <div className="w-44 bg-neutral-800 rounded-full h-1.5 overflow-hidden border border-neutral-700">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-cyan-400">{generationProgress}% completed</span>
              </div>
            ) : generatedResults.length > 0 ? (
              /* Most recently synthesized image */
              <div className="group relative w-full h-full flex items-center justify-center bg-[#080B14]">
                <img
                  src={generatedResults[0].image}
                  alt="Synthesized generation"
                  className="max-w-full max-h-full object-contain"
                />
                {/* Hover action overlay */}
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-700">
                      {generatedResults[0].model} • {generatedResults[0].aspect}
                    </span>
                    <button
                      onClick={() => setActiveModalItem(generatedResults[0])}
                      className="p-1.5 bg-neutral-900/80 hover:bg-neutral-800 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Expand view"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-neutral-200 line-clamp-2">
                      "{generatedResults[0].prompt}"
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyPrompt(generatedResults[0].prompt)}
                        leftIcon={copiedNotification ? Check : Copy}
                        className="text-xs bg-neutral-900/90 text-white border-neutral-700 py-1"
                      >
                        {copiedNotification ? 'Copied' : 'Copy Prompt'}
                      </Button>
                      <a
                        href={generatedResults[0].image}
                        download="kiaan-generated.jpg"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Default empty state */
              <div className="text-center p-6 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-400 mx-auto border border-neutral-700/60">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-300">Canvas Ready for Generation</p>
                  <p className="text-[11px] text-neutral-400 max-w-xs mt-0.5">
                    Enter your prompt on the left and click Generate to produce your first asset.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick action buttons below canvas */}
          {generatedResults.length > 0 && !isGenerating && (
            <div className="flex items-center justify-between pt-1 shrink-0">
              <span className="text-xs text-neutral-400">
                Seed: <strong className="font-mono text-white">{generatedResults[0].seed}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(generatedResults[0])}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Inspect Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: AI Inference Model (Left) + Aspect Ratio & Canvas Dimensions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:items-stretch items-start">
        {/* Model Selection Card */}
        <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-neutral-800/90 shadow-sm flex flex-col justify-between text-neutral-100 lg:h-full">
          <div className="flex items-center justify-between mb-2 sm:mb-2.5 shrink-0">
            <label className="text-xs sm:text-sm font-bold text-neutral-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              AI Inference Model
            </label>
            <span className="text-[11px] sm:text-xs text-neutral-400">Commercial Apache 2.0 Weights</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {AI_MODELS.map((model) => {
              const isSelected = selectedModel === model.id
              return (
                <div
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={cn(
                    'h-[108px] sm:h-[112px] p-2 sm:p-2.5 rounded-xl border text-left cursor-pointer transition-all relative flex flex-col justify-between min-w-0',
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 ring-2 ring-cyan-500/20 text-white'
                      : 'border-neutral-800 bg-[#080B14] hover:bg-neutral-800/60 hover:border-neutral-700 text-neutral-300'
                  )}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white leading-tight break-words min-w-0">
                      {model.name}
                    </div>
                    <div className="mt-1 shrink-0">
                      <span className={cn('inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded border leading-none', model.badgeColor)}>
                        {model.badge}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400 shrink-0 min-w-0">
                    <span className="truncate">{model.defaultSteps} steps</span>
                    <span className="font-semibold text-white shrink-0 ml-1">{model.creditCost} credit</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-neutral-800/90 shadow-sm flex flex-col justify-between text-neutral-100 lg:h-full">
          <div className="flex items-center justify-between mb-2 sm:mb-2.5 shrink-0">
            <label className="text-xs sm:text-sm font-bold text-neutral-100 flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              Aspect Ratio & Canvas Dimensions
            </label>
            <span className="text-[11px] sm:text-xs font-mono text-neutral-400">
              {currentAspectObj.width} × {currentAspectObj.height} px
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = aspectRatio === ratio.id
              const IconComponent = ratio.icon
              return (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => handleSelectAspectRatio(ratio.id)}
                  className={cn(
                    'h-[108px] sm:h-[112px] p-1.5 sm:p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer min-w-0',
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-neutral-800 bg-[#080B14] hover:bg-neutral-800 text-neutral-300'
                  )}
                >
                  <IconComponent className={cn('w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0', isSelected ? 'text-cyan-400' : 'text-neutral-500')} />
                  <div className="font-bold text-xs text-white leading-none shrink-0">{ratio.id}</div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-400 leading-tight text-center break-words px-0.5 line-clamp-2">{ratio.desc}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ROW 3: Generate Action Button (Centered, Compact on Desktop, Full-width on Mobile) */}
      <div className="flex justify-center w-full py-1">
        <Button
          variant="gradient"
          size="md"
          onClick={handleGenerate}
          isLoading={isGenerating}
          leftIcon={Sparkles}
          className="w-full sm:w-[240px] h-[46px] justify-center font-bold text-sm sm:text-base shadow-xl shadow-indigo-950/40 hover:shadow-indigo-900/60 transition-all cursor-pointer rounded-xl shrink-0"
        >
          {isGenerating ? 'Synthesizing...' : `Generate (${currentModelObj.creditCost} Credit)`}
        </Button>
      </div>

      {/* ROW 4: Studio Gallery / Recent Generations */}
      <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Generations
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Click any thumbnail to preview, re-use prompt, or inspect metadata.
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded-full">
            {historyGallery.length}
          </span>
        </div>

        {/* Gallery Grid or Empty State */}
        {loadingRecent && historyGallery.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mb-2" />
            <p className="text-xs text-neutral-400">Loading recent generations…</p>
          </div>
        ) : historyGallery.length === 0 ? (
          <div className="py-10 px-4 rounded-xl border border-dashed border-neutral-800 bg-[#080B14]/60 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-2.5">
              <ImageIcon className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-xs font-semibold text-neutral-200">Your recent generations will appear here</p>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-xs">
              Generate an image using the prompt bar above to populate your recent studio gallery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-3.5">
            {historyGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-[#080B14] cursor-pointer hover:border-cyan-500 hover:shadow-cyan-500/10 transition-all flex items-center justify-center p-1"
              >
                <img
                  src={item.image}
                  alt={item.prompt}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Subtle dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white">
                  <p className="text-[10px] font-medium line-clamp-1 text-neutral-200">{item.prompt}</p>
                  <span className="text-[9px] text-cyan-300 font-mono mt-0.5">{item.aspect || '1:1'} • {(item.model || '').split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail / Inspection Modal */}
      {activeModalItem && (
        <Modal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title="Generated Visual Inspection"
          description="Detailed metadata parameters and production export options"
          theme="dark"
          className="max-w-2xl bg-[#0D111C] text-neutral-100 border-neutral-800"
        >
          <div className="space-y-4">
            {/* Image Preview Box */}
            <div className="rounded-xl overflow-hidden border border-neutral-800 bg-[#080B14] flex items-center justify-center max-h-96">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.prompt}
                className="max-h-96 w-auto object-contain"
              />
            </div>

            {/* Prompt Display */}
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span>Generation Prompt</span>
                <button
                  onClick={() => handleCopyPrompt(activeModalItem.prompt)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal"
                >
                  {copiedNotification ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNotification ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                "{activeModalItem.prompt}"
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Model</span>
                <span className="font-semibold text-white">{activeModalItem.model}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Dimensions</span>
                <span className="font-semibold text-white">{activeModalItem.dimensions} ({activeModalItem.aspect})</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Seed</span>
                <span className="font-mono font-semibold text-cyan-300">{activeModalItem.seed}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Steps & CFG</span>
                <span className="font-semibold text-white">{activeModalItem.steps} st / {activeModalItem.cfg} cfg</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPrompt(activeModalItem.prompt)
                  if (activeModalItem.aspect) setAspectRatio(activeModalItem.aspect)
                  setActiveModalItem(null)
                }}
                leftIcon={Wand2}
                className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                Use this Prompt
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveModalItem(null)}
                  className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700"
                >
                  Close
                </Button>
                <a
                  href={activeModalItem.image}
                  download="kiaan-generated.jpg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Image
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ImageGeneratorPage
