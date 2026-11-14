import React, { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './authContextInstance'
import { api, setAccessToken, getAccessToken, clearAccessToken } from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify active session on initial load / page refresh
  const checkAuth = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('kiaan_is_mock_session') === 'true') {
        const savedMock = sessionStorage.getItem('kiaan_mock_user')
        if (savedMock) {
          setUser(JSON.parse(savedMock))
          setLoading(false)
          return
        }
      }

      const token = getAccessToken()
      if (token && token !== 'mock_preview_token') {
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
   * Real Customer / Admin Login with resilient demo credentials fallback
   */
  const login = async (email, password, requestedRole = 'customer') => {
    try {
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
    } catch (err) {
      // If backend is offline (Network Error) or database not seeded, fallback gracefully for demo access
      const isUserDemo = email === 'user@gmail.com' && password === '12345678'
      const isAdminDemo = email === 'admin@gmail.com' && password === '12345678'

      if (isUserDemo || isAdminDemo) {
        const targetRole = isAdminDemo || requestedRole === 'admin' ? 'SUPER_ADMIN' : 'CREATOR'
        const fallbackUser = {
          id: isAdminDemo ? 'usr_admin_demo' : 'usr_customer_demo',
          fullName: isAdminDemo ? 'System Administrator' : 'Demo Creator',
          email,
          role: targetRole,
          creditBalance: isAdminDemo ? 99999 : 250,
          status: 'ACTIVE'
        }
        return loginAsMockUser(targetRole, fallbackUser)
      }

      throw err
    }
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
   * Demo Access Utility (preserves 1-click preview without tampering real auth)
   */
  const loginAsMockUser = (role = 'creator', customData = {}) => {
    const isSuperAdmin = role === 'super_admin' || role === 'SUPER_ADMIN' || role === 'admin'
    const mockUser = {
      id: customData.id || (isSuperAdmin ? 'usr_admin_mock' : 'usr_creator_mock'),
      fullName: customData.fullName || (isSuperAdmin ? 'System Administrator' : 'Demo Creator'),
      email: customData.email || (isSuperAdmin ? 'admin@gmail.com' : 'user@gmail.com'),
      role: isSuperAdmin ? 'SUPER_ADMIN' : 'CREATOR',
      tier: customData.tier || (isSuperAdmin ? 'Super Admin' : 'Free Tier'),
      creditBalance: customData.creditBalance !== undefined ? customData.creditBalance : (isSuperAdmin ? 99999 : 250),
      isMock: true
    }
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kiaan_is_mock_session', 'true')
        sessionStorage.setItem('kiaan_mock_user', JSON.stringify(mockUser))
      }
    } catch {
      // ignore storage errors
    }
    setAccessToken('mock_preview_token')
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
