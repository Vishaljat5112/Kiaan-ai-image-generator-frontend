import React from 'react'
import { AuthModal } from '../../components/auth/AuthModal'

export function AdminLoginPage() {
  return <AuthModal initialMode="login" initialRole="admin" />
}

export default AdminLoginPage
