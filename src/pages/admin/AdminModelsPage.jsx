import React, { useEffect, useState, useCallback } from 'react'
import {
  Boxes,
  RefreshCw,
  Edit2,
  Check,
  X,
  Coins,
  Cpu,
  Power
} from 'lucide-react'
import { api } from '../../services/api'
import { formatNumber } from '../../utils/format'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { FieldLabel, lightInputClass, Toast } from '../../components/studio/StudioUI'

export function AdminModelsPage() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingModel, setEditingModel] = useState(null)
  const [costInput, setCostInput] = useState('')
  const [stepsInput, setStepsInput] = useState('')
  const [vramInput, setVramInput] = useState('')
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/models')
      if (res.data?.data) {
        setModels(res.data.data)
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load models', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const handleToggleActive = async (model) => {
    try {
      await api.patch(`/admin/models/${model.id}`, { isActive: !model.isActive })
      setToast({ message: `${model.name} ${!model.isActive ? 'activated' : 'deactivated'}` })
      fetchModels()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Toggle failed', type: 'error' })
    }
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingModel) return
    try {
      await api.patch(`/admin/models/${editingModel.id}`, {
        baseCreditCost: parseInt(costInput, 10),
        defaultSteps: parseInt(stepsInput, 10),
        vramRequiredGb: parseInt(vramInput, 10)
      })
      setToast({ message: `${editingModel.name} configuration updated` })
      setEditingModel(null)
      fetchModels()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Update failed', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Boxes className="w-3.5 h-3.5" />
              Inference Weights
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Model Catalog & Credit Rates</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure generation credit tariffs, default sampling steps, VRAM allocation requirements, and model availability.
          </p>
        </div>

        <button
          onClick={fetchModels}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {models.map((model) => (
          <div
            key={model.id}
            className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white">{model.name}</h3>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{model.id}</div>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    model.type === 'VIDEO'
                      ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                >
                  {model.type}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Base Credit Tariff</span>
                  <span className="font-semibold text-cyan-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {model.baseCreditCost} credits
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Default Sampling Steps</span>
                  <span className="text-neutral-200 font-medium">{model.defaultSteps} steps</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Minimum VRAM</span>
                  <span className="text-neutral-200 font-medium">{model.vramRequiredGb} GB</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Recommended CFG</span>
                  <span className="text-neutral-200 font-medium">{Number(model.recommendedCfg)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleActive(model)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                  model.isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                <Power className="w-3 h-3" />
                <span>{model.isActive ? 'Active' : 'Disabled'}</span>
              </button>

              <button
                onClick={() => {
                  setEditingModel(model)
                  setCostInput(String(model.baseCreditCost))
                  setStepsInput(String(model.defaultSteps))
                  setVramInput(String(model.vramRequiredGb))
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
              >
                <Edit2 className="w-3 h-3 text-neutral-400" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Model Modal */}
      <Modal
        theme="dark"
        isOpen={!!editingModel}
        onClose={() => setEditingModel(null)}
        title={`Configure ${editingModel?.name || ''}`}
        description="Modify inference credit tariffs and minimum hardware allocations."
        className="max-w-md bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="m-cost">Base Credit Tariff *</FieldLabel>
            <input
              id="m-cost"
              type="number"
              required
              value={costInput}
              onChange={(e) => setCostInput(e.target.value)}
              className={lightInputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="m-steps">Default Steps</FieldLabel>
              <input
                id="m-steps"
                type="number"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="m-vram">Min VRAM (GB)</FieldLabel>
              <input
                id="m-vram"
                type="number"
                value={vramInput}
                onChange={(e) => setVramInput(e.target.value)}
                className={lightInputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEditingModel(null)}
              className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminModelsPage
