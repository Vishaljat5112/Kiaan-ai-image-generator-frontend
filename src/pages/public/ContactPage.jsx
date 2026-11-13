import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function ContactPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="Contact & Customer Inquiries"
        description="Get in touch with our engineering team, enterprise sales consultants, or support desk."
        category="Support"
        features={[
          'Enterprise self-hosted deployment consultation and hardware sizing',
          'Custom model fine-tuning (LoRA) and dedicated cluster inquiries',
          'SLA guarantees and private VPC storage connectivity',
          'Community discussion channels and prompt engineering resources'
        ]}
        actionTo="/"
        actionLabel="Back to Home"
      />
    </div>
  )
}

export default ContactPage
