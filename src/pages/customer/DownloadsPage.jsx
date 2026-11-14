import React, { useMemo, useState, useCallback } from 'react'
import {
  Download, Image as ImageIcon, Video, Search, FileText, Check,
  Clock, HardDrive, Trash2, ExternalLink, RefreshCw
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, SegmentedTabs, LightSelect, LightEmptyState,
  MediaThumb, Toast, StatCard
} from '../../components/studio/StudioUI'
import { DEMO_DOWNLOADS } from '../../mocks/customerDemoData'
import { formatBytes, formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

export function DownloadsPage() {
  const [downloads, setDownloads] = useState(DEMO_DOWNLOADS)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const formats = useMemo(() => Array.from(new Set(downloads.map((d) => d.format))), [downloads])

  const totalBytes = useMemo(() => downloads.reduce((acc, d) => acc + d.sizeBytes, 0), [downloads])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return downloads.filter((d) => {
      if (typeFilter !== 'all' && d.type !== typeFilter) return false
      if (formatFilter !== 'all' && d.format !== formatFilter) return false
      if (q && !`${d.name} ${d.source}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [downloads, query, typeFilter, formatFilter])

  const handleClearHistory = () => {
    setDownloads([])
    setToast({ message: 'Download history cleared from this demo session.' })
  }

  const handleDeleteItem = (id) => {
    setDownloads(downloads.filter((d) => d.id !== id))
    setToast({ message: 'Record removed from download history.' })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
          sub="Stored in browser history"
          accent="cyan"
        />
        <StatCard
          icon={HardDrive}
          label="Total Bandwidth"
          value={formatBytes(totalBytes)}
          sub="Sample file footprint"
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

      <Panel className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search exports by filename, tool source…"
            className="flex-1 max-w-md"
          />
          <div className="flex items-center gap-2">
            <LightSelect
              label="Format"
              value={formatFilter}
              onChange={setFormatFilter}
              options={[{ value: 'all', label: 'All Formats' }, ...formats.map((f) => ({ value: f, label: f }))]}
            />
            <SegmentedTabs
              size="sm"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'image', label: 'Images', icon: ImageIcon },
                { value: 'video', label: 'Videos', icon: Video }
              ]}
            />
          </div>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <LightEmptyState
          icon={Download}
          title="No download history"
          description={downloads.length === 0 ? 'Exports from the studio tools will appear here.' : 'No files match your search criteria.'}
          action={
            downloads.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setQuery(''); setTypeFilter('all'); setFormatFilter('all'); }}
                className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
              >
                Reset Filters
              </Button>
            )
          }
        />
      ) : (
        <Panel className="p-0 overflow-x-auto">
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
