import api from './api'

export const productApi = {
  list: (params) => api.get('/api/products/', { params }),
  detail: (id) => api.get(`/api/products/${id}/`),
  create: (data) => api.post('/api/products/', data),
  update: (id, data) => api.put(`/api/products/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/products/${id}/`, data),
  remove: (id) => api.delete(`/api/products/${id}/`),
}