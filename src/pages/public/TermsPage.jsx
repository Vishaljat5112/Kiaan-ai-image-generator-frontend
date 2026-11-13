import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function TermsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="Terms of Service & Commercial Rights"
        description="User rights, content ownership parameters, and acceptable usage policies."
        category="Legal & Compliance"
        features={[
          'Commercial output ownership: 100% of generated rights belong to the user',
          'Apache 2.0 open weight compliance and attribution policies',
          'Prohibited content boundaries and automated two-tier moderation rules',
          'Credit wallet non-refundability terms and subscription cancellation rights'
        ]}
        actionTo="/"
        actionLabel="Back to Home"
      />
    </div>
  )
}

export default TermsPage
