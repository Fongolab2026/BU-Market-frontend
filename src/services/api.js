import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

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

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const isAuthUrl = config?.url?.includes('/login/') || config?.url?.includes('/refresh/')
    if (!response || response.status !== 401 || isAuthUrl || config._retried) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return Promise.reject(error)
    }

    config._retried = true
    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${API_URL}/api/auth/refresh/`, { refresh: refreshToken })
        .then(({ data }) => {
          setTokens(data)
          return data.access
        })
        .catch((err) => {
          clearTokens()
          throw err
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    try {
      const access = await refreshPromise
      config.headers.Authorization = `Bearer ${access}`
      return api(config)
    } catch (err) {
      return Promise.reject(err)
    }
  },
)

export default api