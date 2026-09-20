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
  baseURL: API_URL,
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
    const isAuthUrl = config?.url?.includes('/login/') || config?.url?.includes('/refresh/')
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