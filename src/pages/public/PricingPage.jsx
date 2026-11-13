import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function PricingPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="Subscription Plans & Credit Economy"
        description="Predictable, credit-based pricing designed for independent creators, boutique production studios, and enterprises."
        category="Pricing & Plans"
        features={[
          'Free Starter: 25 initial trial credits with standard queue allocation',
          'Creator Tier ($19/mo): 600 monthly credits with full commercial usage rights',
          'Pro Studio Tier ($49/mo): 2,000 monthly credits with cinema video access and 5 concurrent slots',
          'Enterprise Tier ($199/mo): 10,000 monthly credits with dedicated fast-track worker routing',
          'Non-expiring credit top-up packs for on-demand production scaling'
        ]}
        actionTo="/"
        actionLabel="Back to Home"
      />
    </div>
  )
}

export default PricingPage
