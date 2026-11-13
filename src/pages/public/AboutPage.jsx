import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="About Kiaan AI Studio"
        description="Our mission: Create Beyond Imagination by providing visual creators with self-hosted generative AI infrastructure."
        category="Company"
        features={[
          'Sovereign AI architecture: Zero third-party API dependencies or vendor lock-in',
          'Built exclusively with commercially licensed open weights (Apache 2.0)',
          'Complete data privacy: User prompts and assets remain strictly in private tenant storage',
          'Engineered for digital artists, creative studios, marketing agencies, and media teams'
        ]}
        actionTo="/"
        actionLabel="Back to Home"
      />
    </div>
  )
}

export default AboutPage
