import React from 'react'
import { BarChart3 } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminAnalyticsPage() {
  return (
    <RoutePlaceholder
      title="Platform Usage & Growth Analytics"
      description="Deep-dive metrics on generation volume, popular aspect ratios, and model preference."
      category="Commercial & Finance"
      emptyTitle="No analytics data."
      emptyDescription="Usage metrics will populate as creators generate assets and execute workflows."
      emptyIcon={BarChart3}
      features={[
        'Daily, weekly, and monthly generation volume trends across modalities',
        'Model distribution breakdown (FLUX.2 Klein vs Z-Image Turbo vs Wan 2.1)',
        'Storage utilization growth and S3 egress bandwidth tracking',
        'User retention and weekly cohort retention analysis'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminAnalyticsPage
