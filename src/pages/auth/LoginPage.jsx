import React from 'react'
import { AuthModal } from '../../components/auth/AuthModal'

export function LoginPage() {
  return <AuthModal initialMode="login" initialRole="customer" />
}

export default LoginPage
