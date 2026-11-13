import React, { useState, useRef, useCallback } from 'react'
import {
  Settings, User, Lock, Bell, Palette, Camera, Check,
  Shield, Key, Globe, Eye, EyeOff, Save, Trash2
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import {
  StudioPageHeader, Panel, PanelTitle, FieldLabel, lightInputClass,
  Toggle, Toast
} from '../../components/studio/StudioUI'
import { useAuth } from '../../hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()
  const avatarInputRef = useRef(null)

  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || 'Jane Doe')
  const [email, setEmail] = useState(user?.email || 'artist@studio.com')
  const [bio, setBio] = useState('Digital artist and VFX designer exploring neural generative pipelines.')
  const [avatar, setAvatar] = useState('/images/landing/hero-astronaut.jpg')

  // Password state
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Preferences & Notifications state
  const [emailCompletedJobs, setEmailCompletedJobs] = useState(true)
  const [emailLowCredits, setEmailLowCredits] = useState(true)
  const [emailProductUpdates, setEmailProductUpdates] = useState(false)
  const [browserNotifications, setBrowserNotifications] = useState(true)
  const [autoDownload, setAutoDownload] = useState(false)

  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setAvatar(reader.result)
        setToast({ message: 'Avatar image updated locally.' })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setToast({ message: 'Profile details saved in local demo state.' })
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!currPassword) {
      setToast({ message: 'Please enter current password.', tone: 'danger' })
      return
    }
    if (newPassword.length < 8) {
      setToast({ message: 'Password must be at least 8 characters.', tone: 'danger' })
      return
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match.', tone: 'danger' })
      return
    }
    setCurrPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setToast({ message: 'Password updated successfully (Demo).' })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <StudioPageHeader
        icon={Settings}
        section="Account & Billing"
        crumb="Profile & Settings"
        title="Profile & Settings"
        description="Manage your studio credentials, notification preferences, and account privacy."
      />

      {/* Profile Information Panel */}
      <Panel>
        <PanelTitle icon={User}>Personal Profile</PanelTitle>
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-neutral-800">
            <div className="relative group">
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                aria-label="Upload photo"
              >
                <Camera className="w-5 h-5 text-cyan-400" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-sm font-bold text-white">{fullName}</h3>
              <p className="text-xs text-neutral-400">{email} • {user?.tier || 'Creator Tier'}</p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="text-xs py-1 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="settings-name">Full Name</FieldLabel>
              <input
                id="settings-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="settings-email">Email Address</FieldLabel>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={lightInputClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="settings-bio">Creator Bio</FieldLabel>
            <textarea
              id="settings-bio"
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={lightInputClass}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="gradient" size="sm" type="submit" leftIcon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Panel>

      {/* Security & Password */}
      <Panel>
        <PanelTitle icon={Lock}>Security & Password</PanelTitle>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="max-w-md space-y-3">
            <div>
              <FieldLabel htmlFor="curr-pass">Current Password</FieldLabel>
              <input
                id="curr-pass"
                type={showPassword ? 'text' : 'password'}
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="••••••••••••"
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="new-pass">New Password</FieldLabel>
              <input
                id="new-pass"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={lightInputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="confirm-pass">Confirm New Password</FieldLabel>
              <input
                id="confirm-pass"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={lightInputClass}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPassword ? 'Hide password text' : 'Show password text'}
              </button>
              <Button variant="primary" size="sm" type="submit">
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </Panel>

      {/* Notifications & Studio Preferences */}
      <Panel>
        <PanelTitle icon={Bell}>Notification Preferences</PanelTitle>
        <div className="divide-y divide-neutral-800">
          <Toggle
            label="Inference Completion Alerts"
            description="Send an email or desktop ping when a long-running 3D DiT video job finishes."
            checked={emailCompletedJobs}
            onChange={setEmailCompletedJobs}
          />
          <Toggle
            label="Low Credit Balance Warning"
            description="Notify when your credit balance drops below 20 credits."
            checked={emailLowCredits}
            onChange={setEmailLowCredits}
          />
          <Toggle
            label="Browser Push Notifications"
            description="Receive real-time progress events directly inside your browser window."
            checked={browserNotifications}
            onChange={setBrowserNotifications}
          />
          <Toggle
            label="Product Updates & Model Weights"
            description="Receive announcements when new Apache 2.0 open weights are mounted."
            checked={emailProductUpdates}
            onChange={setEmailProductUpdates}
          />
          <Toggle
            label="Auto-Download Finished Assets"
            description="Automatically trigger WebP/MP4 download upon job resolution."
            checked={autoDownload}
            onChange={setAutoDownload}
          />
        </div>
      </Panel>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}

export default SettingsPage
