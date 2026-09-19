import api from './api'

export const authApi = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/users/', userData),
  refresh: (refresh) => api.post('/api/auth/refresh/', { refresh }),
  getProfile: (id) => api.get(`/api/users/${id}/`),
  listUsers: (params) => api.get('/api/users/', { params }),
}