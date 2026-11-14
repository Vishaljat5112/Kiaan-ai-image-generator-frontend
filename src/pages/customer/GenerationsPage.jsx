import React, { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Image as ImageIcon, Video, Heart, Download, Trash2, Grid3x3, List, Copy, Check, Wand2, Sparkles, Play
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, SegmentedTabs, LightSelect, LightEmptyState, MediaThumb, Toast
} from '../../components/studio/StudioUI'
import { DEMO_GENERATIONS } from '../../mocks/customerDemoData'
import { formatBytes, formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'credits', label: 'Most credits' },
  { value: 'title', label: 'Title A–Z' }
]

export function GenerationsPage() {
  const [items, setItems] = useState(DEMO_GENERATIONS)
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

  const models = useMemo(() => Array.from(new Set(items.map((i) => i.model))), [items])

  const counts = useMemo(() => ({
    all: items.length,
    image: items.filter((i) => i.type === 'image').length,
    video: items.filter((i) => i.type === 'video').length,
    favorite: items.filter((i) => i.favorite).length
  }), [items])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = items.filter((i) => {
      if (typeFilter === 'favorite' && !i.favorite) return false
      if ((typeFilter === 'image' || typeFilter === 'video') && i.type !== typeFilter) return false
      if (modelFilter !== 'all' && i.model !== modelFilter) return false
      if (q && !`${i.title} ${i.prompt} ${i.tool}`.toLowerCase().includes(q)) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'credits') return b.credits - a.credits
      if (sort === 'title') return a.title.localeCompare(b.title)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return list
  }, [items, query, typeFilter, modelFilter, sort])

  const toggleFavorite = (id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, favorite: !prev.favorite } : prev))
  }

  const confirmDelete = () => {
    setItems((prev) => prev.filter((i) => i.id !== pendingDelete.id))
    setToast({ message: `"${pendingDelete.title}" removed from this demo session.` })
    if (active?.id === pendingDelete.id) setActive(null)
    setPendingDelete(null)
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

  const fileName = (g) => `${g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${g.type === 'video' ? 'mp4' : 'jpg'}`

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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

      <Panel className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <SearchField value={query} onChange={setQuery} placeholder="Search by title, prompt or tool…" className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            <LightSelect
              label="Filter by model"
              value={modelFilter}
              onChange={setModelFilter}
              options={[{ value: 'all', label: 'All models' }, ...models.map((m) => ({ value: m, label: m }))]}
            />
            <LightSelect label="Sort" value={sort} onChange={setSort} options={SORTS} />
            <SegmentedTabs
              size="sm"
              value={view}
              onChange={setView}
              options={[{ value: 'grid', label: 'Grid', icon: Grid3x3 }, { value: 'list', label: 'List', icon: List }]}
            />
          </div>
        </div>
        <SegmentedTabs
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All', count: counts.all },
            { value: 'image', label: 'Images', icon: ImageIcon, count: counts.image },
            { value: 'video', label: 'Videos', icon: Video, count: counts.video },
            { value: 'favorite', label: 'Favorites', icon: Heart, count: counts.favorite }
          ]}
        />
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
          {visible.map((g) => (
            <div key={g.id} className="group bg-[#0D111C]/90 backdrop-blur-md rounded-2xl border border-neutral-800/90 shadow-sm overflow-hidden hover:shadow-lg hover:border-cyan-500/40 transition-all text-white">
              <button type="button" onClick={() => setActive(g)} className="relative block w-full aspect-square bg-neutral-900 cursor-pointer" aria-label={`Preview ${g.title}`}>
                <MediaThumb type={g.type} src={g.src} poster={g.poster} alt={g.title} className="group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-900/90 text-neutral-200 border border-neutral-700">
                  {g.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {g.type === 'video' ? g.duration : g.aspect}
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
                  <button type="button" onClick={() => toggleFavorite(g.id)} aria-label={g.favorite ? 'Remove favorite' : 'Add favorite'} className="p-1 rounded-lg hover:bg-neutral-800 cursor-pointer">
                    <Heart className={cn('w-4 h-4 transition-colors', g.favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-500 hover:text-neutral-300')} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <a href={g.src} download={fileName(g)} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800/60 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  <button type="button" onClick={() => setPendingDelete(g)} aria-label={`Delete ${g.title}`} className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-900/60 hover:bg-rose-950/30 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              {visible.map((g) => (
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
                        <Heart className={cn('w-4 h-4', g.favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-500 hover:text-neutral-300')} />
                      </button>
                      <a href={g.src} download={fileName(g)} aria-label={`Download ${g.title}`} className="p-1.5 rounded-lg hover:bg-neutral-800 text-cyan-400"><Download className="w-4 h-4" /></a>
                      <button type="button" onClick={() => setPendingDelete(g)} aria-label={`Delete ${g.title}`} className="p-1.5 rounded-lg hover:bg-rose-950/30 text-neutral-400 hover:text-rose-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
                ['Type', active.type === 'video' ? `Video • ${active.duration}` : 'Image'],
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
                  {active.favorite ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Link to={active.type === 'video' ? '/dashboard/video-generator' : '/dashboard/image-generator'}>
                  <Button variant="outline" size="sm" leftIcon={Wand2} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">Open in studio</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" leftIcon={Trash2} onClick={() => setPendingDelete(active)}>Delete</Button>
                <a href={active.src} download={fileName(active)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal theme="dark" isOpen={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete generation?" description="Demo only — this removes the item from the current browser session.">
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
