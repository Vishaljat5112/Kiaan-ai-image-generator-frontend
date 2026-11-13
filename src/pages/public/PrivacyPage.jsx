import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function PrivacyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="Privacy Policy & Data Sovereignty"
        description="Our policy regarding prompt inputs, generated imagery, and user account confidentiality."
        category="Legal & Compliance"
        features={[
          'Data sovereignty guarantee: Prompts and generated assets remain in private tenant storage',
          'Zero foundation model training on customer media without explicit consent',
          'GDPR and CCPA compliance with right-to-be-forgotten deletion workflows',
          'Encrypted object storage with short-lived presigned download links'
        ]}
        actionTo="/"
        actionLabel="Back to Home"
      />
    </div>
  )
}

export default PrivacyPage
