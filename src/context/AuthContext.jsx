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
      if (token && token !== 'mock_preview_token') {
        // Try fetching active user profile with access token
        const meRes = await api.get('/auth/me')
        if (meRes.data?.success && meRes.data?.data?.user) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('kiaan_is_mock_session')
            sessionStorage.removeItem('kiaan_mock_user')
          }
          setUser(meRes.data.data.user)
          setLoading(false)
          return
        }
      }

      // If no valid access token, attempt refresh via HttpOnly cookie
      try {
        const refreshRes = await api.post('/auth/refresh')
        if (refreshRes.data?.success) {
          const { accessToken, user: refreshedUser } = refreshRes.data.data
          if (accessToken) setAccessToken(accessToken)
          if (refreshedUser) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('kiaan_is_mock_session')
              sessionStorage.removeItem('kiaan_mock_user')
            }
            setUser(refreshedUser)
            setLoading(false)
            return
          }
        }
      } catch {
        // Refresh failed, check for offline mock session fallback below
      }

      // Clear any legacy mock storage flags
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kiaan_is_mock_session')
        sessionStorage.removeItem('kiaan_mock_user')
      }

      setUser(null)
      clearAccessToken()
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
   * Real Customer / Admin Login (Live Database Authenticated)
   */
  const login = async (email, password, requestedRole = 'customer') => {
    const res = await api.post('/auth/login', {
      email,
      password,
      requestedAdmin: requestedRole === 'admin'
    })

    if (res.data?.success && res.data?.data) {
      const { user: authUser, accessToken } = res.data.data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kiaan_is_mock_session')
        sessionStorage.removeItem('kiaan_mock_user')
      }
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
      if (typeof window !== 'undefined' && localStorage.getItem('kiaan_is_mock_session') !== 'true') {
        await api.post('/auth/logout')
      }
    } catch {
      // Ignore network errors during logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kiaan_is_mock_session')
        sessionStorage.removeItem('kiaan_mock_user')
      }
      clearAccessToken()
      setUser(null)
    }
  }

  /**
   * Offline mock authentication is permanently disabled
   */
  const loginAsMockUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kiaan_is_mock_session')
      sessionStorage.removeItem('kiaan_mock_user')
    }
    clearAccessToken()
    setUser(null)
    throw new Error('Offline mock authentication is disabled. Please authenticate using real credentials.')
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
