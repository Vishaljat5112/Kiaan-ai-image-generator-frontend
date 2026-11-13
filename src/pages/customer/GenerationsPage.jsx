import React from 'react'
import { Clock } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function GenerationsPage() {
  return (
    <RoutePlaceholder
      title="My Generation History"
      description="Browse, filter, inspect, and reuse parameters from your past visual generations."
      category="Asset Management"
      emptyTitle="No generations yet."
      emptyDescription="When you generate images or videos using the studio tools, your visual assets will appear here in your personal library."
      emptyIcon={Clock}
      features={[
        'Virtualized media gallery with infinite scrolling and thumbnail caching',
        'Filter by media type (All Media, Images, Videos, Inpaintings, Favorites)',
        'Full metadata inspection modal (prompt, negative prompt, model, seed, CFG, latency)',
        'One-click "Fork into Studio" action restoring prompt and generation settings'
      ]}
    />
  )
}

export default GenerationsPage
