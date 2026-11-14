import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban, Plus, Search, Grid3x3, List, MoreVertical, Edit2, Trash2,
  FolderOpen, Sparkles, ExternalLink, Calendar, User, ArrowRight
} from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, SearchField, SegmentedTabs, LightSelect, LightEmptyState,
  MediaThumb, Toast, FieldLabel, lightInputClass
} from '../../components/studio/StudioUI'
import { PROJECT_COLORS } from '../../mocks/customerDemoData'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'
import { api } from '../../services/api'

const COLOR_CLASSES = {
  violet: 'bg-violet-500 text-violet-100 border-violet-600',
  cyan: 'bg-cyan-500 text-cyan-100 border-cyan-600',
  amber: 'bg-amber-500 text-amber-100 border-amber-600',
  emerald: 'bg-emerald-500 text-emerald-100 border-emerald-600',
  rose: 'bg-rose-500 text-rose-100 border-rose-600'
}

const COLOR_BADGE = {
  violet: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
  cyan: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
  amber: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
  emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
  rose: 'bg-rose-950/70 text-rose-300 border-rose-800/60'
}

export function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [view, setView] = useState('grid')

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [viewProject, setViewProject] = useState(null)
  const [deleteProject, setDeleteProject] = useState(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formClient, setFormClient] = useState('')
  const [formColor, setFormColor] = useState('violet')
  const [formStatus, setFormStatus] = useState('Active')

  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  // Fetch real projects & assets on mount
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [projRes, assetsRes] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/assets/generations')
        ])

        if (isMounted) {
          if (projRes.status === 'fulfilled' && projRes.value.data?.success) {
            setProjects(projRes.value.data.data || [])
          }
          if (assetsRes.status === 'fulfilled' && assetsRes.value.data?.success) {
            setGenerations(assetsRes.value.data.data || [])
          }
        }
      } catch (err) {
        // Handled gracefully
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => { isMounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (q && !`${p.name} ${p.description || ''} ${p.client || ''}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [projects, query, statusFilter])

  const openCreate = () => {
    setFormName('')
    setFormDesc('')
    setFormClient('')
    setFormColor('violet')
    setFormStatus('Active')
    setCreateModalOpen(true)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formName.trim()) return

    try {
      const res = await api.post('/projects', {
        name: formName.trim(),
        description: formDesc.trim(),
        client: formClient.trim() || 'Internal',
        color: formColor
      })

      if (res.data?.success && res.data?.data) {
        const newP = res.data.data
        setProjects([newP, ...projects])
        setCreateModalOpen(false)
        setToast({ message: `Created project "${newP.name}"` })
      } else {
        setToast({ message: res.data?.error?.message || 'Failed to create project', tone: 'danger' })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to create project', tone: 'danger' })
    }
  }

  const openEdit = (p) => {
    setEditProject(p)
    setFormName(p.name)
    setFormDesc(p.description || '')
    setFormClient(p.client || '')
    setFormColor(p.color || 'violet')
    setFormStatus(p.status || 'Active')
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!formName.trim() || !editProject) return

    try {
      const res = await api.patch(`/projects/${editProject.id}`, {
        name: formName.trim(),
        description: formDesc.trim(),
        client: formClient.trim() || 'Internal',
        color: formColor
      })

      if (res.data?.success && res.data?.data) {
        const updated = res.data.data
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)))
        if (viewProject?.id === updated.id) {
          setViewProject(updated)
        }
        setEditProject(null)
        setToast({ message: `Updated project "${updated.name}"` })
      } else {
        setToast({ message: res.data?.error?.message || 'Failed to update project', tone: 'danger' })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to update project', tone: 'danger' })
    }
  }

  const handleDelete = async () => {
    if (!deleteProject) return

    try {
      const res = await api.delete(`/projects/${deleteProject.id}`)
      if (res.data?.success) {
        setProjects(projects.filter((p) => p.id !== deleteProject.id))
        if (viewProject?.id === deleteProject.id) setViewProject(null)
        setToast({ message: `Deleted project "${deleteProject.name}"` })
        setDeleteProject(null)
      } else {
        setToast({ message: res.data?.error?.message || 'Failed to delete project', tone: 'danger' })
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to delete project', tone: 'danger' })
    }
  }

  const getAssetsForProject = (pid) => generations.filter((g) => g.projectId === pid)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <StudioPageHeader
        icon={FolderKanban}
        section="Asset Management"
        crumb="My Projects"
        title="My Projects"
        description="Organize generations into dedicated client and campaign workspaces."
        actions={
          <Button variant="gradient" leftIcon={Plus} onClick={openCreate}>
            Create Project
          </Button>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <SearchField value={query} onChange={setQuery} placeholder="Search projects by name, client, description…" className="flex-1 max-w-md" />
          <div className="flex items-center gap-2">
            <LightSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'In Review', label: 'In Review' },
                { value: 'Archived', label: 'Archived' }
              ]}
            />
            <SegmentedTabs
              size="sm"
              value={view}
              onChange={setView}
              options={[{ value: 'grid', label: 'Grid', icon: Grid3x3 }, { value: 'list', label: 'List', icon: List }]}
            />
          </div>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <LightEmptyState
          icon={FolderOpen}
          title="No projects found"
          description={projects.length === 0 ? 'Create your first project to organize your visual assets.' : 'No projects match your current filters.'}
          action={
            <Button variant="gradient" size="sm" leftIcon={Plus} onClick={openCreate}>
              Create Project
            </Button>
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const assets = getAssetsForProject(p.id)
            return (
              <div
                key={p.id}
                className="bg-[#0D111C]/90 backdrop-blur-md rounded-2xl border border-neutral-800/90 shadow-sm overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all flex flex-col justify-between text-white"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', COLOR_BADGE[p.color] || COLOR_BADGE.violet)}>
                      <span className={cn('w-2 h-2 rounded-full', COLOR_CLASSES[p.color] || COLOR_CLASSES.violet)} />
                      {p.client}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-0.5 rounded bg-neutral-800">
                      {p.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    {p.description || 'No description provided.'}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Visual Assets</span>
                      <span className="font-semibold text-white">{assets.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Last Updated</span>
                      <span>{formatDate(p.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#080B14] border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs justify-center"
                    leftIcon={FolderOpen}
                    onClick={() => setViewProject(p)}
                  >
                    Open Workspace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1.5 text-neutral-400 hover:text-white border-neutral-700 hover:bg-neutral-800"
                    onClick={() => openEdit(p)}
                    aria-label="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1.5 text-neutral-400 hover:text-rose-400 border-neutral-700 hover:bg-neutral-800"
                    onClick={() => setDeleteProject(p)}
                    aria-label="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Panel className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#080B14] border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="py-3 px-4 font-medium">Project Name</th>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Assets</th>
                <th className="py-3 px-4 font-medium">Updated</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filtered.map((p) => {
                const assets = getAssetsForProject(p.id)
                return (
                  <tr key={p.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', COLOR_CLASSES[p.color] || COLOR_CLASSES.violet)} />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{p.client}</td>
                    <td className="py-3 px-4 text-neutral-300">{assets.length} items</td>
                    <td className="py-3 px-4 text-neutral-400">{formatDate(p.updatedAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setViewProject(p)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300" onClick={() => setDeleteProject(p)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      )}

      {/* Create Modal */}
      <Modal theme="dark" isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Project" description="Organize visual assets into campaigns, client work, or creative experiments.">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <FieldLabel htmlFor="project-name">Project Name *</FieldLabel>
            <input
              id="project-name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Autumn Brand Launch"
              className={lightInputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="project-desc">Description</FieldLabel>
            <textarea
              id="project-desc"
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Brief summary of creative objectives and style direction…"
              className={lightInputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="project-client">Client / Brand</FieldLabel>
              <input
                id="project-client"
                type="text"
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
                placeholder="e.g. Acme Corp"
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="project-status">Status</FieldLabel>
              <select
                id="project-status"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className={lightInputClass}
              >
                <option value="Active" className="bg-neutral-900 text-white">Active</option>
                <option value="In Review" className="bg-neutral-900 text-white">In Review</option>
                <option value="Archived" className="bg-neutral-900 text-white">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <FieldLabel>Color Tag</FieldLabel>
            <div className="flex items-center gap-2 pt-1">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormColor(c)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-all border-2 cursor-pointer',
                    COLOR_CLASSES[c],
                    formColor === c ? 'ring-2 ring-offset-2 ring-cyan-500 scale-110' : 'opacity-80'
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal theme="dark" isOpen={!!editProject} onClose={() => setEditProject(null)} title="Edit Project" description="Update project metadata and settings.">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="edit-name">Project Name *</FieldLabel>
            <input
              id="edit-name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className={lightInputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-desc">Description</FieldLabel>
            <textarea
              id="edit-desc"
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className={lightInputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="edit-client">Client / Brand</FieldLabel>
              <input
                id="edit-client"
                type="text"
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="edit-status">Status</FieldLabel>
              <select
                id="edit-status"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className={lightInputClass}
              >
                <option value="Active" className="bg-neutral-900 text-white">Active</option>
                <option value="In Review" className="bg-neutral-900 text-white">In Review</option>
                <option value="Archived" className="bg-neutral-900 text-white">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <FieldLabel>Color Tag</FieldLabel>
            <div className="flex items-center gap-2 pt-1">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormColor(c)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-all border-2 cursor-pointer',
                    COLOR_CLASSES[c],
                    formColor === c ? 'ring-2 ring-offset-2 ring-cyan-500 scale-110' : 'opacity-80'
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setEditProject(null)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Project Details Modal */}
      <Modal theme="dark" isOpen={!!viewProject} onClose={() => setViewProject(null)} title={viewProject?.name} description={(viewProject?.client || '') + ' • ' + (viewProject?.status || 'Active')} className="max-w-2xl">
        {viewProject && (
          <div className="space-y-4 text-white">
            <p className="text-xs text-neutral-300">{viewProject.description || 'No description.'}</p>
            <div className="p-3 bg-[#080B14] rounded-xl border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Created {formatDate(viewProject.createdAt)}</span>
              <span>Updated {formatDate(viewProject.updatedAt)}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Project Visual Assets ({getAssetsForProject(viewProject.id).length})
              </h4>
              {getAssetsForProject(viewProject.id).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getAssetsForProject(viewProject.id).map((a) => (
                    <div key={a.id} className="rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900">
                      <div className="aspect-square">
                        <MediaThumb type={a.type} src={a.src} poster={a.poster} alt={a.title} />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-white truncate">{a.title}</p>
                        <p className="text-[10px] text-neutral-400">{a.tool}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl border border-dashed border-neutral-800 bg-[#080B14]">
                  <p className="text-xs text-neutral-400">No assets currently assigned to this project.</p>
                  <Link to="/dashboard/image-generator">
                    <Button variant="outline" size="sm" className="mt-3 text-xs text-neutral-300 border-neutral-700 hover:bg-neutral-800">
                      Create Assets
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <Button variant="outline" size="sm" onClick={() => setViewProject(null)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
                Close
              </Button>
              <Button variant="gradient" size="sm" onClick={() => { openEdit(viewProject); setViewProject(null); }}>
                Edit Details
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal theme="dark" isOpen={!!deleteProject} onClose={() => setDeleteProject(null)} title="Delete Project?" description="This permanently removes the project workspace.">
        {deleteProject && (
          <div className="space-y-4 text-white">
            <p className="text-sm text-neutral-300">
              Are you sure you want to delete "<strong>{deleteProject.name}</strong>"? Visual assets in this project will not be destroyed.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteProject(null)} className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
                Cancel
              </Button>
              <Button variant="danger" size="sm" leftIcon={Trash2} onClick={handleDelete}>
                Delete Project
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default ProjectsPage
