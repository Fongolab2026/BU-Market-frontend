import api from './api'

export const categoryApi = {
  list: (params) => api.get('/api/categories/', { params }),
  detail: (id) => api.get(`/api/categories/${id}/`),
  create: (data) => api.post('/api/categories/', data),
  update: (id, data) => api.put(`/api/categories/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/categories/${id}/`, data),
  remove: (id) => api.delete(`/api/categories/${id}/`),
}