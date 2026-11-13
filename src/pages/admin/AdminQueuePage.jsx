import React from 'react'
import { Layers } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminQueuePage() {
  return (
    <RoutePlaceholder
      title="BullMQ Queue Operations"
      description="Inspect Redis task queues, waiting times, worker concurrency, and job throughput."
      category="Generative AI Fleet"
      emptyTitle="No active queue data."
      emptyDescription="Task queues will display real-time throughput when jobs are dispatched by creators."
      emptyIcon={Layers}
      features={[
        'Queue partition visualizer (queue:image:priority, queue:image:standard, queue:video:*)',
        'Real-time job counters: Waiting, Active, Completed, Failed, Delayed',
        'Average queue waiting latency graphs and SLA breach alerts',
        'Pause queue, resume queue, and purge completed jobs utilities'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminQueuePage
