import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function SettingsPage() {
  return (
    <RoutePlaceholder
      title="Profile & Studio Settings"
      description="Update personal profile, security credentials, API keys, and studio generation preferences."
      category="Account & Billing"
      features={[
        'Full name, email address, and studio avatar profile editor',
        'Password change form and Two-Factor Authentication (2FA) security toggles',
        'Personal API key generation for automated visual workflows',
        'Default generation preferences: preferred model, default aspect ratio, seed locking'
      ]}
    />
  )
}

export default SettingsPage
