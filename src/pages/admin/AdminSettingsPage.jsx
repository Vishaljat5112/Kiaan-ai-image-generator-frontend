import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminSettingsPage() {
  return (
    <RoutePlaceholder
      title="Global System Settings"
      description="Configure platform-wide operational toggles, maintenance mode, and safety thresholds."
      category="System & Support"
      features={[
        'Global Maintenance Mode toggle with customizable user-facing banner',
        'Pre-inference content moderation sensitivity threshold sliders',
        'Default queue timeout settings (300s for image, 900s for video)',
        'Default trial starter credit allocation for new registrations'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminSettingsPage
