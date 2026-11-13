import axios from 'axios'

/**
 * Pre-configured Axios API client instance.
 * Backend endpoints will be connected in Phase 8.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT Bearer token if present in memory
api.interceptors.request.use(
  (config) => {
    // In future Phase 8, get token from auth memory/state
    const token = null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Global error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api

