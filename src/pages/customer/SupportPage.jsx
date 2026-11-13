import React from 'react'
import { HelpCircle } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function SupportPage() {
  return (
    <RoutePlaceholder
      title="Help & Customer Support"
      description="Submit a support ticket, browse documentation, or inspect platform system status."
      category="Account & Billing"
      emptyTitle="No support requests yet."
      emptyDescription="Submit an inquiry if you need assistance with generative models, account quotas, or custom studio pipelines."
      emptyIcon={HelpCircle}
      features={[
        'Interactive support ticket creation with priority tags',
        'Direct links to API documentation and prompt engineering guide',
        'Live GPU fleet status and scheduled maintenance window notifications',
        'Community discussion channels and prompt engineering templates'
      ]}
    />
  )
}

export default SupportPage
