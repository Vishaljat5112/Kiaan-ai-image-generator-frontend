import React from 'react'
import { Cpu } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminModelsPage() {
  return (
    <RoutePlaceholder
      title="AI Model Registry & Versioning"
      description="Register, activate, configure, and inspect open-weight generative models."
      category="Generative AI Fleet"
      emptyTitle="No active models connected."
      emptyDescription="Open-weight models will be registered here once inference worker daemons are connected."
      emptyIcon={Cpu}
      features={[
        'Model catalog: FLUX.2 Klein 4B, Z-Image Turbo, Wan 2.1 1.3B, Wan 2.1 14B, Wan 2.2 MoE',
        'Model active/disabled toggle and global emergency kill-switch',
        'Credit cost multiplier configuration per model architecture',
        'Local model weight file integrity and SHA-256 checksum verification'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminModelsPage
