import React from 'react'
import { AlertOctagon } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminFailedJobsPage() {
  return (
    <RoutePlaceholder
      title="Failed Jobs & Dead-Letter Queue (DLQ)"
      description="Inspect unrecoverable task errors, CUDA OOM occurrences, and retry failed operations."
      category="Generative AI Fleet"
      emptyTitle="No failed jobs reported."
      emptyDescription="All system tasks are executing cleanly without unhandled exceptions or worker crashes."
      emptyIcon={AlertOctagon}
      features={[
        'Dead-Letter Queue (DLQ) task inspector with full Python stack traces',
        'Failure categorization: CUDA Out-Of-Memory, Timeout, S3 Upload Failure, Worker Crash',
        'Verification of automated credit refund execution for each failed job',
        'One-click retry job action or batch purge failed tasks'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminFailedJobsPage
