import React, { useState, useEffect } from 'react'
import {
  Video,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Download,
  Copy,
  Check,
  Clock,
  Coins,
  Layers,
  Wand2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Volume2,
  VolumeX,
  Share2,
  Film
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

// Video Generation Models (PRD / sovereign open weights)
const VIDEO_MODELS = [
  {
    id: 'wan-2.1-t2v-1.3b',
    name: 'Wan 2.1 Video (Draft 480p)',
    badge: 'Fast (~35s)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    description: 'Fast 3D spatio-temporal video synthesis at 854×480. Ideal for rapid shot ideation.',
    creditCost: 12,
    defaultDuration: '5.0s',
    defaultFps: 16
  },
  {
    id: 'wan-2.1-t2v-14b',
    name: 'Wan 2.1 Video (Cinema 720p)',
    badge: 'Cinema 720p (~75s)',
    badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-300',
    description: 'High-definition 1280×720 cinematic video generation with fluid 3D DiT dynamic camera motion.',
    creditCost: 25,
    defaultDuration: '5.0s',
    defaultFps: 24
  },
  {
    id: 'ltx-video-0.9',
    name: 'LTX-Video 0.9.1 (Spatial)',
    badge: 'Ultra Motion',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-300',
    description: 'Lightweight spatio-temporal video foundation model for dynamic action sequences.',
    creditCost: 18,
    defaultDuration: '4.0s',
    defaultFps: 24
  }
]

// Prompt Inspirations for Video
const VIDEO_PROMPT_INSPIRATIONS = [
  'Cinematic drone flyover above a secluded tropical island waterfall at sunset, lush jungle mist, golden hour volumetric rays',
  'Formula race car drifting around a rain-slicked asphalt curve at night, sparks flying, tire smoke reflecting neon stadium lights',
  'Futuristic cybernetic metropolis street tracking shot, flying hover vehicles cruising between glowing holographic skyscrapers in heavy rain',
  'Slow-motion macro shot of an espresso drop splashing into a porcelain cup with creamy swirling crema ripples'
]

// Sample Video Results
const SAMPLE_VIDEOS = [
  {
    id: 'vid-001',
    title: 'Formula Speedway Drift',
    prompt: 'Formula race car drifting around rain-slicked asphalt curve at night, sparks flying, tire smoke reflecting neon stadium lights',
    model: 'Wan 2.1 Video (Cinema 720p)',
    resolution: '1280×720 (16:9)',
    duration: '5.0s',
    fps: 24,
    cameraMotion: 'Orbit Right & Zoom',
    seed: '748291039',
    timestamp: 'Just now',
    thumbnail: '/images/landing/gallery-motorsport.jpg',
    badge: '16:9 Cinema'
  },
  {
    id: 'vid-002',
    title: 'Motocross Sand Dune Jump',
    prompt: 'High-speed tracking shot of motocross rider flying over a steep sand dune against dramatic orange sunset skies',
    model: 'Wan 2.1 Video (Draft 480p)',
    resolution: '854×480 (16:9)',
    duration: '4.0s',
    fps: 16,
    cameraMotion: 'Dynamic Tracking',
    seed: '918237461',
    timestamp: '12m ago',
    thumbnail: '/images/landing/gallery-motocross.jpg',
    badge: 'Draft 480p'
  },
  {
    id: 'vid-003',
    title: 'Fantasy Emerald Valley Cascade',
    prompt: 'Gentle slow aerial crane shot descending towards an enchanted bioluminescent waterfall nestled in emerald mountains',
    model: 'Wan 2.1 Video (Cinema 720p)',
    resolution: '1280×720 (16:9)',
    duration: '5.0s',
    fps: 24,
    cameraMotion: 'Crane Down & Forward',
    seed: '309182745',
    timestamp: '35m ago',
    thumbnail: '/images/landing/gallery-fantasy.jpg',
    badge: 'Cinematic'
  },
  {
    id: 'vid-004',
    title: 'Astronaut Visor Reflection',
    prompt: 'Slow cinematic push-in portrait on deep space astronaut helmet with glowing nebula vortex swirling in visor glass',
    model: 'Wan 2.1 Video (Cinema 720p)',
    resolution: '1024×1024 (1:1)',
    duration: '5.0s',
    fps: 24,
    cameraMotion: 'Slow Dolly In',
    seed: '582019482',
    timestamp: '1h ago',
    thumbnail: '/images/landing/hero-astronaut.jpg',
    badge: '1:1 Square'
  }
]

export function VideoGeneratorPage() {
  const { user } = useAuth()

  // Form State
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [showNegative, setShowNegative] = useState(false)
  const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0].id)
  const [duration, setDuration] = useState('5.0s')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [resolution, setResolution] = useState('720p')
  const [cameraMotion, setCameraMotion] = useState('pan_right')
  const [motionIntensity, setMotionIntensity] = useState(6)
  const [fps, setFps] = useState(24)
  const [seed, setSeed] = useState('')
  const [isRandomSeed, setIsRandomSeed] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Generation Simulation State
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStepText, setGenerationStepText] = useState('')
  const [currentVideo, setCurrentVideo] = useState(SAMPLE_VIDEOS[0])
  const [videoHistory, setVideoHistory] = useState(SAMPLE_VIDEOS)

  // Video Player Simulation State
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerProgress, setPlayerProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  // Inspection Modal
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [copiedNotification, setCopiedNotification] = useState(false)

  const currentModelObj = VIDEO_MODELS.find(m => m.id === selectedModel) || VIDEO_MODELS[0]

  // Simulate playback loop
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + 2.5
        })
      }, 100)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      setPrompt('Epic cinematic crane tracking shot, dramatic lighting, 8k render, photorealistic motion blur, high visual fidelity')
      return
    }
    const enhancements = [
      'cinematic lighting, 8k resolution, smooth 60fps dynamic motion blur, photorealistic depth of field',
      'hyper-detailed cinematic composition, volumetric atmospheric haze, octane render quality, steadycam motion',
      'shot on 35mm anamorphic lens, shallow depth of field, natural fluid dynamics'
    ]
    const chosen = enhancements[Math.floor(Math.random() * enhancements.length)]
    if (!prompt.includes('cinematic') && !prompt.includes('smooth')) {
      setPrompt(`${prompt.trim()}, ${chosen}`)
    }
  }

  const handleGenerate = () => {
    if (!prompt.trim()) {
      const randomPrompt = VIDEO_PROMPT_INSPIRATIONS[Math.floor(Math.random() * VIDEO_PROMPT_INSPIRATIONS.length)]
      setPrompt(randomPrompt)
    }

    setIsGenerating(true)
    setGenerationProgress(10)
    setGenerationStepText('Initializing 3D DiT video inference queue...')

    const randomSeedVal = isRandomSeed ? Math.floor(Math.random() * 900000000 + 100000000).toString() : (seed || '8192')

    setTimeout(() => {
      setGenerationProgress(30)
      setGenerationStepText(`Generating 81 temporal latent frames on ${currentModelObj.name}...`)
    }, 600)

    setTimeout(() => {
      setGenerationProgress(65)
      setGenerationStepText('Synthesizing spatio-temporal coherence and motion vectors...')
    }, 1200)

    setTimeout(() => {
      setGenerationProgress(90)
      setGenerationStepText('Decoding 3D VAE and rendering H.264 video stream...')
    }, 1800)

    setTimeout(() => {
      setGenerationProgress(100)
      setGenerationStepText('Video sequence ready!')

      const pool = [
        '/images/landing/gallery-motorsport.jpg',
        '/images/landing/gallery-motocross.jpg',
        '/images/landing/gallery-fantasy.jpg',
        '/images/landing/hero-astronaut.jpg',
        '/images/landing/gallery-architecture.jpg'
      ]
      const chosenThumbnail = pool[Math.floor(Math.random() * pool.length)]

      const newVideo = {
        id: `vid-${Date.now()}`,
        title: prompt.slice(0, 30) || 'Custom Motion Sequence',
        prompt: prompt.trim() || VIDEO_PROMPT_INSPIRATIONS[0],
        model: currentModelObj.name,
        resolution: `${resolution === '720p' ? '1280×720' : '854×480'} (${aspectRatio})`,
        duration: duration,
        fps: fps,
        cameraMotion: cameraMotion,
        seed: randomSeedVal,
        timestamp: 'Just now',
        thumbnail: chosenThumbnail,
        badge: `${resolution} ${aspectRatio}`
      }

      setCurrentVideo(newVideo)
      setVideoHistory(prev => [newVideo, ...prev])
      setIsGenerating(false)
      setIsPlaying(true)
      setPlayerProgress(0)
    }, 2400)
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
              <Video className="w-3.5 h-3.5 text-violet-600" />
              Creation Studio
            </span>
            <span className="text-xs text-neutral-400 font-medium">/</span>
            <span className="text-xs text-neutral-500 font-medium">Text-to-Video Interactive Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            AI Video Generator
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Generate cinematic 5-second video sequences with Wan 2.1 3D DiT and LTX spatio-temporal video architectures.
          </p>
        </div>

        {/* Balance & Info */}
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
            Cost per video: <strong className="text-neutral-900 font-semibold">{currentModelObj.creditCost} credits</strong>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Video Generation Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt Input Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="video-prompt-input" className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-600" />
                Motion Scene Prompt
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

            <div className="relative">
              <textarea
                id="video-prompt-input"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe subject dynamics, physical motion, camera trajectory, lighting and environment (e.g. Formula race car drifting around rain-slicked turn)..."
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

            {/* Inspiration Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Inspiration Presets (Click to Load)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VIDEO_PROMPT_INSPIRATIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="text-left text-xs bg-neutral-100 hover:bg-violet-50 text-neutral-700 hover:text-violet-800 hover:border-violet-300 border border-neutral-200 px-3 py-1.5 rounded-lg transition-all line-clamp-1 max-w-full"
                    title={preset}
                  >
                    🎬 {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Prompt Toggle */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowNegative(!showNegative)}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
              >
                {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showNegative ? 'Hide Negative Prompt' : 'Add Negative Prompt (Avoid jitter, static, blur)'}
              </button>

              {showNegative && (
                <div className="mt-2.5">
                  <textarea
                    rows={2}
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g. jerky motion, flicker, unnatural physics, distorted hands, morphing artifacts, low bitrate..."
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
                <Film className="w-4 h-4 text-violet-600" />
                Video Foundation Model
              </label>
              <span className="text-xs text-neutral-500">Commercial Apache 2.0 Weights</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {VIDEO_MODELS.map((model) => {
                const isSelected = selectedModel === model.id
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setDuration(model.defaultDuration)
                      setFps(model.defaultFps)
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
                      <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border inline-block mb-1.5', model.badgeColor)}>
                        {model.badge}
                      </span>
                      <p className="text-[11px] text-neutral-600 line-clamp-2">
                        {model.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{model.defaultDuration}</span>
                      <span className="font-semibold text-neutral-800">{model.creditCost} credits</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Video Specs: Duration, Resolution & Aspect Ratio */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-600" />
              Duration, Aspect Ratio & Resolution
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 block">Duration (Seconds)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['3.0s', '5.0s'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs font-semibold transition-all',
                        duration === d
                          ? 'border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      )}
                    >
                      {d} {d === '5.0s' ? '(81 frames)' : '(49 frames)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 block">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '16:9', label: '16:9' },
                    { id: '9:16', label: '9:16' },
                    { id: '1:1', label: '1:1' }
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setAspectRatio(ratio.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs font-semibold transition-all text-center',
                        aspectRatio === ratio.id
                          ? 'border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      )}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 block">Resolution Quality</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '720p', label: '720p HD' },
                    { id: '480p', label: '480p Draft' }
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setResolution(res.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs font-semibold transition-all text-center',
                        resolution === res.id
                          ? 'border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                      )}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Camera Motion & Physics */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 px-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-800">
                <Sliders className="w-4 h-4 text-violet-600" />
                Camera Motion & Advanced Dynamics
                <span className="text-xs font-normal text-neutral-500">(Trajectory, Motion Scale, Seed)</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-6 pt-2 border-t border-neutral-100 space-y-4 bg-neutral-50/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Camera Motion */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 block">Camera Trajectory</label>
                    <select
                      value={cameraMotion}
                      onChange={(e) => setCameraMotion(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-xs bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                    >
                      <option value="pan_right">Pan Right Tracking</option>
                      <option value="pan_left">Pan Left Tracking</option>
                      <option value="zoom_in">Slow Zoom In (Dolly)</option>
                      <option value="zoom_out">Slow Zoom Out</option>
                      <option value="crane_down">Cinematic Crane Down</option>
                      <option value="orbit">Circular Orbit</option>
                      <option value="static">Static Tripod</option>
                    </select>
                  </div>

                  {/* Motion Intensity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-neutral-700">
                      <span>Motion Dynamic Intensity</span>
                      <span className="font-mono text-violet-700">{motionIntensity} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={motionIntensity}
                      onChange={(e) => setMotionIntensity(parseInt(e.target.value))}
                      className="w-full accent-violet-600 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-500">Controls speed and kinetic action in scene.</p>
                  </div>
                </div>

                {/* Seed Control */}
                <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">RNG Seed Lock</label>
                    <input
                      type="text"
                      disabled={isRandomSeed}
                      value={isRandomSeed ? 'Randomized Seed' : seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="e.g. 592810"
                      className="rounded-xl px-3 py-1.5 text-xs bg-white border border-neutral-300 text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-500 focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRandomSeed(!isRandomSeed)}
                    className="text-xs text-violet-600 font-medium hover:text-violet-700"
                  >
                    {isRandomSeed ? '✓ Random Seed' : 'Lock Seed'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Generate Button Bar */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-md flex items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Model:</span>
              <span className="font-bold text-neutral-900">{currentModelObj.name}</span>
              <span className="text-neutral-300">|</span>
              <span className="font-mono text-neutral-600">{resolution} • {duration}</span>
            </div>

            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={Video}
              className="px-8 shadow-md hover:shadow-lg transition-all"
            >
              {isGenerating ? 'Synthesizing...' : `Generate Video (${currentModelObj.creditCost} Credits)`}
            </Button>
          </div>
        </div>

        {/* Right Side: Interactive Video Player & Recent Sample Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Video Player Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Play className="w-4 h-4 text-violet-600" />
                Video Preview Player
              </h2>
              {isGenerating ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200 animate-pulse">
                  Rendering 3D DiT...
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  Demo Preview
                </span>
              )}
            </div>

            {/* Simulated Video Canvas */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group flex items-center justify-center">
              {isGenerating ? (
                <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
                    <Video className="w-7 h-7 text-violet-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Generating 3D Spatio-Temporal Video</p>
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
                  <img
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />

                  {/* Play Button Overlay */}
                  <div
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 group-hover:bg-black/40 transition-colors"
                  >
                    {!isPlaying && (
                      <div className="w-14 h-14 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-xl flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-neutral-900" />
                      </div>
                    )}
                  </div>

                  {/* Video Control Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2">
                    {/* Progress scrubber */}
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                      <div
                        className="bg-violet-500 h-full transition-all duration-100"
                        style={{ width: `${playerProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-violet-400 transition-colors"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPlayerProgress(0)
                            setIsPlaying(true)
                          }}
                          className="hover:text-violet-400 transition-colors"
                          title="Restart"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-neutral-300">
                          {((playerProgress / 100) * parseFloat(currentVideo.duration)).toFixed(1)}s / {currentVideo.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="hover:text-violet-400 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModalItem(currentVideo)}
                          className="hover:text-violet-400 transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Current Video Information */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">{currentVideo.title}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  {currentVideo.model}
                </span>
              </div>
              <p className="text-xs text-neutral-600 line-clamp-2">"{currentVideo.prompt}"</p>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                <span>Res: <strong className="text-neutral-800">{currentVideo.resolution}</strong></span>
                <span>Camera: <strong className="text-neutral-800">{currentVideo.cameraMotion}</strong></span>
                <span>FPS: <strong className="text-neutral-800">{currentVideo.fps}</strong></span>
              </div>
            </div>
          </div>

          {/* Sample Video Gallery */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Film className="w-4 h-4 text-violet-600" />
                  Recent Sample Videos
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">Click any video to load into the preview player.</p>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                {videoHistory.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {videoHistory.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setCurrentVideo(video)
                    setIsPlaying(true)
                    setPlayerProgress(0)
                  }}
                  className={cn(
                    'group relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all',
                    currentVideo.id === video.id
                      ? 'border-violet-600 ring-2 ring-violet-500/20'
                      : 'border-neutral-200 hover:border-violet-400'
                  )}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-between text-white">
                    <span className="text-[9px] font-semibold bg-black/60 px-1.5 py-0.5 rounded self-start border border-white/20">
                      {video.duration} • {video.badge}
                    </span>
                    <p className="text-[10px] font-medium line-clamp-1">{video.title}</p>
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
          title="Video Sequence Inspection"
          description="Detailed metadata parameters and production export options"
          className="max-w-2xl bg-white text-neutral-900 border-neutral-200"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-950 flex items-center justify-center max-h-96">
              <img
                src={activeModalItem.thumbnail}
                alt={activeModalItem.title}
                className="max-h-96 w-auto object-contain"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                <span>Motion Scene Prompt</span>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Model</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.model}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Resolution</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.resolution}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Camera Motion</span>
                <span className="font-semibold text-neutral-900">{activeModalItem.cameraMotion}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 block text-[10px] font-semibold uppercase">Seed & Frames</span>
                <span className="font-mono font-semibold text-neutral-900">{activeModalItem.seed} ({activeModalItem.duration})</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPrompt(activeModalItem.prompt)
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
                  href={activeModalItem.thumbnail}
                  download="kiaan-video-poster.jpg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Poster
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default VideoGeneratorPage
