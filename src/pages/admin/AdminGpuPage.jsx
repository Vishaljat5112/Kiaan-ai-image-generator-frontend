import React, { useEffect, useState, useCallback } from 'react'
import {
  Server,
  Plus,
  Activity,
  Cpu,
  RefreshCw,
  Power,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react'
import { api } from '../../services/api'
import { formatDateTime } from '../../utils/format'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { FieldLabel, lightInputClass, Toast } from '../../components/studio/StudioUI'

export function AdminGpuPage() {
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  // New node form state
  const [nodeId, setNodeId] = useState('')
  const [nodeName, setNodeName] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [gpuModel, setGpuModel] = useState('NVIDIA A100-SXM4-80GB')
  const [totalVram, setTotalVram] = useState('80')

  const fetchNodes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/gpu/nodes')
      if (res.data?.data) {
        setNodes(res.data.data)
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load GPU nodes', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNodes()
  }, [fetchNodes])

  const handleRegisterNode = async (e) => {
    e.preventDefault()
    if (!nodeId || !nodeName) return
    try {
      await api.post('/admin/gpu/nodes', {
        id: nodeId.trim(),
        name: nodeName.trim(),
        ipAddress: ipAddress.trim() || '127.0.0.1',
        gpuModel,
        totalVramGb: parseInt(totalVram, 10),
        status: 'ONLINE'
      })
      setToast({ message: `Node ${nodeName} registered successfully` })
      setModalOpen(false)
      setNodeId('')
      setNodeName('')
      setIpAddress('')
      fetchNodes()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Registration failed', type: 'error' })
    }
  }

  const handleStatusToggle = async (node) => {
    const nextStatus = node.status === 'ONLINE' ? 'DRAINING' : node.status === 'DRAINING' ? 'OFFLINE' : 'ONLINE'
    try {
      await api.patch(`/admin/gpu/nodes/${node.id}`, { status: nextStatus })
      setToast({ message: `Node status updated to ${nextStatus}` })
      fetchNodes()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Update failed', type: 'error' })
    }
  }

  const handleDeleteNode = async (id) => {
    if (!confirm('Are you sure you want to remove this node from the fleet registry?')) return
    try {
      await api.delete(`/admin/gpu/nodes/${id}`)
      setToast({ message: 'Node removed from fleet' })
      fetchNodes()
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Deletion failed', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
              <Server className="w-3.5 h-3.5" />
              Inference Infrastructure
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">GPU Fleet & Compute Telemetry</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor physical inference nodes, VRAM allocation, and RPC heartbeat connectivity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNodes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="gradient" size="sm" leftIcon={Plus} onClick={() => setModalOpen(true)}>
            Register Node
          </Button>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading && nodes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-neutral-400">
            Loading GPU fleet telemetry...
          </div>
        ) : nodes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-neutral-400">
            No GPU worker nodes registered. Click Register Node to add an inference daemon.
          </div>
        ) : (
          nodes.map((node) => {
            const vramPercent = Math.min(100, Math.round(((node.usedVramGb || 0) / (node.totalVramGb || 1)) * 100))
            const isOnline = node.isOnline !== false && node.status !== 'OFFLINE'

            return (
              <div
                key={node.id}
                className="p-5 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-lg space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{node.name}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{node.id}</div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isOnline
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : node.status === 'DRAINING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <Activity className="w-2.5 h-2.5" />
                      {node.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>GPU Hardware</span>
                      <span className="text-neutral-200 font-medium">{node.gpuModel}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Cluster IP</span>
                      <span className="text-neutral-300 font-mono text-[11px]">{node.ipAddress}</span>
                    </div>
                  </div>

                  {/* VRAM Gauge */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">VRAM Allocation</span>
                      <span className="text-cyan-400 font-semibold">
                        {node.usedVramGb} / {node.totalVramGb} GB ({vramPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          vramPercent > 85 ? 'bg-rose-500' : vramPercent > 60 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${vramPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>Heartbeat: {formatDateTime(node.lastHeartbeatAt)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStatusToggle(node)}
                      className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Toggle node lifecycle state"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNode(node.id)}
                      className="p-1 rounded-lg bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition-colors"
                      title="Remove node from fleet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Register Node Modal */}
      <Modal
        theme="dark"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Inference Node"
        description="Add a new GPU worker node daemon to the cluster allocation pool."
        className="max-w-md bg-[#0D111C] text-neutral-100 border-neutral-800"
      >
        <form onSubmit={handleRegisterNode} className="space-y-4">
          <div>
            <FieldLabel htmlFor="n-id">Node Unique Identifier *</FieldLabel>
            <input
              id="n-id"
              type="text"
              required
              value={nodeId}
              onChange={(e) => setNodeId(e.target.value)}
              placeholder="e.g. node-rtx4090-worker-02"
              className={lightInputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="n-name">Cluster Display Name *</FieldLabel>
            <input
              id="n-name"
              type="text"
              required
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="e.g. Edge Worker RTX 4090 #2"
              className={lightInputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="n-ip">Internal IP</FieldLabel>
              <input
                id="n-ip"
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="10.0.0.103"
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="n-vram">Total VRAM (GB)</FieldLabel>
              <input
                id="n-vram"
                type="number"
                value={totalVram}
                onChange={(e) => setTotalVram(e.target.value)}
                className={lightInputClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="n-gpu">GPU Hardware Architecture</FieldLabel>
            <select
              id="n-gpu"
              value={gpuModel}
              onChange={(e) => setGpuModel(e.target.value)}
              className={lightInputClass}
            >
              <option value="NVIDIA A100-SXM4-80GB">NVIDIA A100-SXM4-80GB</option>
              <option value="NVIDIA H100 80GB SXM5">NVIDIA H100 80GB SXM5</option>
              <option value="NVIDIA GeForce RTX 4090 24GB">NVIDIA GeForce RTX 4090 24GB</option>
              <option value="NVIDIA RTX 6000 Ada 48GB">NVIDIA RTX 6000 Ada 48GB</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setModalOpen(false)}
              className="text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Register Node
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminGpuPage
