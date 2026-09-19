import api from './api'

export const authApi = {
  login: (credentials) => api.post('/users/login/', credentials),
  register: (userData) => api.post('/users/user/', userData),
  refresh: (refresh) => api.post('/users/refresh/', { refresh }),
  getProfile: (id) => api.get(`/users/user/${id}/`),
  listUsers: (params) => api.get('/users/user/', { params }),
}