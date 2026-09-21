import api, { endpoints } from './api'

export const authApi = {
  login: (credentials) => api.post(endpoints.auth.login, credentials),
  register: (userData) => api.post(endpoints.users.list, userData),
  refresh: (refresh) => api.post(endpoints.auth.refresh, { refresh }),
  getProfile: (id) => api.get(endpoints.users.detail(id)),
  listUsers: (params) => api.get(endpoints.users.list, { params }),
}