import React, { useMemo, useState, useCallback } from 'react'
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
import { DEMO_PROJECTS, DEMO_GENERATIONS, PROJECT_COLORS } from '../../mocks/customerDemoData'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

const COLOR_CLASSES = {
  violet: 'bg-violet-500 text-violet-100 border-violet-600',
  cyan: 'bg-cyan-500 text-cyan-100 border-cyan-600',
  amber: 'bg-amber-500 text-amber-100 border-amber-600',
  emerald: 'bg-emerald-500 text-emerald-100 border-emerald-600',
  rose: 'bg-rose-500 text-rose-100 border-rose-600'
}

const COLOR_BADGE = {
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200'
}

export function ProjectsPage() {
  const [projects, setProjects] = useState(DEMO_PROJECTS)
  const [generations] = useState(DEMO_GENERATIONS)
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (q && !`${p.name} ${p.description} ${p.client}`.toLowerCase().includes(q)) return false
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

  const handleCreate = (e) => {
    e.preventDefault()
    if (!formName.trim()) return
    const newP = {
      id: `p-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      client: formClient.trim() || 'Internal',
      color: formColor,
      status: formStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setProjects([newP, ...projects])
    setCreateModalOpen(false)
    setToast({ message: `Created project "${newP.name}"` })
  }

  const openEdit = (p) => {
    setEditProject(p)
    setFormName(p.name)
    setFormDesc(p.description)
    setFormClient(p.client)
    setFormColor(p.color)
    setFormStatus(p.status)
  }

  const handleEdit = (e) => {
    e.preventDefault()
    if (!formName.trim() || !editProject) return
    setProjects(projects.map((p) => (p.id === editProject.id ? {
      ...p,
      name: formName.trim(),
      description: formDesc.trim(),
      client: formClient.trim() || 'Internal',
      color: formColor,
      status: formStatus,
      updatedAt: new Date().toISOString()
    } : p)))
    if (viewProject?.id === editProject.id) {
      setViewProject({
        ...viewProject,
        name: formName.trim(),
        description: formDesc.trim(),
        client: formClient.trim() || 'Internal',
        color: formColor,
        status: formStatus
      })
    }
    setEditProject(null)
    setToast({ message: `Updated project "${formName.trim()}"` })
  }

  const handleDelete = () => {
    if (!deleteProject) return
    setProjects(projects.filter((p) => p.id !== deleteProject.id))
    if (viewProject?.id === deleteProject.id) setViewProject(null)
    setToast({ message: `Deleted project "${deleteProject.name}"` })
    setDeleteProject(null)
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
          <SearchField value={query} onChange={setQuery} placeholder="Search projects by name, client, description�" className="flex-1 max-w-md" />
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
                className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:border-violet-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', COLOR_BADGE[p.color] || COLOR_BADGE.violet)}>
                      <span className={cn('w-2 h-2 rounded-full', COLOR_CLASSES[p.color] || COLOR_CLASSES.violet)} />
                      {p.client}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 min-h-[32px]">
                    {p.description || 'No description provided.'}
                  </p>

                  {/* Asset thumbnail strip */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                      <span>Assets in project</span>
                      <span className="font-semibold text-neutral-800">{assets.length} items</span>
                    </div>
                    {assets.length > 0 ? (
                      <div className="grid grid-cols-4 gap-1.5 h-14">
                        {assets.slice(0, 4).map((a) => (
                          <div key={a.id} className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                            <MediaThumb type={a.type} src={a.src} poster={a.poster} alt={a.title} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-14 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center text-[11px] text-neutral-400">
                        No assets assigned yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    Updated {formatDate(p.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      aria-label="Edit project"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteProject(p)}
                      aria-label="Delete project"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewProject(p)}
                      className="text-xs py-1 px-2.5 ml-1 text-neutral-700 border-neutral-300"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Panel className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Project</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Client</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Assets</th>
                <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Updated</th>
                <th className="text-right font-semibold px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((p) => {
                const count = getAssetsForProject(p.id).length
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70">
                    <td className="px-4 py-3">
                      <div>
                        <button
                          type="button"
                          onClick={() => setViewProject(p)}
                          className="font-bold text-xs text-neutral-900 hover:text-violet-600 text-left"
                        >
                          {p.name}
                        </button>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{p.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-700 hidden md:table-cell">{p.client}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-700 hidden sm:table-cell">{count} items</td>
                    <td className="px-4 py-3 text-xs text-neutral-500 hidden lg:table-cell">{formatDate(p.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewProject(p)} className="text-xs py-1">View</Button>
                        <button type="button" onClick={() => openEdit(p)} aria-label="Edit" className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setDeleteProject(p)} aria-label="Delete" className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50">
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Create Modal */}
      <Modal theme="light" isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Project" description="Projects organize your visual assets by client, campaign, or concept.">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <FieldLabel htmlFor="project-name">Project Name *</FieldLabel>
            <input
              id="project-name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Q4 Brand Identity Campaign"
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
              placeholder="Brief summary of creative objectives and style direction�"
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
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Archived">Archived</option>
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
                    'w-7 h-7 rounded-full transition-all border-2',
                    COLOR_CLASSES[c],
                    formColor === c ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : 'opacity-80'
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)} className="text-neutral-700 border-neutral-300">
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal theme="light" isOpen={!!editProject} onClose={() => setEditProject(null)} title="Edit Project" description="Update project metadata and settings.">
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
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Archived">Archived</option>
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
                    'w-7 h-7 rounded-full transition-all border-2',
                    COLOR_CLASSES[c],
                    formColor === c ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : 'opacity-80'
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setEditProject(null)} className="text-neutral-700 border-neutral-300">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Project Details Modal */}
      <Modal theme="light" isOpen={!!viewProject} onClose={() => setViewProject(null)} title={viewProject?.name} description={viewProject?.client + ' � ' + viewProject?.status} className="max-w-2xl">
        {viewProject && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-600">{viewProject.description || 'No description.'}</p>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
              <span>Created {formatDate(viewProject.createdAt)}</span>
              <span>Updated {formatDate(viewProject.updatedAt)}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Project Visual Assets ({getAssetsForProject(viewProject.id).length})
              </h4>
              {getAssetsForProject(viewProject.id).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getAssetsForProject(viewProject.id).map((a) => (
                    <div key={a.id} className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                      <div className="aspect-square">
                        <MediaThumb type={a.type} src={a.src} poster={a.poster} alt={a.title} />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-neutral-900 truncate">{a.title}</p>
                        <p className="text-[10px] text-neutral-500">{a.tool}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
                  <p className="text-xs text-neutral-500">No assets currently assigned to this project.</p>
                  <Link to="/dashboard/image-generator">
                    <Button variant="outline" size="sm" className="mt-3 text-xs">
                      Create Assets
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <Button variant="outline" size="sm" onClick={() => setViewProject(null)} className="text-neutral-700 border-neutral-300">
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={() => { openEdit(viewProject); setViewProject(null); }}>
                Edit Details
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal theme="light" isOpen={!!deleteProject} onClose={() => setDeleteProject(null)} title="Delete Project?" description="Demo only � this removes the project from the current browser session.">
        {deleteProject && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-700">
              Are you sure you want to delete "<strong>{deleteProject.name}</strong>"? Visual assets in this project will not be destroyed.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteProject(null)} className="text-neutral-700 border-neutral-300">
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
