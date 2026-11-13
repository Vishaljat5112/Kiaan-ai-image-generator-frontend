import React, { useState, useRef } from 'react'
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  Sliders,
  RefreshCw,
  Download,
  Copy,
  Check,
  Maximize2,
  Trash2,
  Coins,
  Wand2,
  Layers,
  ChevronDown,
  ChevronUp,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  ArrowRight,
  Split
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

const IMG2IMG_MODELS = [
  {
    id: 'flux-2-klein-4b',
    name: 'FLUX.2 Klein (Flow Match)',
    badge: 'Fast (~1.2s)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    description: 'Rectified flow multimodal model. Excellent structure preservation and prompt adherence.',
    creditCost: 1,
    defaultDenoise: 0.65
  },
  {
    id: 'z-image-turbo',
    name: 'Z-Image Turbo Multi',
    badge: 'Detail (~2.4s)',
    badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-300',
    description: 'S3-DiT with strong stylistic transfer and intricate texture remodeling.',
    creditCost: 1,
    defaultDenoise: 0.75
  },
  {
    id: 'flux-depth-canny',
    name: 'FLUX Depth & Structure',
    badge: 'Structure Lock',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-300',
    description: 'Extracts geometric edge maps for precise retexturing without shape distortion.',
    creditCost: 2,
    defaultDenoise: 0.50
  }
]

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', icon: Square },
  { id: '16:9', label: '16:9 Landscape', icon: RectangleHorizontal },
  { id: '9:16', label: '9:16 Portrait', icon: RectangleVertical },
  { id: '4:3', label: '4:3 Classic', icon: RectangleHorizontal }
]

const SAMPLE_COMPARISONS = [
  {
    id: 'comp-001',
    title: 'Gourmet Burger to Sci-Fi Cyber Patty',
    prompt: 'Transform into a futuristic glowing neon cyberpunk gourmet burger with holographic cheese and laser garnish',
    beforeImage: '/images/landing/img2img-ref-burger.jpg',
    afterImage: '/images/landing/img2img-result-burger.jpg',
    model: 'FLUX.2 Klein (Flow Match)',
    strength: 0.70,
    timestamp: 'Just now'
  },
  {
    id: 'comp-002',
    title: 'Product Packaging Restyling',
    prompt: 'Commercial luxury cosmetic bottle placed on volcanic dark rock with morning water droplets and soft rim lighting',
    beforeImage: '/images/landing/marketing-product-ref.jpg',
    afterImage: '/images/landing/marketing-product-poster.jpg',
    model: 'Z-Image Turbo Multi',
    strength: 0.65,
    timestamp: '15m ago'
  },
  {
    id: 'comp-003',
    title: 'Urban Architecture Restyling',
    prompt: 'Re-imagine contemporary villa as a bioluminescent eco-futuristic treehouse overlooking turquoise waters',
    beforeImage: '/images/landing/gallery-architecture.jpg',
    afterImage: '/images/landing/gallery-fantasy.jpg',
    model: 'FLUX.2 Klein (Flow Match)',
    strength: 0.80,
    timestamp: '1h ago'
  }
]

export function ImageToImagePage() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  // Form State
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [showNegative, setShowNegative] = useState(false)
  const [selectedModel, setSelectedModel] = useState(IMG2IMG_MODELS[0].id)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [transformationStrength, setTransformationStrength] = useState(0.65)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Uploaded Source Image
  const [sourceImage, setSourceImage] = useState({
    name: 'img2img-ref-burger.jpg',
    url: '/images/landing/img2img-ref-burger.jpg',
    size: '1.4 MB'
  })

  // Comparison State
  const [activeResult, setActiveResult] = useState(SAMPLE_COMPARISONS[0])
  const [historyList, setHistoryList] = useState(SAMPLE_COMPARISONS)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStepText, setGenerationStepText] = useState('')

  // Modal State
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [copiedNotification, setCopiedNotification] = useState(false)

  const currentModelObj = IMG2IMG_MODELS.find(m => m.id === selectedModel) || IMG2IMG_MODELS[0]

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSourceImage({
          name: file.name,
          url: reader.result,
          size: (file.size / 1024).toFixed(1) + ' KB'
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setPrompt('Transform into a futuristic glowing neon cyberpunk gourmet burger with holographic garnish')
    }

    setIsGenerating(true)
    setGenerationProgress(15)
    setGenerationStepText('Encoding source image into latent tensor representation...')

    setTimeout(() => {
      setGenerationProgress(45)
      setGenerationStepText(`Injecting noise at ${(transformationStrength * 100).toFixed(0)}% strength and applying ${currentModelObj.name}...`)
    }, 500)

    setTimeout(() => {
      setGenerationProgress(80)
      setGenerationStepText('Synthesizing cross-attention feature map & guided restyling...')
    }, 1000)

    setTimeout(() => {
      setGenerationProgress(100)
      setGenerationStepText('Decoding VAE latents into transformed image...')

      const pool = [
        '/images/landing/img2img-result-burger.jpg',
        '/images/landing/marketing-product-poster.jpg',
        '/images/landing/edit-cyberpunk.jpg',
        '/images/landing/edit-relighting.jpg'
      ]
      const chosen = pool[Math.floor(Math.random() * pool.length)]

      const newComp = {
        id: `comp-${Date.now()}`,
        title: prompt.slice(0, 32) || 'Remixed Variation',
        prompt: prompt.trim() || 'Custom visual restyling',
        beforeImage: sourceImage.url,
        afterImage: chosen,
        model: currentModelObj.name,
        strength: transformationStrength,
        timestamp: 'Just now'
      }

      setActiveResult(newComp)
      setHistoryList(prev => [newComp, ...prev])
      setIsGenerating(false)
      setSliderPosition(50)
    }, 1500)
  }

  const handleCopyPrompt = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header (Light Studio Theme) */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
              <ImageIcon className="w-3.5 h-3.5 text-violet-600" />
              Creation Studio
            </span>
            <span className="text-xs text-neutral-400 font-medium">/</span>
            <span className="text-xs text-neutral-500 font-medium">Image-to-Image Interactive Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Image-to-Image Restyling
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Transform, restyle, and remix source imagery while controlling compositional fidelity with denoising strength.
          </p>
        </div>

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
            Cost per transformation: <strong className="text-neutral-900 font-semibold">{currentModelObj.creditCost} credit</strong>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Reference Image Upload Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-600" />
                Source Reference Image
              </label>
              {sourceImage && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium text-violet-600 hover:text-violet-700"
                >
                  Replace Image
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {sourceImage ? (
              <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <img
                  src={sourceImage.url}
                  alt="Source"
                  className="w-20 h-20 object-cover rounded-lg border border-neutral-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-neutral-900 truncate">{sourceImage.name}</p>
                    <span className="text-[11px] text-neutral-500">{sourceImage.size}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Ready for generative restyling. Select prompt and transformation strength below.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-violet-600 font-medium hover:text-violet-700"
                    >
                      Choose Different Image
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-violet-400 bg-neutral-50/50 hover:bg-violet-50/20 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-center justify-center text-neutral-500">
                  <Upload className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-800">Upload Reference Image</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">PNG, JPG, or WebP up to 25MB.</p>
                </div>
              </div>
            )}
          </div>

          {/* Transformation Prompt Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="img2img-prompt" className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-600" />
                Transformation Prompt
              </label>
              <span className="text-xs text-neutral-500">Guides restyling target</span>
            </div>

            <div className="relative">
              <textarea
                id="img2img-prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how to transform the source image (e.g. Turn into an oil painting, neon cyberpunk aesthetic, watercolor sketch)..."
                className="w-full rounded-xl p-3.5 text-sm bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
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

            {/* Transformation Strength Slider */}
            <div className="p-4 rounded-xl bg-violet-50/40 border border-violet-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-violet-600" />
                  Transformation Strength (Denoise)
                </span>
                <span className="font-mono font-bold text-violet-700 bg-white px-2 py-0.5 rounded border border-violet-200">
                  {Math.round(transformationStrength * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={transformationStrength}
                onChange={(e) => setTransformationStrength(parseFloat(e.target.value))}
                className="w-full accent-violet-600 h-2 bg-neutral-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>0.1 (Subtle Retouch)</span>
                <span>0.65 (Balanced Restyle)</span>
                <span>1.0 (Complete Overhaul)</span>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-600" />
                Restyling Model
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {IMG2IMG_MODELS.map((model) => {
                const isSelected = selectedModel === model.id
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setTransformationStrength(model.defaultDenoise)
                    }}
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
                      </div>
                      <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border inline-block mb-1', model.badgeColor)}>
                        {model.badge}
                      </span>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                        {model.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Denoise: {model.defaultDenoise}</span>
                      <span className="font-semibold text-neutral-800">{model.creditCost} credit</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Square className="w-4 h-4 text-violet-600" />
              Target Output Aspect Ratio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                        ? 'border-violet-600 bg-violet-50 text-violet-950 ring-2 ring-violet-500/20 shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    )}
                  >
                    <IconComponent className={cn('w-4 h-4', isSelected ? 'text-violet-600' : 'text-neutral-400')} />
                    <div className="font-bold text-xs">{ratio.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sticky Generate Bar */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-md flex items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Model:</span>
              <span className="font-bold text-neutral-900">{currentModelObj.name}</span>
              <span className="text-neutral-300">|</span>
              <span className="font-mono text-neutral-600">Denoise: {transformationStrength}</span>
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

        {/* Right Side: Before/After Comparison Slider & Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Comparison Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Split className="w-4 h-4 text-violet-600" />
                Before / After Comparison
              </h2>
              <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                Interactive Slider
              </span>
            </div>

            {/* Split Comparison Viewer */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-200 select-none">
              {isGenerating ? (
                <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
                    <RefreshCw className="w-7 h-7 text-violet-400 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Transforming Image</p>
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
              ) : (
                <>
                  {/* After Image (Background) */}
                  <img
                    src={activeResult.afterImage}
                    alt="After Transformation"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded shadow">
                    AFTER
                  </div>

                  {/* Before Image (Clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={activeResult.beforeImage}
                      alt="Before Transformation"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute top-3 left-3 z-10 text-[10px] font-bold bg-neutral-900/90 text-white px-2 py-0.5 rounded shadow">
                      BEFORE
                    </div>
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-white shadow-xl flex items-center justify-center cursor-ew-resize z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-neutral-900 shadow-2xl border border-neutral-300 flex items-center justify-center text-xs font-bold -ml-4">
                      ↔
                    </div>
                  </div>

                  {/* Invisible Range Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                    title="Drag to compare before and after"
                  />
                </>
              )}
            </div>

            {/* Comparison Details */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">{activeResult.title}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Strength: {Math.round(activeResult.strength * 100)}%
                </span>
              </div>
              <p className="text-xs text-neutral-600 line-clamp-2">"{activeResult.prompt}"</p>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                <span>Model: <strong className="text-neutral-800">{activeResult.model}</strong></span>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(activeResult)}
                  className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Inspect
                </button>
              </div>
            </div>
          </div>

          {/* Sample Results History */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-600" />
                  Recent Transformations
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">Click any sample to load into the comparison viewer.</p>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                {historyList.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveResult(item)}
                  className={cn(
                    'group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all',
                    activeResult.id === item.id
                      ? 'border-violet-600 ring-2 ring-violet-500/20'
                      : 'border-neutral-200 hover:border-violet-400'
                  )}
                >
                  <img
                    src={item.afterImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end text-white">
                    <p className="text-[10px] font-medium line-clamp-1">{item.title}</p>
                    <span className="text-[9px] text-violet-300">{Math.round(item.strength * 100)}% denoise</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Modal */}
      {activeModalItem && (
        <Modal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title="Image-to-Image Transformation Details"
          description="Detailed before/after comparison and metadata"
          className="max-w-2xl bg-white text-neutral-900 border-neutral-200"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 block mb-1">BEFORE (Source)</span>
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 aspect-square">
                  <img
                    src={activeModalItem.beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-violet-600 block mb-1">AFTER (Transformed)</span>
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 aspect-square">
                  <img
                    src={activeModalItem.afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>Transformation Prompt</span>
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

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Model</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.model}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Transformation Strength</span>
                <span className="font-semibold text-neutral-900">{Math.round(activeModalItem.strength * 100)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPrompt(activeModalItem.prompt)
                  setTransformationStrength(activeModalItem.strength)
                  setActiveModalItem(null)
                }}
                leftIcon={Wand2}
                className="text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              >
                Use this Setup
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
                  href={activeModalItem.afterImage}
                  download="kiaan-transformed.jpg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ImageToImagePage
