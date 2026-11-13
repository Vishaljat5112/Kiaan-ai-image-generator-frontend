import React from 'react'
import { CreditCard } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminPlansPage() {
  return (
    <RoutePlaceholder
      title="Subscription Plans Configuration"
      description="Create, update, and manage recurring pricing tiers, quotas, and feature flags."
      category="Commercial & Finance"
      emptyTitle="Plans Configured"
      emptyDescription="Standard pricing tiers (Starter, Creator, Pro Studio, Enterprise) are initialized."
      emptyIcon={CreditCard}
      features={[
        'Interactive tier editor (price, monthly credits, priority weight, max concurrency)',
        'Stripe Price ID mapping and synchronization checks',
        'Feature flag assignment (access to 14B video, priority queue fast-tracking)',
        'Plan activation and archival controls'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminPlansPage
