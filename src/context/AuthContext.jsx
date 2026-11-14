import React, { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './authContextInstance'
import { api, setAccessToken, getAccessToken, clearAccessToken } from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify active session on initial load / page refresh
  const checkAuth = useCallback(async () => {
    try {
      const token = getAccessToken()
      if (token) {
        // Try fetching active user profile with access token
        const meRes = await api.get('/auth/me')
        if (meRes.data?.success && meRes.data?.data?.user) {
          setUser(meRes.data.data.user)
          setLoading(false)
          return
        }
      }

      // If no valid access token, attempt refresh via HttpOnly cookie
      const refreshRes = await api.post('/auth/refresh')
      if (refreshRes.data?.success) {
        const { accessToken, user: refreshedUser } = refreshRes.data.data
        if (accessToken) setAccessToken(accessToken)
        if (refreshedUser) setUser(refreshedUser)
      } else {
        setUser(null)
        clearAccessToken()
      }
    } catch {
      setUser(null)
      clearAccessToken()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()

    const handleSessionExpired = () => {
      setUser(null)
      clearAccessToken()
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [checkAuth])

  /**
   * Real Customer / Admin Login
   */
  const login = async (email, password, requestedRole = 'customer') => {
    const res = await api.post('/auth/login', {
      email,
      password,
      requestedAdmin: requestedRole === 'admin'
    })

    if (res.data?.success && res.data?.data) {
      const { user: authUser, accessToken } = res.data.data
      setAccessToken(accessToken)
      setUser(authUser)
      return authUser
    }

    throw new Error(res.data?.error?.message || 'Login failed')
  }

  /**
   * Real Customer Registration
   */
  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', {
      fullName,
      email,
      password
    })

    if (res.data?.success && res.data?.data) {
      const { user: authUser, accessToken } = res.data.data
      setAccessToken(accessToken)
      setUser(authUser)
      return authUser
    }

    throw new Error(res.data?.error?.message || 'Registration failed')
  }

  /**
   * Real Logout: Revokes backend session and clears local tokens
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore network errors during logout
    } finally {
      clearAccessToken()
      setUser(null)
    }
  }

  /**
   * Demo Access Utility (preserves 1-click preview without tampering real auth)
   */
  const loginAsMockUser = (role = 'creator', customData = {}) => {
    const isSuperAdmin = role === 'super_admin' || role === 'SUPER_ADMIN' || role === 'admin'
    const mockUser = {
      id: customData.id || (isSuperAdmin ? 'usr_admin_mock' : 'usr_creator_mock'),
      fullName: customData.fullName || (isSuperAdmin ? 'Admin User' : 'Jane Doe'),
      email: customData.email || (isSuperAdmin ? 'admin@studio.com' : 'artist@studio.com'),
      role: isSuperAdmin ? 'SUPER_ADMIN' : 'CREATOR',
      tier: customData.tier || (isSuperAdmin ? 'Enterprise Admin' : 'Free Tier'),
      creditBalance: customData.creditBalance !== undefined ? customData.creditBalance : (isSuperAdmin ? 99999 : 25),
      isMock: true
    }
    setUser(mockUser)
    return mockUser
  }

  // Role validation helpers
  const isAdmin = Boolean(
    user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'super_admin')
  )

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin,
    login,
    register,
    logout,
    loginAsMockUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
