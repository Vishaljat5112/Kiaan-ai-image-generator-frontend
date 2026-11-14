import React, { useState, useRef, useEffect } from 'react'
import {
  Edit3,
  Upload,
  RotateCw,
  Crop,
  Sun,
  Contrast,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  Maximize2,
  Brush,
  Eraser,
  Eye,
  Undo2,
  Trash2,
  Layers,
  Palette
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../utils/cn'

// Preset Photographic Filters
const PRESET_FILTERS = [
  { id: 'normal', name: 'Normal', filterStr: 'none' },
  { id: 'cinematic', name: 'Cinematic', filterStr: 'contrast(1.2) saturate(1.25) hue-rotate(-5deg)' },
  { id: 'warm', name: 'Warm Amber', filterStr: 'sepia(0.3) saturate(1.3) brightness(1.05)' },
  { id: 'cool', name: 'Cool Slate', filterStr: 'saturate(0.9) hue-rotate(25deg) brightness(1.05)' },
  { id: 'noir', name: 'B&W Noir', filterStr: 'grayscale(1) contrast(1.4) brightness(0.95)' },
  { id: 'vintage', name: 'Vintage 70s', filterStr: 'sepia(0.5) contrast(1.1) brightness(0.95)' }
]

// Preset Crop Aspect Ratios
const CROP_RATIOS = [
  { id: 'free', label: 'Free' },
  { id: '1:1', label: '1:1 Square' },
  { id: '16:9', label: '16:9 Cinema' },
  { id: '4:3', label: '4:3 Classic' }
]

export function ImageEditorPage() {
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  // Current Working Image State
  const [imageSrc, setImageSrc] = useState('/images/landing/edit-cyberpunk.jpg')
  const [imageName, setImageName] = useState('edit-cyberpunk.jpg')
  const [activeTab, setActiveTab] = useState('adjust') // 'adjust', 'filter', 'crop', 'brush'

  // Adjustment Controls
  const [brightness, setBrightness] = useState(100) // %
  const [contrast, setContrast] = useState(100)     // %
  const [saturation, setSaturation] = useState(100) // %
  const [rotation, setRotation] = useState(0)       // degrees (0, 90, 180, 270)
  const [activeFilter, setActiveFilter] = useState('normal')
  const [cropRatio, setCropRatio] = useState('free')

  // Inpainting Brush Simulator
  const [brushSize, setBrushSize] = useState(25)
  const [inpaintPrompt, setInpaintPrompt] = useState('')
  const [isBrushActive, setIsBrushActive] = useState(false)
  const [maskPixelsDrawn, setMaskPixelsDrawn] = useState(false)

  // Generation / Inpainting Simulation
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingText, setProcessingText] = useState('')
  const [notification, setNotification] = useState('')

  // Handle local image upload via file reader
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result)
        setImageName(file.name)
        handleResetAdjustments()
      }
      reader.readAsDataURL(file)
    }
  }

  // Rotate by 90 degrees
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  // Reset all adjustments
  const handleResetAdjustments = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setActiveFilter('normal')
    setCropRatio('free')
    setMaskPixelsDrawn(false)
    setInpaintPrompt('')
    setNotification('Adjustments reset to defaults')
    setTimeout(() => setNotification(''), 2000)
  }

  // Build the CSS filter string
  const getFilterStyle = () => {
    const base = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    const presetObj = PRESET_FILTERS.find(f => f.id === activeFilter)
    if (presetObj && presetObj.filterStr !== 'none') {
      return `${base} ${presetObj.filterStr}`
    }
    return base
  }

  // Export / Download edited image via HTML Canvas
  const handleDownloadEdited = () => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Set dimensions based on rotation
      if (rotation === 90 || rotation === 270) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      ctx.save()

      // Apply rotation transformation around center
      if (rotation === 90) {
        ctx.translate(canvas.width, 0)
        ctx.rotate((90 * Math.PI) / 180)
      } else if (rotation === 180) {
        ctx.translate(canvas.width, canvas.height)
        ctx.rotate((180 * Math.PI) / 180)
      } else if (rotation === 270) {
        ctx.translate(0, canvas.height)
        ctx.rotate((270 * Math.PI) / 180)
      }

      // Apply CSS Filters directly to canvas context
      ctx.filter = getFilterStyle()
      ctx.drawImage(img, 0, 0)
      ctx.restore()

      // Trigger download
      try {
        const link = document.createElement('a')
        link.download = `edited-${imageName.replace(/\.[^/.]+$/, '')}.jpg`
        link.href = canvas.toDataURL('image/jpeg', 0.92)
        link.click()
        setNotification('Image exported and downloaded successfully!')
        setTimeout(() => setNotification(''), 3000)
      } catch (err) {
        // Fallback for cross-origin local security
        const link = document.createElement('a')
        link.download = `edited-${imageName}`
        link.href = imageSrc
        link.click()
      }
    }
  }

  // Simulate Inpainting / Generative Fill
  const handleApplyGenerativeFill = () => {
    if (!inpaintPrompt.trim()) {
      setInpaintPrompt('Add glowing cyan cybernetic visor reflections')
    }

    setIsProcessing(true)
    setProcessingText('Synthesizing context-aware latent fill on masked area...')

    setTimeout(() => {
      setProcessingText('Blending edge feathering and high frequency details...')
    }, 800)

    setTimeout(() => {
      setIsProcessing(false)
      setMaskPixelsDrawn(false)
      setImageSrc('/images/landing/edit-relighting.jpg')
      setImageName('generative-inpaint-result.jpg')
      setNotification('Generative Fill applied successfully!')
      setTimeout(() => setNotification(''), 3000)
    }, 1500)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header (Eye-friendly Dark Slate Studio Theme) */}
      <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              Creation Studio
            </span>
            <span className="text-xs text-neutral-500 font-medium">/</span>
            <span className="text-xs text-neutral-400 font-medium">Interactive Studio Canvas Editor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Image Canvas Editor
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Perform client-side editing: crop, rotate, brightness, contrast, stylistic photo filters, and context-aware generative inpainting.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAdjustments}
            leftIcon={RotateCcw}
            className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
          >
            Reset
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={handleDownloadEdited}
            leftIcon={Download}
            className="shadow-sm"
          >
            Download Edited
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl flex items-center justify-between animate-fade-in">
          <span>✓ {notification}</span>
          <button onClick={() => setNotification('')} className="text-emerald-400 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Editor Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Tools Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tool Navigation Tabs */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-2 border border-neutral-800/90 shadow-sm grid grid-cols-4 gap-1 text-center">
            {[
              { id: 'adjust', label: 'Adjust', icon: Sliders },
              { id: 'filter', label: 'Filters', icon: Palette },
              { id: 'crop', label: 'Crop & Rotate', icon: Crop },
              { id: 'brush', label: 'Inpaint', icon: Sparkles }
            ].map((tab) => {
              const IconComp = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-2 px-1 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1',
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  )}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* TAB 1: Adjustments (Brightness, Contrast, Saturation) */}
          {activeTab === 'adjust' && (
            <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-5 text-neutral-100">
              <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Color & Tone Adjustments
              </h2>

              {/* Brightness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-neutral-400" />
                    Brightness
                  </span>
                  <span className="font-mono text-cyan-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Contrast className="w-3.5 h-3.5 text-neutral-400" />
                    Contrast
                  </span>
                  <span className="font-mono text-cyan-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-300">
                  <span>Saturation</span>
                  <span className="font-mono text-cyan-400">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-neutral-800 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(100)
                    setContrast(100)
                    setSaturation(100)
                  }}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Reset Sliders
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Photographic Filters */}
          {activeTab === 'filter' && (
            <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
              <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                Color Grading Presets
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {PRESET_FILTERS.map((f) => {
                  const isSelected = activeFilter === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFilter(f.id)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500/20 font-bold'
                          : 'border-neutral-800 bg-[#080B14] hover:border-cyan-500/60 text-neutral-300'
                      )}
                    >
                      <div className="text-xs">{f.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Crop & Rotate */}
          {activeTab === 'crop' && (
            <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-5 text-neutral-100">
              <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Crop className="w-4 h-4 text-cyan-400" />
                Orientation & Framing
              </h2>

              {/* Rotate Action */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 block">Rotation</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                    leftIcon={RotateCw}
                    className="text-xs text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                  >
                    Rotate 90° Clockwise
                  </Button>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{rotation}°</span>
                </div>
              </div>

              {/* Crop Ratio Presets */}
              <div className="space-y-2 pt-3 border-t border-neutral-800">
                <label className="text-xs font-semibold text-neutral-300 block">Aspect Ratio Crop</label>
                <div className="grid grid-cols-2 gap-2">
                  {CROP_RATIOS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCropRatio(c.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-xs font-semibold text-center transition-all',
                        cropRatio === c.id
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500/20'
                          : 'border-neutral-800 bg-[#080B14] hover:bg-neutral-800 text-neutral-300'
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Inpaint & Generative Fill */}
          {activeTab === 'brush' && (
            <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
              <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Generative Inpainting Brush
              </h2>
              <p className="text-xs text-neutral-400">
                Click on the canvas on the right to brush over regions you want replaced or enhanced.
              </p>

              {/* Inpaint Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">Fill Prompt</label>
                <textarea
                  rows={2}
                  value={inpaintPrompt}
                  onChange={(e) => setInpaintPrompt(e.target.value)}
                  placeholder="e.g. Add glowing cybernetic visor, change hair color to turquoise..."
                  className="w-full rounded-xl p-2.5 text-xs bg-[#080B14] border border-neutral-700/80 text-neutral-100 placeholder:text-neutral-500 focus:bg-[#0A0E17] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
                />
              </div>

              {/* Brush Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-300">
                  <span>Brush Radius</span>
                  <span className="font-mono text-cyan-400">{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApplyGenerativeFill}
                  isLoading={isProcessing}
                  leftIcon={Sparkles}
                  className="w-full"
                >
                  {isProcessing ? 'Filling...' : 'Apply Generative Fill'}
                </Button>
                {maskPixelsDrawn && (
                  <button
                    type="button"
                    onClick={() => setMaskPixelsDrawn(false)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
                    title="Clear mask"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload New Image Box */}
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-5 border border-neutral-800/90 shadow-sm space-y-3 text-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200">Current File:</span>
              <span className="text-xs font-mono text-neutral-400 truncate max-w-[160px]">{imageName}</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={Upload}
              className="w-full text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              Upload Local Image
            </Button>
          </div>
        </div>

        {/* Right Side: Interactive Editing Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/90 shadow-sm space-y-4 text-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-100">Live Studio Viewport</span>
                <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  {rotation !== 0 ? `Rotated ${rotation}°` : 'Original Angle'}
                </span>
                {activeFilter !== 'normal' && (
                  <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/60">
                    Filter: {activeFilter}
                  </span>
                )}
              </div>

              <div className="text-xs text-neutral-400">
                {isProcessing ? (
                  <span className="text-cyan-400 font-semibold animate-pulse">{processingText}</span>
                ) : (
                  <span>Interactive Real-time Canvas</span>
                )}
              </div>
            </div>

            {/* Canvas Viewport Container */}
            <div
              onClick={() => {
                if (activeTab === 'brush') {
                  setMaskPixelsDrawn(true)
                }
              }}
              className={cn(
                'relative w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center min-h-[460px] max-h-[580px] cursor-crosshair',
                cropRatio === '1:1' && 'aspect-square',
                cropRatio === '16:9' && 'aspect-video',
                cropRatio === '4:3' && 'aspect-[4/3]'
              )}
            >
              {/* Working Image with live CSS transformations & rotation */}
              <img
                src={imageSrc}
                alt="Working Canvas"
                className="max-h-[520px] max-w-full object-contain transition-all duration-300 select-none pointer-events-none"
                style={{
                  filter: getFilterStyle(),
                  transform: `rotate(${rotation}deg)`
                }}
              />

              {/* Simulated Brush Mask Overlay when inpainting */}
              {activeTab === 'brush' && maskPixelsDrawn && (
                <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                  <div
                    className="w-32 h-32 rounded-full bg-cyan-500/30 border-2 border-dashed border-cyan-400 animate-pulse"
                    style={{ width: `${brushSize * 4}px`, height: `${brushSize * 4}px` }}
                  />
                  <span className="absolute text-[11px] font-bold text-white bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500">
                    Masked Region
                  </span>
                </div>
              )}

              {/* Inpainting Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-cyan-300 animate-spin" />
                  </div>
                  <p className="text-sm font-bold">{processingText}</p>
                </div>
              )}
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>Zoom: 100% (Fit)</span>
              <span>Click Download Edited above to export final graphic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageEditorPage
