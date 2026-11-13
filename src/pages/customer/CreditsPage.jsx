import React from 'react'
import { Coins } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function CreditsPage() {
  return (
    <RoutePlaceholder
      title="Credits & Wallet Usage"
      description="Inspect your real-time balance, consumption ledger, and purchase top-up packs."
      category="Account & Billing"
      emptyTitle="No credit transactions recorded."
      emptyDescription="Credit top-ups and generation settlements will appear here in your immutable transaction ledger."
      emptyIcon={Coins}
      features={[
        'Double-entry transaction ledger showing grants, spends, and refunds',
        'Top-up credit pack selector with transparent pricing',
        'Model-based cost accounting (1 cr for FLUX.2 Klein, 12 cr for draft video, 25 cr for cinema)',
        'Immediate automatic refund tracking on failed or canceled generation jobs'
      ]}
    />
  )
}

export default CreditsPage
