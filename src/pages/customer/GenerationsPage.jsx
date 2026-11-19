import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Image as ImageIcon, Video, Heart, Download, Trash2, Grid3x3, List, Copy, Check, Wand2, Sparkles, Play, ChevronDown
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, LightEmptyState, MediaThumb, Toast
} from '../../components/studio/StudioUI'
import { formatBytes, formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'
import { api } from '../../services/api'

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'credits', label: 'Most credits' },
  { value: 'title', label: 'Title A–Z' }
]

const PROJECT_MODELS = [
  'FLUX.2 Klein 4B',
  'Z-Image Turbo',
  'Wan 2.1 Video (Draft 480p)',
  'Wan 2.1 Video (Cinema 720p)'
]

export function GenerationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [modelFilter, setModelFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [active, setActive] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  // Load generations from real backend
  useEffect(() => {
    let isMounted = true

    async function fetchGenerations() {
      try {
        const res = await api.get('/assets/generations')
        if (isMounted && res.data?.success) {
          setItems(res.data.data || [])
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchGenerations()
    return () => { isMounted = false }
  }, [])

  const models = useMemo(() => {
    const dynamic = items.map((i) => i.model).filter(Boolean)
    return Array.from(new Set([...PROJECT_MODELS, ...dynamic]))
  }, [items])

  const counts = useMemo(() => ({
    all: items.length,
    image: items.filter((i) => i.type === 'image').length,
    video: items.filter((i) => i.type === 'video').length,
    favorite: items.filter((i) => i.favorite || i.isFavorite).length
  }), [items])

  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const modelMenuRef = useRef(null)
  const sortMenuRef = useRef(null)
  const categoryMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
        setIsModelMenuOpen(false)
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setIsSortMenuOpen(false)
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsModelMenuOpen(false)
        setIsSortMenuOpen(false)
        setIsCategoryMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const categoryOptions = [
    { value: 'all', label: 'All', icon: null },
    { value: 'image', label: 'Images', icon: ImageIcon },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'favorite', label: 'Favorites', icon: Heart }
  ]

  const selectedCategory = categoryOptions.find((c) => c.value === typeFilter) || categoryOptions[0]

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter((i) => {
      const isFav = i.favorite || i.isFavorite
      if (typeFilter === 'favorite' && !isFav) return false
      if ((typeFilter === 'image' || typeFilter === 'video') && i.type !== typeFilter) return false
      if (modelFilter !== 'all' && i.model !== modelFilter) return false
      if (q && !`${i.title || ''} ${i.prompt || ''} ${i.tool || ''}`.toLowerCase().includes(q)) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'credits') return (b.credits || 0) - (a.credits || 0)
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '')
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return list
  }, [items, query, typeFilter, modelFilter, sort])

  const toggleFavorite = async (id) => {
    try {
      const res = await api.patch(`/assets/${id}/favorite`)
      if (res.data?.success) {
        const updated = res.data.data
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, favorite: updated.isFavorite, isFavorite: updated.isFavorite } : i)))
        setActive((prev) => (prev && prev.id === id ? { ...prev, favorite: updated.isFavorite, isFavorite: updated.isFavorite } : prev))
      }
    } catch {
      // Local optimistic toggle fallback
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, favorite: !i.favorite, isFavorite: !i.isFavorite } : i)))
      setActive((prev) => (prev && prev.id === id ? { ...prev, favorite: !prev.favorite, isFavorite: !prev.isFavorite } : prev))
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await api.delete(`/assets/${pendingDelete.id}`)
      setItems((prev) => prev.filter((i) => i.id !== pendingDelete.id))
      setToast({ message: `"${pendingDelete.title}" removed successfully.` })
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to delete asset', tone: 'danger' })
    } finally {
      if (active?.id === pendingDelete.id) setActive(null)
      setPendingDelete(null)
    }
  }

  const handleDownloadClick = async (asset) => {
    try {
      await api.post('/customer/downloads', {
        assetId: asset.id,
        format: asset.type === 'video' ? 'MP4' : 'JPG'
      })
    } catch {
      // Background logging fails silently
    }
  }

  const copyPrompt = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const resetFilters = () => {
    setQuery('')
    setTypeFilter('all')
    setModelFilter('all')
  }

  const fileName = (g) => `${(g.title || 'asset').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${g.type === 'video' ? 'mp4' : 'jpg'}`

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <StudioPageHeader
        icon={Clock}
        section="Asset Management"
        crumb="My Generations"
        title="My Generations"
        description="Browse, search and manage every image and video created in the studio."
        actions={
          <Link to="/dashboard/image-generator">
            <Button variant="gradient" leftIcon={Sparkles}>New Generation</Button>
          </Link>
        }
      />

      <Panel className="p-3.5 sm:p-4 space-y-2.5">
        {/* ROW 1: Search bar + "All models" dropdown + "Sort by" dropdown + Icon-only Grid/List buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search by title, prompt or tool..."
            className="flex-1 min-w-0 [&>input]:h-[42px]"
          />

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* 1. All models Dropdown */}
            <div className="relative" ref={modelMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsModelMenuOpen((prev) => !prev)
                  setIsSortMenuOpen(false)
                  setIsCategoryMenuOpen(false)
                }}
                className={cn(
                  "h-[42px] px-3.5 rounded-xl bg-[#080B14] border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                  isModelMenuOpen
                    ? "border-cyan-500 text-white"
                    : "border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white"
                )}
                aria-expanded={isModelMenuOpen}
                aria-haspopup="true"
              >
                <span className="truncate max-w-[130px]">{modelFilter === 'all' ? 'All models' : modelFilter}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200", isModelMenuOpen && "rotate-180")} />
              </button>

              {isModelMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 sm:left-0 top-full mt-1.5 w-60 rounded-xl bg-[#0D111C] border border-neutral-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto"
                >
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    MODEL FILTER
                  </div>
                  <div className="space-y-0.5 px-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModelFilter('all')
                        setIsModelMenuOpen(false)
                      }}
                      className={cn(
                        "w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                        modelFilter === 'all'
                          ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                          : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                      )}
                    >
                      <span>All models</span>
                      {modelFilter === 'all' && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                    {models.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setModelFilter(m)
                          setIsModelMenuOpen(false)
                        }}
                        className={cn(
                          "w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                          modelFilter === m
                            ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                            : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                        )}
                      >
                        <span className="truncate">{m}</span>
                        {modelFilter === m && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Separate Sort By Dropdown (to the right of all models) */}
            <div className="relative" ref={sortMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSortMenuOpen((prev) => !prev)
                  setIsModelMenuOpen(false)
                  setIsCategoryMenuOpen(false)
                }}
                className={cn(
                  "h-[42px] px-3.5 rounded-xl bg-[#080B14] border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                  isSortMenuOpen
                    ? "border-cyan-500 text-white"
                    : "border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white"
                )}
                aria-expanded={isSortMenuOpen}
                aria-haspopup="true"
              >
                <span>Sort by</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200", isSortMenuOpen && "rotate-180")} />
              </button>

              {isSortMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-[#0D111C] border border-neutral-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    SORT BY
                  </div>
                  <div className="space-y-0.5 px-1">
                    {SORTS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => {
                          setSort(s.value)
                          setIsSortMenuOpen(false)
                        }}
                        className={cn(
                          "w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                          sort === s.value
                            ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                            : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                        )}
                      >
                        <span>{s.label}</span>
                        {sort === s.value && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Icon-Only Grid / List Controls */}
            <div
              className="inline-flex p-1 rounded-xl bg-[#080B14] border border-neutral-700/80 h-[42px] items-center gap-1 shrink-0"
              role="group"
              aria-label="View layout"
            >
              {/* Grid Button */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  aria-label="Grid"
                  title="Grid"
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50',
                    view === 'grid'
                      ? 'bg-neutral-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  )}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                {/* Tooltip on hover / keyboard focus */}
                <div
                  role="tooltip"
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-900 text-neutral-200 border border-neutral-700 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 whitespace-nowrap z-30"
                >
                  Grid
                </div>
              </div>

              {/* List Button */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  aria-label="List"
                  title="List"
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50',
                    view === 'list'
                      ? 'bg-neutral-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                {/* Tooltip on hover / keyboard focus */}
                <div
                  role="tooltip"
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-900 text-neutral-200 border border-neutral-700 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 whitespace-nowrap z-30"
                >
                  List
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Category Dropdown (without 0 count pills) */}
        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
          <div className="relative inline-block" ref={categoryMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsCategoryMenuOpen((prev) => !prev)
                setIsModelMenuOpen(false)
                setIsSortMenuOpen(false)
              }}
              className={cn(
                "h-[38px] px-3.5 rounded-xl bg-[#080B14] border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                isCategoryMenuOpen
                  ? "border-cyan-500 text-white"
                  : "border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white"
              )}
              aria-expanded={isCategoryMenuOpen}
              aria-haspopup="true"
            >
              {selectedCategory.icon && <selectedCategory.icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              <span>{selectedCategory.label}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ml-0.5", isCategoryMenuOpen && "rotate-180")} />
            </button>

            {isCategoryMenuOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1.5 w-44 rounded-xl bg-[#0D111C] border border-neutral-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="space-y-0.5 px-1">
                  {categoryOptions.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = typeFilter === cat.value
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setTypeFilter(cat.value)
                          setIsCategoryMenuOpen(false)
                        }}
                        className={cn(
                          "w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                          isSelected
                            ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                            : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {Icon ? <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-cyan-400" : "text-neutral-400")} /> : <span className="w-3.5" />}
                          <span className="truncate">{cat.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 ml-0.5 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {visible.length === 0 ? (
        <LightEmptyState
          icon={ImageIcon}
          title={items.length === 0 ? 'Your library is empty' : 'No generations match your filters'}
          description={items.length === 0 ? 'Everything you generate will appear here.' : 'Try a different search term or clear the filters.'}
          action={items.length === 0
            ? <Link to="/dashboard/image-generator"><Button variant="gradient" size="sm">Open Image Generator</Button></Link>
            : <Button variant="outline" size="sm" onClick={resetFilters} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">Clear filters</Button>}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((g) => {
            const isFav = g.favorite || g.isFavorite
            return (
              <div key={g.id} className="group bg-[#0D111C]/90 backdrop-blur-md rounded-2xl border border-neutral-800/90 shadow-sm overflow-hidden hover:shadow-lg hover:border-cyan-500/40 transition-all text-white">
                <button type="button" onClick={() => setActive(g)} className="relative block w-full aspect-square bg-neutral-900 cursor-pointer" aria-label={`Preview ${g.title}`}>
                  <MediaThumb type={g.type} src={g.src} poster={g.poster} alt={g.title} className="group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-900/90 text-neutral-200 border border-neutral-700">
                    {g.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {g.type === 'video' ? (g.duration || '5.0s') : (g.aspect || '1:1')}
                  </span>
                  {g.type === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white"><Play className="w-5 h-5 text-cyan-400 ml-0.5" /></span>
                    </span>
                  )}
                </button>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{g.title}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{g.tool} • {formatDateTime(g.createdAt)}</p>
                    </div>
                    <button type="button" onClick={() => toggleFavorite(g.id)} aria-label={isFav ? 'Remove favorite' : 'Add favorite'} className="p-1 rounded-lg hover:bg-neutral-800 cursor-pointer">
                      <Heart className={cn('w-4 h-4 transition-colors', isFav ? 'fill-rose-500 text-rose-500' : 'text-neutral-500 hover:text-neutral-300')} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <a
                      href={g.src}
                      download={fileName(g)}
                      onClick={() => handleDownloadClick(g)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800/60 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                    <button type="button" onClick={() => setPendingDelete(g)} aria-label={`Delete ${g.title}`} className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-900/60 hover:bg-rose-950/30 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Panel className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#080B14] text-[11px] uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Asset</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Model</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Created</th>
                <th className="text-right font-semibold px-4 py-3">Credits</th>
                <th className="text-right font-semibold px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {visible.map((g) => {
                const isFav = g.favorite || g.isFavorite
                return (
                  <tr key={g.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setActive(g)} className="flex items-center gap-3 text-left cursor-pointer">
                        <span className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900">
                          <MediaThumb type={g.type} src={g.src} poster={g.poster} alt={g.title} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-white truncate">{g.title}</span>
                          <span className="block text-[11px] text-neutral-400">{g.tool} • {g.dimensions}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-300 hidden md:table-cell">{g.model}</td>
                    <td className="px-4 py-3 text-xs text-neutral-400 hidden sm:table-cell">{formatDateTime(g.createdAt)}</td>
                    <td className="px-4 py-3 text-xs text-right font-semibold text-white">{g.credits}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => toggleFavorite(g.id)} aria-label="Toggle favorite" className="p-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer">
                          <Heart className={cn('w-4 h-4', isFav ? 'fill-rose-500 text-rose-500' : 'text-neutral-500 hover:text-neutral-300')} />
                        </button>
                        <a
                          href={g.src}
                          download={fileName(g)}
                          onClick={() => handleDownloadClick(g)}
                          aria-label={`Download ${g.title}`}
                          className="p-1.5 rounded-lg hover:bg-neutral-800 text-cyan-400"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button type="button" onClick={() => setPendingDelete(g)} aria-label={`Delete ${g.title}`} className="p-1.5 rounded-lg hover:bg-rose-950/30 text-neutral-400 hover:text-rose-400 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      )}

      {/* Preview / details modal */}
      <Modal theme="dark" isOpen={!!active} onClose={() => setActive(null)} title={active?.title} description={active ? `${active.tool} • ${formatDateTime(active.createdAt)}` : ''} className="max-w-3xl">
        {active && (
          <div className="space-y-4 text-white">
            <div className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center max-h-[420px]">
              {active.type === 'video' ? (
                <video src={active.src} poster={active.poster || undefined} controls autoPlay muted loop className="max-h-[420px] w-full object-contain" />
              ) : (
                <img src={active.src} alt={active.title} className="max-h-[420px] w-auto object-contain" />
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-neutral-800">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1">
                <span>Prompt</span>
                <button type="button" onClick={() => copyPrompt(active.prompt)} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal cursor-pointer">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">{active.prompt}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                ['Model', active.model],
                ['Dimensions', `${active.dimensions} (${active.aspect})`],
                ['Seed', active.seed],
                ['Steps / CFG', `${active.steps} / ${active.cfg}`],
                ['Credits used', active.credits],
                ['File size', formatBytes(active.sizeBytes)],
                ['Type', active.type === 'video' ? `Video • ${active.duration || '5s'}` : 'Image'],
                ['ID', active.id]
              ].map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-[#080B14] border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px] font-semibold uppercase">{k}</span>
                  <span className="font-semibold text-white break-words">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" leftIcon={Heart} onClick={() => toggleFavorite(active.id)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
                  {(active.favorite || active.isFavorite) ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Link to={active.type === 'video' ? '/dashboard/video-generator' : '/dashboard/image-generator'}>
                  <Button variant="outline" size="sm" leftIcon={Wand2} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">Open in studio</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" leftIcon={Trash2} onClick={() => setPendingDelete(active)}>Delete</Button>
                <a
                  href={active.src}
                  download={fileName(active)}
                  onClick={() => handleDownloadClick(active)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal theme="dark" isOpen={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete generation?" description="This action soft-deletes the visual asset from your library.">
        {pendingDelete && (
          <div className="space-y-4 text-white">
            <p className="text-sm text-neutral-300">"<strong>{pendingDelete.title}</strong>" will be removed from your library view.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPendingDelete(null)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">Cancel</Button>
              <Button variant="danger" size="sm" leftIcon={Trash2} onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default GenerationsPage
