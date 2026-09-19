import api from './api'

export const favoriteApi = {
  list: (params) => api.get('/api/favorites/', { params }),
  detail: (id) => api.get(`/api/favorites/${id}/`),
  create: (data) => api.post('/api/favorites/', data),
  update: (id, data) => api.put(`/api/favorites/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/favorites/${id}/`, data),
  remove: (id) => api.delete(`/api/favorites/${id}/`),
}