import React from 'react'
import { Sparkles } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminImageJobsPage() {
  return (
    <RoutePlaceholder
      title="Image Generation Jobs Monitor"
      description="Real-time log of image synthesis requests, execution times, and worker assignments."
      category="Generative AI Fleet"
      emptyTitle="No image generation jobs."
      emptyDescription="Image synthesis tasks will stream here in real time as jobs are submitted to the queue."
      emptyIcon={Sparkles}
      features={[
        'Live stream of image jobs (QUEUED, RUNNING, POST_PROCESSING, COMPLETED)',
        'Worker allocation details (which compute node executed the generation)',
        'Inference latency telemetry (wall-clock milliseconds per 1024×1024 generation)',
        'Prompt inspection and automated safety filter score audits'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminImageJobsPage
