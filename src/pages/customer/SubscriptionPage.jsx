import React from 'react'
import { CreditCard } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function SubscriptionPage() {
  return (
    <RoutePlaceholder
      title="Subscription Management"
      description="Manage your recurring plan, upgrade quota, or update billing payment details."
      category="Account & Billing"
      emptyTitle="Free Tier Active"
      emptyDescription="You are currently on the Free Starter tier. Upgrade to Creator or Pro Studio for priority queue processing and high-definition video access."
      emptyIcon={CreditCard}
      features={[
        'Creator Tier ($19/mo): 600 monthly credits with full commercial rights',
        'Pro Studio Tier ($49/mo): 2,000 monthly credits with full cinema video access',
        'Enterprise Tier ($199/mo): 10,000 monthly credits with dedicated fast-track worker routing',
        'Stripe Customer Billing Portal redirect for card updates and invoices'
      ]}
    />
  )
}

export default SubscriptionPage
