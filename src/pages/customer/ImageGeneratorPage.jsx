import React, { useState, useRef } from 'react'
import {
  Sparkles,
  Wand2,
  Sliders,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Download,
  Copy,
  Check,
  Maximize2,
  Trash2,
  Zap,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  HelpCircle,
  Clock,
  Coins
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

// Curated preset prompts for creative exploration
const PROMPT_INSPIRATIONS = [
  'Hyper-realistic editorial portrait of an astronaut looking at glowing flora on an alien biome, 8k resolution, cinematic volumetric light',
  'Futuristic sleek electric hypercar parked on a neon-lit Tokyo street in heavy rain, puddles reflecting magenta and cyan cyber lighting',
  'Minimalist Scandinavian architectural villa cantilevered over a misty Norwegian fjord, sunset golden hour, photorealistic interior design',
  'Whimsical miniature terrarium floating in outer space inside an ornate blown-glass sphere with lush bonsai and glowing fireflies'
]

// Available AI Generation Models
const AI_MODELS = [
  {
    id: 'flux-2-klein-4b',
    name: 'FLUX.2 Klein 4B',
    badge: 'Fastest (~1.1s)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    description: 'Sub-second rectified flow matching transformer. Best for photorealism and general concepts.',
    creditCost: 1,
    defaultSteps: 4,
    recommendedCfg: 3.5
  },
  {
    id: 'z-image-turbo',
    name: 'Z-Image Turbo',
    badge: 'Pro Detail (~2.2s)',
    badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-300',
    description: 'Bilingual typography engine and S3-DiT photorealism with intricate text rendering.',
    creditCost: 1,
    defaultSteps: 8,
    recommendedCfg: 5.0
  },
  {
    id: 'flux-1-schnell',
    name: 'FLUX.1 Schnell',
    badge: 'Ultra Fast',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-300',
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

// Sample Initial Gallery
const INITIAL_GALLERY = [
  {
    id: 'gen-001',
    prompt: 'Hyper-realistic futuristic architectural villa hovering over a turquoise alpine lake at twilight, glass facade glowing with warm amber lighting',
    model: 'FLUX.2 Klein 4B',
    aspect: '16:9',
    dimensions: '1344×768',
    seed: '482910385',
    steps: 4,
    cfg: 3.5,
    timestamp: 'Just now',
    image: '/images/landing/gallery-architecture.jpg'
  },
  {
    id: 'gen-002',
    prompt: 'Cinematic close-up portrait of an astronaut with intricate golden reflections in the helmet visor, nebula dust in background',
    model: 'FLUX.2 Klein 4B',
    aspect: '1:1',
    dimensions: '1024×1024',
    seed: '918274619',
    steps: 4,
    cfg: 4.0,
    timestamp: '5m ago',
    image: '/images/landing/hero-astronaut.jpg'
  },
  {
    id: 'gen-003',
    prompt: 'Bioluminescent mystical fantasy tree glowing with ethereal cyan and magenta flora in a misty fairy forest',
    model: 'Z-Image Turbo',
    aspect: '9:16',
    dimensions: '768×1344',
    seed: '109283742',
    steps: 8,
    cfg: 5.0,
    timestamp: '18m ago',
    image: '/images/landing/gallery-fantasy.jpg'
  },
  {
    id: 'gen-004',
    prompt: 'High fashion editorial runway portrait in minimalist neutral beige tones, sharp cinematic studio rim lighting',
    model: 'FLUX.2 Klein 4B',
    aspect: '1:1',
    dimensions: '1024×1024',
    seed: '372819401',
    steps: 4,
    cfg: 3.5,
    timestamp: '42m ago',
    image: '/images/landing/gallery-fashion.jpg'
  },
  {
    id: 'gen-005',
    prompt: 'Macro shot of iridescent dew drops suspended on dandelion seeds with sunset bokeh spheres in soft focus',
    model: 'Z-Image Turbo',
    aspect: '4:3',
    dimensions: '1152×864',
    seed: '847291023',
    steps: 8,
    cfg: 5.5,
    timestamp: '1h ago',
    image: '/images/landing/gallery-dandelion.jpg'
  },
  {
    id: 'gen-006',
    prompt: 'Luxury product photography for high-end organic skincare bottle on smooth volcanic wet stone with morning mist',
    model: 'FLUX.2 Klein 4B',
    aspect: '1:1',
    dimensions: '1024×1024',
    seed: '629104857',
    steps: 4,
    cfg: 3.5,
    timestamp: '2h ago',
    image: '/images/landing/gallery-product.jpg'
  }
]

export function ImageGeneratorPage() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  // Form State
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [showNegative, setShowNegative] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [referenceImage, setReferenceImage] = useState(null)
  const [referenceStrength, setReferenceStrength] = useState(0.65)
  const [guidanceScale, setGuidanceScale] = useState(3.5)
  const [steps, setSteps] = useState(4)
  const [seed, setSeed] = useState('')
  const [isRandomSeed, setIsRandomSeed] = useState(true)
  const [sampler, setSampler] = useState('euler_ancestral')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [outputCount, setOutputCount] = useState(1)

  // Generation Simulation State
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStepText, setGenerationStepText] = useState('')
  const [generatedResults, setGeneratedResults] = useState([])
  const [historyGallery, setHistoryGallery] = useState(INITIAL_GALLERY)

  // Interactive View Modal
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [copiedNotification, setCopiedNotification] = useState(false)

  // Model object helper
  const currentModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0]
  const currentAspectObj = ASPECT_RATIOS.find(a => a.id === aspectRatio) || ASPECT_RATIOS[0]

  // Handle Model change
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId)
    const m = AI_MODELS.find(item => item.id === modelId)
    if (m) {
      setSteps(m.defaultSteps)
      setGuidanceScale(m.recommendedCfg)
    }
  }

  // Handle Inspiration Click
  const handleApplyInspiration = (item) => {
    setPrompt(item)
  }

  // Handle Reference Image Upload (Browser FileReader for local dummy preview)
  const handleReferenceUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setReferenceImage({
          name: file.name,
          url: reader.result,
          size: (file.size / 1024).toFixed(1) + ' KB'
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Clear Reference Image
  const handleClearReference = () => {
    setReferenceImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

  // Handle Generate Simulation
  const handleGenerate = () => {
    if (!prompt.trim()) {
      // Pick a random inspiration if empty
      const randomPrompt = PROMPT_INSPIRATIONS[Math.floor(Math.random() * PROMPT_INSPIRATIONS.length)]
      setPrompt(randomPrompt)
    }

    setIsGenerating(true)
    setGenerationProgress(10)
    setGenerationStepText('Submitting job to GPU inference queue...')

    const randomSeedVal = isRandomSeed ? Math.floor(Math.random() * 900000000 + 100000000).toString() : (seed || '42')

    // Timeline simulation
    setTimeout(() => {
      setGenerationProgress(35)
      setGenerationStepText(`Compiling graph on ${currentModelObj.name} with ${steps} rectified steps...`)
    }, 450)

    setTimeout(() => {
      setGenerationProgress(75)
      setGenerationStepText('Synthesizing high-frequency latents & decoding VAE...')
    }, 900)

    setTimeout(() => {
      setGenerationProgress(100)
      setGenerationStepText('Post-processing WebP artifact...')

      // Select image based on aspect or prompt keywords
      const pool = [
        '/images/landing/gallery-architecture.jpg',
        '/images/landing/hero-astronaut.jpg',
        '/images/landing/gallery-fantasy.jpg',
        '/images/landing/gallery-fashion.jpg',
        '/images/landing/gallery-dandelion.jpg',
        '/images/landing/gallery-product.jpg',
        '/images/landing/gallery-motocross.jpg',
        '/images/landing/gallery-motorsport.jpg'
      ]
      const chosenSample = pool[Math.floor(Math.random() * pool.length)]

      const newGen = {
        id: `gen-${Date.now()}`,
        prompt: prompt.trim() || PROMPT_INSPIRATIONS[0],
        negativePrompt: negativePrompt.trim() || undefined,
        model: currentModelObj.name,
        aspect: currentAspectObj.id,
        dimensions: `${currentAspectObj.width}×${currentAspectObj.height}`,
        seed: randomSeedVal,
        steps: steps,
        cfg: guidanceScale,
        sampler: sampler,
        timestamp: 'Just now',
        image: chosenSample,
        refImage: referenceImage ? referenceImage.url : null
      }

      setGeneratedResults([newGen])
      setHistoryGallery(prev => [newGen, ...prev])
      setIsGenerating(false)
    }, 1400)
  }

  // Copy prompt to clipboard
  const handleCopyPrompt = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header (Light Studio Theme) */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              Creation Studio
            </span>
            <span className="text-xs text-neutral-400 font-medium">/</span>
            <span className="text-xs text-neutral-500 font-medium">Text-to-Image Interactive Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Text-to-Image Studio
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Synthesize high-fidelity photorealistic visuals in sub-second inference using FLUX.2 Klein and Z-Image Turbo.
          </p>
        </div>

        {/* Quick balance display & badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-left">
            <div className="text-[11px] font-medium text-neutral-500 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-500" />
              Available Credits
            </div>
            <div className="text-base font-bold text-neutral-900">
              {user?.creditBalance ?? 250} <span className="text-xs font-normal text-neutral-500">cr</span>
            </div>
          </div>
          <div className="hidden sm:block px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
            Cost per image: <strong className="text-neutral-900 font-semibold">{currentModelObj.creditCost} credit</strong>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Control Panel (60%) + Right Interactive Workspace / Results (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Generator Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Prompt Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="prompt-input" className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-600" />
                Prompt Description
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100/80 px-2.5 py-1 rounded-lg border border-violet-200/80 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                Enhance Prompt
              </button>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                id="prompt-input"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see in rich sensory detail (subject, environment, lighting, shot angle, medium, aesthetic mood)..."
                className="w-full rounded-xl p-3.5 text-sm bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
              />
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="absolute bottom-3 right-3 text-xs text-neutral-400 hover:text-neutral-600 bg-white/90 px-2 py-0.5 rounded border border-neutral-200 shadow-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Inspiration Prompt Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Inspiration Presets (Click to Load)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_INSPIRATIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyInspiration(preset)}
                    className="text-left text-xs bg-neutral-100 hover:bg-violet-50 text-neutral-700 hover:text-violet-800 hover:border-violet-300 border border-neutral-200 px-3 py-1.5 rounded-lg transition-all line-clamp-1 max-w-full"
                    title={preset}
                  >
                    💡 {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Negative Prompt */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowNegative(!showNegative)}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
              >
                {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showNegative ? 'Hide Negative Prompt' : 'Add Negative Prompt (Avoid specific elements)'}
              </button>

              {showNegative && (
                <div className="mt-2.5">
                  <textarea
                    rows={2}
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g. blur, out of focus, distorted anatomy, low quality, oversaturated, watermark, extra limbs..."
                    className="w-full rounded-xl p-3 text-xs bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Model Selection Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-600" />
                AI Inference Model
              </label>
              <span className="text-xs text-neutral-500">Commercial Apache 2.0 Weights</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AI_MODELS.map((model) => {
                const isSelected = selectedModel === model.id
                return (
                  <div
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={cn(
                      'p-3.5 rounded-xl border text-left cursor-pointer transition-all relative flex flex-col justify-between',
                      isSelected
                        ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20'
                        : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-neutral-900">{model.name}</span>
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border', model.badgeColor)}>
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 mt-1">
                        {model.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{model.defaultSteps} steps</span>
                      <span className="font-semibold text-neutral-800">{model.creditCost} credit</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Square className="w-4 h-4 text-violet-600" />
                Aspect Ratio & Canvas Dimensions
              </label>
              <span className="text-xs font-mono text-neutral-500">
                {currentAspectObj.width} × {currentAspectObj.height} px
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = aspectRatio === ratio.id
                const IconComponent = ratio.icon
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id)}
                    className={cn(
                      'p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5',
                      isSelected
                        ? 'border-violet-600 bg-violet-50/70 text-violet-950 ring-2 ring-violet-500/20 shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    )}
                  >
                    <IconComponent className={cn('w-5 h-5', isSelected ? 'text-violet-600' : 'text-neutral-400')} />
                    <div className="font-bold text-xs">{ratio.id}</div>
                    <div className="text-[10px] text-neutral-500 leading-tight">{ratio.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reference Image Upload (Optional Multimodal / Control Guidance) */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-600" />
                Reference Image (Optional Image-to-Image / Style Guidance)
              </label>
              {referenceImage && (
                <button
                  type="button"
                  onClick={handleClearReference}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {!referenceImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-violet-400 bg-neutral-50/50 hover:bg-violet-50/20 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleReferenceUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-center justify-center text-neutral-500 group-hover:text-violet-600 group-hover:scale-105 transition-all">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-800">
                    Click or drag & drop reference image
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    PNG, JPG, or WebP up to 15MB. Guides composition and color palette.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <img
                  src={referenceImage.url}
                  alt="Reference uploaded"
                  className="w-16 h-16 object-cover rounded-lg border border-neutral-300"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-900 truncate">{referenceImage.name}</p>
                  <p className="text-[11px] text-neutral-500">{referenceImage.size}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-600">
                      <span>Influence Weight</span>
                      <span className="font-semibold text-neutral-900">{Math.round(referenceStrength * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={referenceStrength}
                      onChange={(e) => setReferenceStrength(parseFloat(e.target.value))}
                      className="w-full accent-violet-600 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Generation Settings Collapsible */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-800">
                <Sliders className="w-4 h-4 text-violet-600" />
                Advanced Generation Settings
                <span className="text-xs font-normal text-neutral-500">(CFG, Seed, Sampler, Steps)</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-6 pt-2 border-t border-neutral-100 space-y-5 bg-neutral-50/30">
                {/* Sliders: CFG & Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Guidance Scale (CFG) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-neutral-700">
                      <span>Guidance Scale (CFG)</span>
                      <span className="font-mono text-violet-700">{guidanceScale.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="12.0"
                      step="0.5"
                      value={guidanceScale}
                      onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                      className="w-full accent-violet-600 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-500">
                      Higher adherence to prompt vs. generative creativity.
                    </p>
                  </div>

                  {/* Inference Steps */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-neutral-700">
                      <span>Inference Steps</span>
                      <span className="font-mono text-violet-700">{steps} steps</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="1"
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      className="w-full accent-violet-600 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-500">
                      FLUX.2 Klein is distilled for 4 steps. Z-Image Turbo excels at 8.
                    </p>
                  </div>
                </div>

                {/* Seed & Sampler */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-neutral-200/60">
                  {/* Seed Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="seed-input" className="text-xs font-semibold text-neutral-700">
                        RNG Seed
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsRandomSeed(!isRandomSeed)}
                        className="text-[11px] text-violet-600 hover:text-violet-700 font-medium"
                      >
                        {isRandomSeed ? '✓ Random Seed' : 'Lock Seed'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="seed-input"
                        type="text"
                        disabled={isRandomSeed}
                        value={isRandomSeed ? 'Randomized per job' : seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="e.g. 849201"
                        className="w-full rounded-xl px-3 py-2 text-xs bg-white border border-neutral-300 text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Sampler Selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="sampler-select" className="text-xs font-semibold text-neutral-700 block">
                      Diffusion Sampler
                    </label>
                    <select
                      id="sampler-select"
                      value={sampler}
                      onChange={(e) => setSampler(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-xs bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                    >
                      <option value="euler_ancestral">Euler Ancestral (Fast Flow)</option>
                      <option value="dpm_2m_karras">DPM++ 2M Karras (High Detail)</option>
                      <option value="ddim">DDIM Deterministic</option>
                      <option value="uni_pc">UniPC Multi-Step</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Bar */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-md flex items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">Model:</span>
              <span className="text-xs font-bold text-neutral-900">{currentModelObj.name}</span>
              <span className="text-neutral-300">|</span>
              <span className="text-xs font-mono text-neutral-600">{currentAspectObj.id}</span>
            </div>

            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={Sparkles}
              className="px-8 shadow-md hover:shadow-lg transition-all"
            >
              {isGenerating ? 'Synthesizing...' : `Generate (${currentModelObj.creditCost} Credit)`}
            </Button>
          </div>
        </div>

        {/* Right Side: Interactive Preview Canvas & Generated Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Generation Preview Area */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-600" />
                Real-Time Canvas
              </h2>
              {isGenerating && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin text-violet-600" />
                  Generating...
                </span>
              )}
            </div>

            {/* Canvas Display */}
            <div
              className={cn(
                'relative w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center transition-all',
                aspectRatio === '1:1' && 'aspect-square',
                aspectRatio === '16:9' && 'aspect-video',
                aspectRatio === '9:16' && 'aspect-[9/16] max-h-[500px]',
                aspectRatio === '4:3' && 'aspect-[4/3]',
                aspectRatio === '21:9' && 'aspect-[21/9]'
              )}
            >
              {isGenerating ? (
                /* Real-time generation progress overlay */
                <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-violet-400 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Generating Visual Asset</p>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs">{generationStepText}</p>
                  </div>
                  <div className="w-48 bg-neutral-800 rounded-full h-2 overflow-hidden border border-neutral-700">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{generationProgress}% completed</span>
                </div>
              ) : generatedResults.length > 0 ? (
                /* Most recently synthesized image */
                <div className="group relative w-full h-full flex items-center justify-center">
                  <img
                    src={generatedResults[0].image}
                    alt="Synthesized generation"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-700">
                        {generatedResults[0].model} • {generatedResults[0].aspect}
                      </span>
                      <button
                        onClick={() => setActiveModalItem(generatedResults[0])}
                        className="p-1.5 bg-neutral-900/80 hover:bg-neutral-800 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
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
                <div className="text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-200/80 flex items-center justify-center text-neutral-500 mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-700">Canvas Ready for Generation</p>
                    <p className="text-[11px] text-neutral-500 max-w-xs mt-0.5">
                      Enter your prompt on the left and click Generate to produce your first asset.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick action buttons below canvas */}
            {generatedResults.length > 0 && !isGenerating && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-500">
                  Seed: <strong className="font-mono text-neutral-800">{generatedResults[0].seed}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(generatedResults[0])}
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Inspect Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Studio Gallery / Recent Generations */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-600" />
                  Recent Sample Results
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Click any thumbnail to preview, re-use prompt, or inspect metadata.
                </p>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                {historyGallery.length}
              </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {historyGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalItem(item)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 cursor-pointer hover:border-violet-500 hover:shadow-md transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle dark gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white">
                    <p className="text-[10px] font-medium line-clamp-1 text-neutral-200">{item.prompt}</p>
                    <span className="text-[9px] text-violet-300 font-mono mt-0.5">{item.aspect} • {item.model.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail / Inspection Modal */}
      {activeModalItem && (
        <Modal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title="Generated Visual Inspection"
          description="Detailed metadata parameters and production export options"
          className="max-w-2xl bg-white text-neutral-900 border-neutral-200"
        >
          <div className="space-y-4">
            {/* Image Preview Box */}
            <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 flex items-center justify-center max-h-96">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.prompt}
                className="max-h-96 w-auto object-contain"
              />
            </div>

            {/* Prompt Display */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>Generation Prompt</span>
                <button
                  onClick={() => handleCopyPrompt(activeModalItem.prompt)}
                  className="text-violet-600 hover:text-violet-700 flex items-center gap-1 font-normal"
                >
                  {copiedNotification ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNotification ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-neutral-800 leading-relaxed">
                "{activeModalItem.prompt}"
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Model</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.model}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Dimensions</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.dimensions} ({activeModalItem.aspect})</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Seed</span>
                <span className="font-mono font-semibold text-neutral-900">{activeModalItem.seed}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Steps & CFG</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.steps} st / {activeModalItem.cfg} cfg</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPrompt(activeModalItem.prompt)
                  if (activeModalItem.aspect) setAspectRatio(activeModalItem.aspect)
                  setActiveModalItem(null)
                }}
                leftIcon={Wand2}
                className="text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              >
                Use this Prompt
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveModalItem(null)}
                  className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-neutral-200"
                >
                  Close
                </Button>
                <a
                  href={activeModalItem.image}
                  download="kiaan-generated.jpg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
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
