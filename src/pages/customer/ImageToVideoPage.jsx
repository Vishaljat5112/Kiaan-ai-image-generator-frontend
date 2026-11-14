import React, { useState, useRef, useEffect } from 'react'
import {
  Film,
  Sparkles,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Sliders,
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
  Move,
  Camera,
  Clock,
  Volume2,
  VolumeX,
  Share2,
  Eye,
  ArrowRight
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

// Available Image-to-Video models
const I2V_MODELS = [
  {
    id: 'wan-2.1-i2v-14b',
    name: 'Wan 2.1 I2V 14B Cinema',
    badge: '720p Cinema',
    badgeColor: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    description: '3D Spatio-Temporal DiT designed specifically to preserve keyframe identity with fluid motion.',
    creditCost: 20,
    fps: 16,
    defaultDuration: '5.0s'
  },
  {
    id: 'wan-2.1-i2v-1.3b',
    name: 'Wan 2.1 I2V 1.3B Turbo',
    badge: 'Fast Draft',
    badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    description: 'Distilled lightweight model for rapid animatics and concept animation previews.',
    creditCost: 10,
    fps: 16,
    defaultDuration: '3.0s'
  }
]

// Camera motion trajectories
const CAMERA_PRESETS = [
  { id: 'zoom-in', label: 'Slow Zoom In', icon: '🔍', desc: 'Smooth focal push toward key subject' },
  { id: 'pan-right', label: 'Pan Right', icon: '➡️', desc: 'Horizontal slide showcasing horizon' },
  { id: 'pan-left', label: 'Pan Left', icon: '⬅️', desc: 'Horizontal slide tracking backward' },
  { id: 'crane-up', label: 'Crane Up', icon: '⬆️', desc: 'Vertical pedestal climb into atmosphere' },
  { id: 'orbital', label: 'Orbit 360°', icon: '🔄', desc: 'Dynamic circular parallax orbit around subject' },
  { id: 'static', label: 'Locked Static', icon: '🔒', desc: 'Steady tripod camera with subject motion only' }
]

// Sample Inspiration Prompts for Image-to-Video
const MOTION_PRESETS = [
  'Gentle wind rustling hair and fabrics, soft glowing particles drifting upward in slow motion',
  'Cinematic forward tracking shot, headlights flaring with heavy rain streaming down windshield',
  'Ambient atmospheric morning mist rolling across landscape with golden light rays shifting',
  'Dynamic camera push-in, eyes blinking with subtle facial expressions and cosmic helmet reflections'
]

// Initial sample showcase for Image-to-Video
const INITIAL_I2V_GALLERY = [
  {
    id: 'i2v-001',
    title: 'Cosmic EVA Helmet Animation',
    prompt: 'Gentle helmet breathing motion, nebula particles floating in reflection, soft camera orbit',
    model: 'Wan 2.1 I2V 14B Cinema',
    duration: '5.0s',
    resolution: '720p (1280×720)',
    camera: 'Orbit 360°',
    motionBucket: 75,
    sourceImage: '/images/landing/hero-astronaut.jpg',
    videoUrl: '/videos/sample-video.mp4',
    thumbnail: '/images/landing/hero-astronaut.jpg',
    timestamp: '10m ago'
  },
  {
    id: 'i2v-002',
    title: 'Formula Racer Drift Dynamics',
    prompt: 'Tire smoke billowing in turbulent slow motion, asphalt heat shimmer and high-speed motion blur',
    model: 'Wan 2.1 I2V 14B Cinema',
    duration: '5.0s',
    resolution: '720p (1280×720)',
    camera: 'Pan Right',
    motionBucket: 90,
    sourceImage: '/images/landing/gallery-motorsport.jpg',
    videoUrl: '/videos/sample-video-2.mp4',
    thumbnail: '/images/landing/gallery-motorsport.jpg',
    timestamp: '25m ago'
  },
  {
    id: 'i2v-003',
    title: 'Emerald Valley Waterfall Cascade',
    prompt: 'Water cascading smoothly down jagged rocks, mist rising with ambient sunbeam shimmer',
    model: 'Wan 2.1 I2V 1.3B Turbo',
    duration: '3.0s',
    resolution: '480p (854×480)',
    camera: 'Crane Up',
    motionBucket: 60,
    sourceImage: '/images/landing/gallery-fantasy.jpg',
    videoUrl: '/videos/sample-video.mp4',
    thumbnail: '/images/landing/gallery-fantasy.jpg',
    timestamp: '1h ago'
  },
  {
    id: 'i2v-004',
    title: 'Nordic Villa Twilight Ambience',
    prompt: 'Subtle water ripples on lake surface, warm interior lights shimmering through twilight fog',
    model: 'Wan 2.1 I2V 14B Cinema',
    duration: '5.0s',
    resolution: '720p (1280×720)',
    camera: 'Slow Zoom In',
    motionBucket: 45,
    sourceImage: '/images/landing/gallery-architecture.jpg',
    videoUrl: '/videos/sample-video-2.mp4',
    thumbnail: '/images/landing/gallery-architecture.jpg',
    timestamp: '3h ago'
  }
]

export function ImageToVideoPage() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const videoPlayerRef = useRef(null)

  // Form State
  const [sourceImage, setSourceImage] = useState({
    name: 'hero-astronaut.jpg',
    url: '/images/landing/hero-astronaut.jpg',
    size: '840 KB'
  })
  const [motionPrompt, setMotionPrompt] = useState('Gentle helmet breathing motion, cosmic dust drifting across visor with subtle orbital camera rotation')
  const [selectedModel, setSelectedModel] = useState(I2V_MODELS[0].id)
  const [cameraMotion, setCameraMotion] = useState('zoom-in')
  const [duration, setDuration] = useState('5.0s')
  const [resolution, setResolution] = useState('720p')
  const [motionBucket, setMotionBucket] = useState(65)
  const [fps, setFps] = useState(16)
  const [seed, setSeed] = useState('')
  const [isRandomSeed, setIsRandomSeed] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Simulation State
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressStep, setProgressStep] = useState('')
  const [currentVideoResult, setCurrentVideoResult] = useState(INITIAL_I2V_GALLERY[0])
  const [gallery, setGallery] = useState(INITIAL_I2V_GALLERY)

  // Video Player Controls
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [copiedNotification, setCopiedNotification] = useState(false)

  const currentModelObj = I2V_MODELS.find(m => m.id === selectedModel) || I2V_MODELS[0]

  // Handle Image Upload
  const handleImageUpload = (e) => {
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

  // Handle Video Generation Simulation
  const handleGenerate = () => {
    if (!sourceImage) {
      alert('Please upload or select a source image keyframe first.')
      return
    }

    setIsGenerating(true)
    setProgress(8)
    setProgressStep('Encoding source keyframe with 3D Causal VAE...')

    const randomSeedVal = isRandomSeed ? Math.floor(Math.random() * 900000000 + 100000000).toString() : (seed || '42')

    setTimeout(() => {
      setProgress(30)
      setProgressStep(`Conditioning ${currentModelObj.name} with trajectory: ${cameraMotion.toUpperCase()}...`)
    }, 800)

    setTimeout(() => {
      setProgress(68)
      setProgressStep('Diffusing 81 continuous frames in spatio-temporal latent space...')
    }, 1800)

    setTimeout(() => {
      setProgress(95)
      setProgressStep('Packaging H.264 MP4 cinematic stream...')
    }, 2800)

    setTimeout(() => {
      setProgress(100)
      setProgressStep('Complete!')

      const newVideo = {
        id: `i2v-${Date.now()}`,
        title: 'Animated Keyframe ' + (cameraMotion.charAt(0).toUpperCase() + cameraMotion.slice(1)),
        prompt: motionPrompt.trim() || 'Dynamic motion animation',
        model: currentModelObj.name,
        duration: duration,
        resolution: resolution === '720p' ? '720p (1280×720)' : '480p (854×480)',
        camera: CAMERA_PRESETS.find(c => c.id === cameraMotion)?.label || 'Dynamic',
        motionBucket: motionBucket,
        sourceImage: sourceImage.url,
        videoUrl: '/videos/sample-video.mp4',
        thumbnail: sourceImage.url,
        timestamp: 'Just now'
      }

      setCurrentVideoResult(newVideo)
      setGallery(prev => [newVideo, ...prev])
      setIsGenerating(false)
      setIsPlaying(true)
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = 0
        videoPlayerRef.current.play().catch(() => {})
      }
    }, 3400)
  }

  // Toggle Video Play/Pause
  const togglePlay = () => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.pause()
        setIsPlaying(false)
      } else {
        videoPlayerRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleRestartVideo = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = 0
      videoPlayerRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleCopyPrompt = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner (Eye-friendly Dark Slate Studio Theme) */}
      <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              Creation Studio
            </span>
            <span className="text-xs text-neutral-500 font-medium">/</span>
            <span className="text-xs text-neutral-400 font-medium">Image-to-Video Animation Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Image-to-Video Animation Studio
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Transform still photographs and conceptual stills into fluid cinematic motion clips with Wan 2.1 3D DiT.
          </p>
        </div>

        {/* Balance & Cost Info */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#080B14] border border-neutral-800 text-left">
            <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              Available Credits
            </div>
            <div className="text-base font-bold text-white">
              {user?.creditBalance ?? 250} <span className="text-xs font-normal text-neutral-400">cr</span>
            </div>
          </div>
          <div className="hidden sm:block px-3 py-2 rounded-xl bg-[#080B14] border border-neutral-800 text-xs text-neutral-400">
            Cost per video: <strong className="text-white font-semibold">{currentModelObj.creditCost} credits</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls (7 cols) + Video Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Keyframe Image Upload */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                1. Source Keyframe Image
              </label>
              {sourceImage && (
                <button
                  type="button"
                  onClick={() => setSourceImage(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {!sourceImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-cyan-500/60 bg-[#080B14]/60 hover:bg-cyan-950/20 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-[#0D111C] border border-neutral-700 shadow-xs flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 group-hover:scale-105 transition-all">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-200">
                    Upload image to animate
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    PNG, JPG, or WebP up to 20MB. Portrait, landscape or square.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#080B14] rounded-xl border border-neutral-800">
                <div className="relative w-full sm:w-36 h-36 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0">
                  <img
                    src={sourceImage.url}
                    alt="Source keyframe"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-900/80 text-white">
                    Start Frame
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <p className="text-xs font-bold text-white truncate">{sourceImage.name}</p>
                    <p className="text-[11px] text-neutral-400">Source Resolution: 1024×1024 • {sourceImage.size}</p>
                  </div>

                  {/* Sample Replacement buttons */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-neutral-400 block mb-1.5">
                      Or Pick a Sample Keyframe:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Astronaut', url: '/images/landing/hero-astronaut.jpg' },
                        { name: 'Racer Drift', url: '/images/landing/gallery-motorsport.jpg' },
                        { name: 'Emerald Valley', url: '/images/landing/gallery-fantasy.jpg' },
                        { name: 'Nordic Villa', url: '/images/landing/gallery-architecture.jpg' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSourceImage({ name: `${item.name}.jpg`, url: item.url, size: '750 KB' })}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-lg border transition-all',
                            sourceImage.url === item.url
                              ? 'bg-cyan-950/40 text-cyan-200 border-cyan-500 font-bold'
                              : 'bg-[#080B14] text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                          )}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Motion Prompt & Presets */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <div className="flex items-center justify-between">
              <label htmlFor="motion-prompt" className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                2. Motion Dynamics Prompt
              </label>
              <button
                type="button"
                onClick={() => setMotionPrompt(MOTION_PRESETS[Math.floor(Math.random() * MOTION_PRESETS.length)])}
                className="text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Randomize Dynamics
              </button>
            </div>

            <textarea
              id="motion-prompt"
              rows={3}
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              placeholder="Describe physical movement, secondary motion, atmospheric effects, lighting changes..."
              className="w-full rounded-xl p-3.5 text-sm bg-[#080B14] border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all resize-none"
            />

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Preset Motion Themes (Click to Apply)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MOTION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMotionPrompt(preset)}
                    className="text-left text-xs bg-[#080B14] hover:bg-cyan-950/40 text-neutral-300 hover:text-cyan-200 hover:border-cyan-700/60 border border-neutral-800 px-3 py-1.5 rounded-lg transition-all line-clamp-1 max-w-full"
                    title={preset}
                  >
                    🎬 {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Camera Movement Trajectory */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                3. Camera Trajectory Preset
              </label>
              <span className="text-xs text-neutral-400 font-medium">3D Spatio-Temporal Control</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CAMERA_PRESETS.map((preset) => {
                const isSelected = cameraMotion === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCameraMotion(preset.id)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1',
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500/20 shadow-xs'
                        : 'border-neutral-800 bg-[#080B14] hover:bg-neutral-800 text-neutral-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{preset.icon}</span>
                      {isSelected && <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-700/60">Active</span>}
                    </div>
                    <div className="font-bold text-xs mt-1">{preset.label}</div>
                    <p className="text-[10px] text-neutral-400 leading-tight">{preset.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 4: Model, Duration & Resolution Settings */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <label className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              4. Video Engine & Resolution Settings
            </label>

            {/* Model switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {I2V_MODELS.map((model) => {
                const isSelected = selectedModel === model.id
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setDuration(model.defaultDuration)
                    }}
                    className={cn(
                      'p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between',
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 ring-2 ring-cyan-500/20 text-white'
                        : 'border-neutral-800 bg-[#080B14] hover:bg-neutral-800/60 hover:border-neutral-700 text-neutral-300'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white">{model.name}</span>
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border', model.badgeColor)}>
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                        {model.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{model.fps} FPS</span>
                      <span className="font-semibold text-white">{model.creditCost} credits</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Duration and Resolution options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {['3.0s (Draft)', '5.0s (Cinema)'].map((d) => {
                    const val = d.split(' ')[0]
                    const isSelected = duration === val
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(val)}
                        className={cn(
                          'py-2 text-xs font-semibold rounded-lg border text-center transition-all',
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                            : 'bg-[#080B14] text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                        )}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">Resolution</label>
                <div className="grid grid-cols-2 gap-2">
                  {['480p (854×480)', '720p (1280×720)'].map((r) => {
                    const val = r.split(' ')[0]
                    const isSelected = resolution === val
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setResolution(val)}
                        className={cn(
                          'py-2 text-xs font-semibold rounded-lg border text-center transition-all',
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                            : 'bg-[#080B14] text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                        )}
                      >
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Motion Intensity Slider */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-neutral-800 space-y-2 mt-2">
              <div className="flex justify-between text-xs font-semibold text-neutral-300">
                <span>Motion Intensity (Bucket Strength)</span>
                <span className="font-mono text-cyan-400">{motionBucket} / 127</span>
              </div>
              <input
                type="range"
                min="20"
                max="127"
                step="1"
                value={motionBucket}
                onChange={(e) => setMotionBucket(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Subtle ambient shift</span>
                <span>Balanced dynamic</span>
                <span>High-velocity cinematic</span>
              </div>
            </div>
          </div>

          {/* Sticky Generate Bar */}
          <div className="bg-[#0D111C]/95 backdrop-blur-md rounded-2xl p-5 border border-neutral-800/90 shadow-xl flex items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Model:</span>
              <span className="text-xs font-bold text-white">{currentModelObj.name.split(' ')[0]} {currentModelObj.name.split(' ')[1]}</span>
              <span className="text-neutral-700">|</span>
              <span className="text-xs font-semibold text-cyan-400">{duration}</span>
              <span className="text-neutral-700">|</span>
              <span className="text-xs font-mono text-neutral-400">{resolution}</span>
            </div>

            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={Film}
              className="px-8 shadow-md hover:shadow-lg transition-all"
            >
              {isGenerating ? 'Synthesizing Video...' : `Generate Video (${currentModelObj.creditCost} Credits)`}
            </Button>
          </div>
        </div>

        {/* Right Side: Video Player & Gallery */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Video Player Card */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                Live Video Playback
              </h2>
              {isGenerating && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-800/60 animate-pulse">
                  Rendering 3D DiT...
                </span>
              )}
            </div>

            {/* Video Player Box */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
              {isGenerating ? (
                /* Generating overlay */
                <div className="absolute inset-0 bg-[#080B14]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4 z-20">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                    <Film className="w-7 h-7 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Generating 3D Spatio-Temporal Video</p>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs">{progressStep}</p>
                  </div>
                  <div className="w-48 bg-neutral-800 rounded-full h-2 overflow-hidden border border-neutral-700">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{progress}% completed</span>
                </div>
              ) : currentVideoResult ? (
                <>
                  <video
                    ref={videoPlayerRef}
                    src={currentVideoResult.videoUrl}
                    poster={currentVideoResult.thumbnail}
                    loop
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white z-10">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleRestartVideo}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                        title="Replay from start"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="text-xs font-mono text-neutral-300">
                        {currentVideoResult.duration} • {currentVideoResult.resolution.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalItem(currentVideoResult)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                        title="Expand / Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Video Metadata Summary */}
            {currentVideoResult && !isGenerating && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{currentVideoResult.title}</span>
                  <span className="text-neutral-400">{currentVideoResult.camera}</span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  "{currentVideoResult.prompt}"
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={currentVideoResult.videoUrl}
                    download="kiaan-video-animation.mp4"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download MP4
                  </a>
                  <button
                    onClick={() => handleCopyPrompt(currentVideoResult.prompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                  >
                    {copiedNotification ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Prompt
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sample Video Gallery */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Recent Image-to-Video Clips
                </h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Click any sample to load into playback player
                </p>
              </div>
              <span className="text-xs font-bold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded-full">
                {gallery.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentVideoResult(item)
                    if (videoPlayerRef.current) {
                      videoPlayerRef.current.currentTime = 0
                      videoPlayerRef.current.play().catch(() => {})
                      setIsPlaying(true)
                    }
                  }}
                  className={cn(
                    'group relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all',
                    currentVideoResult?.id === item.id
                      ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'border-neutral-800 hover:border-cyan-500/60'
                  )}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2 flex flex-col justify-between text-white">
                    <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs self-end">
                      {item.duration}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold line-clamp-1">{item.title}</p>
                      <p className="text-[9px] text-neutral-300">{item.camera}</p>
                    </div>
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
          title="Video Animation Inspection"
          description="Detailed spatio-temporal parameters and export settings"
          theme="dark"
          className="max-w-2xl bg-[#0D111C] text-neutral-100 border-neutral-800"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video flex items-center justify-center">
              <video
                src={activeModalItem.videoUrl}
                poster={activeModalItem.thumbnail}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B14] border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span>Motion Conditioning Prompt</span>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Engine</span>
                <span className="font-semibold text-white">{activeModalItem.model.split(' ')[0]} {activeModalItem.model.split(' ')[1]}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Camera</span>
                <span className="font-semibold text-white">{activeModalItem.camera}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Duration</span>
                <span className="font-mono font-semibold text-cyan-300">{activeModalItem.duration}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] font-semibold uppercase">Motion Bucket</span>
                <span className="font-semibold text-white">{activeModalItem.motionBucket} / 127</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveModalItem(null)}
                className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700"
              >
                Close
              </Button>
              <a
                href={activeModalItem.videoUrl}
                download="kiaan-animated-video.mp4"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download MP4 Video
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ImageToVideoPage
