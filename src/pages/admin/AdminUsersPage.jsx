import React from 'react'
import { Users } from 'lucide-react'
import { RoutePlaceholder } from '../../components/common/RoutePlaceholder'

export function AdminUsersPage() {
  return (
    <RoutePlaceholder
      title="User Management & RBAC"
      description="Inspect user accounts, manage permission roles, adjust credits, or suspend accounts."
      category="Admin Portal"
      emptyTitle="No users registered yet."
      emptyDescription="Registered customer accounts will appear here once users sign up."
      emptyIcon={Users}
      features={[
        'Searchable user table with pagination, tier filters, and registration timestamps',
        'Direct credit adjustment modal (grant bonus credits or deduct with audit reason)',
        'Account status actions: Activate, Suspend, Ban, Force Password Reset',
        'Role assignment: user, creator, agency_admin, super_admin'
      ]}
      actionTo="/admin"
      actionLabel="Back to Admin Overview"
    />
  )
}

export default AdminUsersPage
