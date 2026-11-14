import React, { useEffect, useState, useCallback } from 'react'
import {
  Settings,
  RefreshCw,
  Save,
  Shield,
  Coins,
  AlertTriangle,
  Bell
} from 'lucide-react'
import { api } from '../../services/api'
import { Button } from '../../components/ui/Button'
import { FieldLabel, lightInputClass, Toast } from '../../components/studio/StudioUI'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    systemNotice: '',
    allowRegistration: true,
    defaultFreeCredits: 25,
    maxConcurrentJobsPerUser: 2,
    workerHeartbeatTimeoutSec: 300,
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/settings')
      if (res.data?.data) {
        setSettings((prev) => ({ ...prev, ...res.data.data }))
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to load settings', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.put('/admin/settings', settings)
      setToast({ message: 'Global system settings updated successfully' })
    } catch (err) {
      setToast({ message: err.response?.data?.error?.message || 'Failed to update settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Settings className="w-3.5 h-3.5" />
              Platform Configuration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Global System Settings</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure platform-wide operational banners, default quotas, and cluster parameters.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Banner Notice */}
        <div className="p-6 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Platform Broadcast Notice</span>
          </div>
          <div>
            <FieldLabel htmlFor="s-notice">Public Notice (Shows on customer dashboard banner)</FieldLabel>
            <input
              id="s-notice"
              type="text"
              value={settings.systemNotice || ''}
              onChange={(e) => setSettings({ ...settings, systemNotice: e.target.value })}
              placeholder="e.g. Wan 2.1 video pipeline cluster upgrade scheduled tonight at 02:00 UTC."
              className={lightInputClass}
            />
          </div>
        </div>

        {/* User Registration & Starter Credits */}
        <div className="p-6 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Coins className="w-4 h-4 text-pink-400" />
            <span>Starter Credits & Registration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="s-credits">New Account Starter Credits</FieldLabel>
              <input
                id="s-credits"
                type="number"
                value={settings.defaultFreeCredits || 25}
                onChange={(e) => setSettings({ ...settings, defaultFreeCredits: parseInt(e.target.value, 10) })}
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="s-conc">Default Max Parallel Concurrency</FieldLabel>
              <input
                id="s-conc"
                type="number"
                value={settings.maxConcurrentJobsPerUser || 2}
                onChange={(e) => setSettings({ ...settings, maxConcurrentJobsPerUser: parseInt(e.target.value, 10) })}
                className={lightInputClass}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Allow Public Customer Registration</div>
              <div className="text-[11px] text-neutral-400">Permit new visitors to sign up without an invite code</div>
            </div>
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Worker Telemetry */}
        <div className="p-6 rounded-2xl bg-[#0D111C]/90 border border-neutral-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>GPU Worker Node Telemetry</span>
          </div>

          <div>
            <FieldLabel htmlFor="s-heartbeat">Heartbeat Stale Threshold (Seconds)</FieldLabel>
            <input
              id="s-heartbeat"
              type="number"
              value={settings.workerHeartbeatTimeoutSec || 300}
              onChange={(e) => setSettings({ ...settings, workerHeartbeatTimeoutSec: parseInt(e.target.value, 10) })}
              className={lightInputClass}
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Nodes without RPC heartbeats within this interval are marked OFFLINE.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="gradient" size="md" type="submit" disabled={saving} leftIcon={Save}>
            {saving ? 'Saving...' : 'Save Global Settings'}
          </Button>
        </div>
      </form>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default AdminSettingsPage
