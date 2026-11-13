import React from 'react'
import { Video } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminVideoJobsPage() {
  return (
    <RoutePlaceholder
      title="Video Generation Jobs Monitor"
      description="Track cinematic video synthesis tasks, frame generation times, and GPU loads."
      category="Generative AI Fleet"
      emptyTitle="No video generation jobs."
      emptyDescription="Video synthesis tasks will appear here as jobs are queued and processed."
      emptyIcon={Video}
      features={[
        'Video queue tracking (Draft 480p on standard GPUs vs Cinema 720p on high-memory nodes)',
        'Frame-by-frame progress reporting (81 frames at 16fps / 24fps)',
        'FFmpeg post-processing compression latency and S3 upload timings',
        'VRAM consumption metrics during 3D DiT inference cycles'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminVideoJobsPage
