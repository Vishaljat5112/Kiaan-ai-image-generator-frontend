import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import {
  Download, Image as ImageIcon, Video, Search, FileText, Check,
  Clock, HardDrive, Trash2, ExternalLink, RefreshCw, ChevronDown
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, LightEmptyState,
  MediaThumb, Toast, StatCard
} from '../../components/studio/StudioUI'
import { formatBytes, formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'
import { api } from '../../services/api'

const DEFAULT_FORMATS = ['JPG', 'PNG', 'WEBP', 'MP4']

export function DownloadsPage() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false)
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)
  const formatMenuRef = useRef(null)
  const typeMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target)) {
        setIsFormatMenuOpen(false)
      }
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target)) {
        setIsTypeMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsFormatMenuOpen(false)
        setIsTypeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Load downloads from real backend
  useEffect(() => {
    let isMounted = true

    async function fetchDownloads() {
      try {
        const res = await api.get('/customer/downloads')
        if (isMounted && res.data?.success) {
          setDownloads(res.data.data || [])
        }
      } catch (err) {
        // Handled gracefully
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDownloads()
    return () => { isMounted = false }
  }, [])

  const formats = useMemo(() => {
    const dynamic = downloads.map((d) => d.format).filter(Boolean)
    return Array.from(new Set([...DEFAULT_FORMATS, ...dynamic]))
  }, [downloads])

  const totalBytes = useMemo(() => downloads.reduce((acc, d) => acc + (d.sizeBytes || 0), 0), [downloads])

  const typeOptions = [
    { value: 'all', label: 'All', icon: null },
    { value: 'image', label: 'Images', icon: ImageIcon },
    { value: 'video', label: 'Videos', icon: Video }
  ]
  const selectedType = typeOptions.find((t) => t.value === typeFilter) || typeOptions[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return downloads.filter((d) => {
      if (typeFilter !== 'all' && d.type !== typeFilter) return false
      if (formatFilter !== 'all' && (d.format || '').toUpperCase() !== formatFilter.toUpperCase()) return false
      if (q && !`${d.name || ''} ${d.source || ''}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [downloads, query, typeFilter, formatFilter])

  const handleClearHistory = async () => {
    try {
      await api.delete('/customer/downloads')
      setDownloads([])
      setToast({ message: 'Download history cleared successfully.' })
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to clear download history.', tone: 'danger' })
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/customer/downloads/${id}`)
      setDownloads(downloads.filter((d) => d.id !== id))
      setToast({ message: 'Record removed from download history.' })
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to remove record.', tone: 'danger' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pt-1.5 sm:pt-2">
      <StudioPageHeader
        icon={Download}
        section="Asset Management"
        crumb="Downloads"
        title="Downloads"
        description="Review your exported production assets, file sizes and export formats."
        actions={
          downloads.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={Trash2}
              onClick={handleClearHistory}
              className="text-neutral-300 border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 hover:text-rose-400 cursor-pointer"
            >
              Clear History
            </Button>
          )
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Download}
          label="Total Exports"
          value={downloads.length}
          sub="Logged export events"
          accent="cyan"
        />
        <StatCard
          icon={HardDrive}
          label="Total Bandwidth"
          value={formatBytes(totalBytes)}
          sub="Archived file footprint"
          accent="cyan"
        />
        <StatCard
          icon={Clock}
          label="Latest Export"
          value={downloads[0] ? formatDateTime(downloads[0].downloadedAt).split(',')[0] : 'None'}
          sub={downloads[0] ? downloads[0].name : 'No recent activity'}
          accent="pink"
        />
      </div>

      <Panel className="p-3.5 sm:p-4 relative z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search exports by filename, tool source…"
            className="flex-1 max-w-md [&>input]:h-[42px]"
          />
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* 1. All Formats Dropdown */}
            <div className="relative" ref={formatMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFormatMenuOpen((prev) => !prev)
                  setIsTypeMenuOpen(false)
                }}
                className={cn(
                  "h-[42px] px-3.5 rounded-xl bg-[#080B14] border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                  isFormatMenuOpen
                    ? "border-cyan-500 text-white"
                    : "border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white"
                )}
                aria-expanded={isFormatMenuOpen}
                aria-haspopup="true"
              >
                <span>{formatFilter === 'all' ? 'All Formats' : formatFilter}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200", isFormatMenuOpen && "rotate-180")} />
              </button>

              {isFormatMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 sm:left-0 top-full mt-1.5 w-44 rounded-xl bg-[#0D111C] border border-neutral-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    FORMAT
                  </div>
                  <div className="space-y-0.5 px-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFormatFilter('all')
                        setIsFormatMenuOpen(false)
                      }}
                      className={cn(
                        "w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                        formatFilter === 'all'
                          ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                          : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                      )}
                    >
                      <span>All Formats</span>
                      {formatFilter === 'all' && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                    {formats.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => {
                          setFormatFilter(f)
                          setIsFormatMenuOpen(false)
                        }}
                        className={cn(
                          "w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer",
                          formatFilter === f
                            ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40"
                            : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                        )}
                      >
                        <span>{f}</span>
                        {formatFilter === f && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. All / Type Dropdown (Images, Videos inside All dropdown) */}
            <div className="relative" ref={typeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsTypeMenuOpen((prev) => !prev)
                  setIsFormatMenuOpen(false)
                }}
                className={cn(
                  "h-[42px] px-3.5 rounded-xl bg-[#080B14] border text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                  isTypeMenuOpen
                    ? "border-cyan-500 text-white"
                    : "border-neutral-700/80 hover:border-cyan-500/50 text-neutral-200 hover:text-white"
                )}
                aria-expanded={isTypeMenuOpen}
                aria-haspopup="true"
              >
                {selectedType.icon && <selectedType.icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                <span>{selectedType.label}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ml-0.5", isTypeMenuOpen && "rotate-180")} />
              </button>

              {isTypeMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-[#0D111C] border border-neutral-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="space-y-0.5 px-1">
                    {typeOptions.map((opt) => {
                      const Icon = opt.icon
                      const isSelected = typeFilter === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setTypeFilter(opt.value)
                            setIsTypeMenuOpen(false)
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
                            <span className="truncate">{opt.label}</span>
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
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <LightEmptyState
          icon={Download}
          title="No download history"
          description={downloads.length === 0 ? 'Exports from the studio tools will appear here.' : 'No files match your search criteria.'}
          className="py-7 sm:py-8"
          action={
            downloads.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setQuery(''); setTypeFilter('all'); setFormatFilter('all'); }}
                className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 cursor-pointer"
              >
                Reset Filters
              </Button>
            )
          }
        />
      ) : (
        <Panel className="p-0 overflow-x-auto relative z-0">
          <table className="w-full text-sm">
            <thead className="bg-[#080B14] text-[11px] uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="text-left font-semibold px-4 py-3">File Name</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Tool Source</th>
                <th className="text-left font-semibold px-4 py-3">Format</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Size</th>
                <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Exported At</th>
                <th className="text-right font-semibold px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
                        <MediaThumb type={d.type} src={d.src} poster={d.thumb} alt={d.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{d.name}</p>
                        <p className="text-[10px] text-neutral-400 sm:hidden">{d.source} • {formatBytes(d.sizeBytes)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-300 hidden sm:table-cell">{d.source}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 uppercase">
                      {d.format}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-neutral-400 hidden md:table-cell">
                    {formatBytes(d.sizeBytes)}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400 hidden lg:table-cell">
                    {formatDateTime(d.downloadedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={d.src}
                        download={d.name}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(d.id)}
                        aria-label="Remove"
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default DownloadsPage
