import api from './api'

export const userApi = {
  list: (params) => api.get('/api/users/', { params }),
  detail: (id) => api.get(`/api/users/${id}/`),
  create: (data) => api.post('/api/users/', data),
  update: (id, data) => api.put(`/api/users/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/users/${id}/`, data),
  remove: (id) => api.delete(`/api/users/${id}/`),
}