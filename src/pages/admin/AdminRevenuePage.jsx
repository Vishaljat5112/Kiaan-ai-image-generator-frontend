import React from 'react'
import { DollarSign } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminRevenuePage() {
  return (
    <RoutePlaceholder
      title="Payments & Revenue Analytics"
      description="Track monthly recurring revenue (MRR), credit top-up sales, and payment gateway health."
      category="Commercial & Finance"
      emptyTitle="No payment records available."
      emptyDescription="Billing charges, subscription renewals, and top-up revenue will appear here as transactions execute."
      emptyIcon={DollarSign}
      features={[
        'Monthly Recurring Revenue (MRR) and Average Revenue Per User (ARPU) charts',
        'Stripe charge logs with transaction statuses, receipt URLs, and fee breakdowns',
        'Top-up credit pack purchase volume distribution',
        'Refund and chargeback monitoring with automatic account flagging'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminRevenuePage
