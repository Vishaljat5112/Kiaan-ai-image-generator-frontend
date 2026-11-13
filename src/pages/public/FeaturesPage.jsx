import React from 'react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function FeaturesPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <RoutePlaceholder
        title="Creative Studio Features"
        description="Comprehensive suite of generative visual tools for high-resolution image synthesis and video production."
        category="Product Features"
        features={[
          'Text-to-Image with multi-aspect ratio presets and precise seed locking',
          'Image-to-Image composition with adjustable denoising influence sliders',
          'Inpainting & Outpainting canvas with interactive brush masking tools',
          'Text-to-Video and Image-to-Video cinematic generation at 16fps and 24fps',
          'Asset library management with nested folders and bulk ZIP export',
          'Metadata inspection: seed, prompt, CFG, sampler, and step replication'
        ]}
        actionTo="/"
        actionLabel="Back to Home"
      />
    </div>
  )
}

export default FeaturesPage
