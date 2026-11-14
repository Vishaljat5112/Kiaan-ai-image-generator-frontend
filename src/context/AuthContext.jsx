import React, { useState } from 'react'
import { AuthContext } from './authContextInstance'

const SESSION_STORAGE_KEY = 'kiaan_mock_session_state'

/**
 * AuthProvider: Manages local mock user session state for Kiaan Studio.
 * Real JWT authentication, database queries, and server-side session invalidation
 * are scheduled for Phase 7.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const state = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (state && state !== 'logged_out') {
        return JSON.parse(state)
      }
      return null
    } catch {
      return null
    }
  })

  /**
   * Log in with mock credentials during development preview.
   * Supports role switching (creator vs super_admin) and custom signup details.
   */
  const loginAsMockUser = (role = 'creator', customData = {}) => {
    const isSuperAdmin = role === 'super_admin'
    const newUser = {
      id: customData.id || (isSuperAdmin ? 'usr_admin_001' : 'usr_dev_001'),
      fullName: customData.fullName || (isSuperAdmin ? 'Admin User' : 'Jane Doe'),
      email: customData.email || (isSuperAdmin ? 'admin@studio.com' : 'artist@studio.com'),
      role: isSuperAdmin ? 'super_admin' : 'creator',
      tier: customData.tier || (isSuperAdmin ? 'Enterprise Admin' : 'Free Tier'),
      creditBalance: customData.creditBalance !== undefined ? customData.creditBalance : (isSuperAdmin ? 99999 : 250),
    }
    setUser(newUser)
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser))
    } catch {
      // ignore storage errors
    }
    return newUser
  }

  /**
   * Mock logout:
   * Clears in-memory user state and sets logged_out in application-owned session storage.
   */
  const logout = () => {
    setUser(null)
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'logged_out')
    } catch {
      // ignore storage errors
    }
  }

  const value = {
    user,
    setUser,
    isAuthenticated: Boolean(user),
    isDevBypass: true,
    loginAsMockUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
