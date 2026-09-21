import axios from 'axios'

const apiBaseURL = import.meta.env.VITE_API_URL || ''

export const API_URL = apiBaseURL || window.location.origin

export const TOKEN_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
}

export const getAccessToken = () => localStorage.getItem(TOKEN_KEYS.access)
export const getRefreshToken = () => localStorage.getItem(TOKEN_KEYS.refresh)

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(TOKEN_KEYS.access, access)
  if (refresh) localStorage.setItem(TOKEN_KEYS.refresh, refresh)
}

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.access)
  localStorage.removeItem(TOKEN_KEYS.refresh)
}

export const isAuthenticated = () => Boolean(getAccessToken())

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshRequest = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const isAuthUrl = config?.url?.includes('/auth/login/') || config?.url?.includes('/auth/refresh/')
    if (!response || response.status !== 401 || isAuthUrl || config._retried) {
      throw error
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      throw error
    }

    config._retried = true

    const refreshAccessToken = async () => {
      try {
        const { data } = await axios.post(
          `${API_URL}/api/auth/refresh/`,
          { refresh: refreshToken },
        )
        setTokens(data)
        return data.access
      } catch (err) {
        clearTokens()
        throw err
      } finally {
        refreshRequest = null
      }
    }

    const access = await (refreshRequest || (refreshRequest = refreshAccessToken()))
    config.headers.Authorization = `Bearer ${access}`
    return api(config)
  },
)

export default api

export const endpoints = {
  auth: {
    login: '/auth/login/',
    refresh: '/auth/refresh/',
    me: '/users/users/me/',
  },
  users: {
    list: '/users/users/',
    detail: (id) => `/users/users/${id}/`,
    setStatus: (id) => `/users/users/${id}/status/`,
  },
  products: {
    list: '/products/products/',
    create: '/products/products/',
    detail: (id) => `/products/products/${id}/`,
    update: (id) => `/products/products/${id}/`,
    delete: (id) => `/products/products/${id}/`,
    setStatus: (id) => `/products/products/${id}/status/`,
  },
  categories: {
    list: '/categories/categories/',
    create: '/categories/categories/',
    detail: (id) => `/categories/categories/${id}/`,
    update: (id) => `/categories/categories/${id}/`,
    delete: (id) => `/categories/categories/${id}/`,
  },
  orders: {
    list: '/orders/orders/',
    detail: (id) => `/orders/orders/${id}/`,
    items: (orderId) => `/orders/orders/${orderId}/items/`,
  },
  messages: {
    list: '/messages/messages/',
    create: '/messages/messages/',
    detail: (id) => `/messages/messages/${id}/`,
  },
  notifications: {
    list: '/notifications/notifications/',
    detail: (id) => `/notifications/notifications/${id}/`,
  },
  admin: {
    stats: '/admin/admin/stats/',
    activity: '/admin/admin/activity/',
    moderationQueue: '/admin/admin/moderation-queue/',
    meta: '/admin/admin/meta/',
    settings: '/admin/admin/settings/',
  },
}

export const apiGet = (url, params) => api.get(url, { params }).then((r) => r.data)
export const apiPost = (url, data) => api.post(url, data).then((r) => r.data)
export const apiPatch = (url, data) => api.patch(url, data).then((r) => r.data)
export const apiPut = (url, data) => api.put(url, data).then((r) => r.data)
export const apiDelete = (url) => api.delete(url).then((r) => r.data)