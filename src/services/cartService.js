import api from './api'

export const cartApi = {
  list: (params) => api.get('/paniers/', { params }),
  detail: (id) => api.get(`/paniers/${id}/`),
  create: (data) => api.post('/paniers/', data),
  update: (id, data) => api.put(`/paniers/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/paniers/${id}/`, data),
  remove: (id) => api.delete(`/paniers/${id}/`),
}

export const cartItemApi = {
  list: (params) => api.get('/paniers/items/', { params }),
  create: (data) => api.post('/paniers/items/', data),
  update: (id, data) => api.put(`/paniers/items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/paniers/items/${id}/`, data),
  remove: (id) => api.delete(`/paniers/items/${id}/`),
}