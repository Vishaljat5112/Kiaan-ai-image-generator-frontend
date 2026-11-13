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
  { value: 'title', label: 'Title A�Z' }
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
          <SearchField value={query} onChange={setQuery} placeholder="Search by title, prompt or tool�" className="flex-1" />
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
            : <Button variant="outline" size="sm" onClick={resetFilters} className="text-neutral-700 border-neutral-300 hover:bg-neutral-100">Clear filters</Button>}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((g) => (
            <div key={g.id} className="group bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md hover:border-violet-300 transition-all">
              <button type="button" onClick={() => setActive(g)} className="relative block w-full aspect-square bg-neutral-100" aria-label={`Preview ${g.title}`}>
                <MediaThumb type={g.type} src={g.src} poster={g.poster} alt={g.title} className="group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/90 text-neutral-800 border border-neutral-200">
                  {g.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {g.type === 'video' ? g.duration : g.aspect}
                </span>
                {g.type === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"><Play className="w-5 h-5" /></span>
                  </span>
                )}
              </button>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{g.title}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{g.tool} � {formatDateTime(g.createdAt)}</p>
                  </div>
                  <button type="button" onClick={() => toggleFavorite(g.id)} aria-label={g.favorite ? 'Remove favorite' : 'Add favorite'} className="p-1 rounded-lg hover:bg-neutral-100">
                    <Heart className={cn('w-4 h-4', g.favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-400')} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <a href={g.src} download={fileName(g)} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-600 hover:bg-violet-700 text-white">
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  <button type="button" onClick={() => setPendingDelete(g)} aria-label={`Delete ${g.title}`} className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50">
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
            <thead className="bg-neutral-50 text-[11px] uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Asset</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Model</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Created</th>
                <th className="text-right font-semibold px-4 py-3">Credits</th>
                <th className="text-right font-semibold px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {visible.map((g) => (
                <tr key={g.id} className="hover:bg-neutral-50/70">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setActive(g)} className="flex items-center gap-3 text-left">
                      <span className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <MediaThumb type={g.type} src={g.src} poster={g.poster} alt={g.title} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-neutral-900 truncate">{g.title}</span>
                        <span className="block text-[11px] text-neutral-500">{g.tool} � {g.dimensions}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-700 hidden md:table-cell">{g.model}</td>
                  <td className="px-4 py-3 text-xs text-neutral-600 hidden sm:table-cell">{formatDateTime(g.createdAt)}</td>
                  <td className="px-4 py-3 text-xs text-right font-semibold text-neutral-900">{g.credits}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => toggleFavorite(g.id)} aria-label="Toggle favorite" className="p-1.5 rounded-lg hover:bg-neutral-100">
                        <Heart className={cn('w-4 h-4', g.favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-400')} />
                      </button>
                      <a href={g.src} download={fileName(g)} aria-label={`Download ${g.title}`} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600"><Download className="w-4 h-4" /></a>
                      <button type="button" onClick={() => setPendingDelete(g)} aria-label={`Delete ${g.title}`} className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {/* Preview / details modal */}
      <Modal theme="light" isOpen={!!active} onClose={() => setActive(null)} title={active?.title} description={active ? `${active.tool} � ${formatDateTime(active.createdAt)}` : ''} className="max-w-3xl">
        {active && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center max-h-[420px]">
              {active.type === 'video' ? (
                <video src={active.src} poster={active.poster || undefined} controls autoPlay muted loop className="max-h-[420px] w-full object-contain" />
              ) : (
                <img src={active.src} alt={active.title} className="max-h-[420px] w-auto object-contain" />
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Prompt</span>
                <button type="button" onClick={() => copyPrompt(active.prompt)} className="text-violet-600 hover:text-violet-700 flex items-center gap-1 font-normal">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-neutral-800 leading-relaxed">{active.prompt}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                ['Model', active.model],
                ['Dimensions', `${active.dimensions} (${active.aspect})`],
                ['Seed', active.seed],
                ['Steps / CFG', `${active.steps} / ${active.cfg}`],
                ['Credits used', active.credits],
                ['File size', formatBytes(active.sizeBytes)],
                ['Type', active.type === 'video' ? `Video � ${active.duration}` : 'Image'],
                ['ID', active.id]
              ].map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] font-semibold uppercase">{k}</span>
                  <span className="font-semibold text-neutral-900 break-words">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" leftIcon={Heart} onClick={() => toggleFavorite(active.id)} className="text-neutral-700 border-neutral-300 hover:bg-neutral-100">
                  {active.favorite ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Link to={active.type === 'video' ? '/dashboard/video-generator' : '/dashboard/image-generator'}>
                  <Button variant="outline" size="sm" leftIcon={Wand2} className="text-neutral-700 border-neutral-300 hover:bg-neutral-100">Open in studio</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" leftIcon={Trash2} onClick={() => setPendingDelete(active)}>Delete</Button>
                <a href={active.src} download={fileName(active)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal theme="light" isOpen={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Delete generation?" description="Demo only � this removes the item from the current browser session.">
        {pendingDelete && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-700">"<strong>{pendingDelete.title}</strong>" will be removed from your library view.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPendingDelete(null)} className="text-neutral-700 border-neutral-300 hover:bg-neutral-100">Cancel</Button>
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
