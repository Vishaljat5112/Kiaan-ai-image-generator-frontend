import React from 'react'
import { LifeBuoy } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminSupportPage() {
  return (
    <RoutePlaceholder
      title="Customer Support Desk"
      description="Resolve user inquiries, inspect reported failed generations, and issue manual compensation."
      category="System & Support"
      emptyTitle="No support requests yet."
      emptyDescription="Customer inquiries, reported generation failures, and feedback will display here."
      emptyIcon={LifeBuoy}
      features={[
        'Ticket queue filtered by priority (Urgent, High, Normal, Low)',
        'Direct link from support ticket to the specific generation job and worker log',
        'One-click "Issue Goodwill Credit Compensation" action',
        'Customer satisfaction ratings and ticket resolution response times'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminSupportPage
