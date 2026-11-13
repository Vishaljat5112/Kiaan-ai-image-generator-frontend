import React from 'react'
import { Server } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminGpuPage() {
  return (
    <RoutePlaceholder
      title="GPU Fleet & Hardware Telemetry"
      description="Monitor physical GPU hardware health, VRAM allocations, temperatures, and worker pools."
      category="Generative AI Fleet"
      emptyTitle="Monitoring data is not connected."
      emptyDescription="Connect compute worker nodes to view real-time hardware telemetry and VRAM utilization."
      emptyIcon={Server}
      features={[
        'Worker cards showing hostname, GPU model (RTX 4090, A100), and pool assignment',
        'Real-time VRAM allocation gauges (used MB vs total MB)',
        'GPU temperature, power draw (Watts), and compute utilization percentages',
        'Worker lifecycle controls: Drain Worker, Restart Container, Kill Worker'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminGpuPage
