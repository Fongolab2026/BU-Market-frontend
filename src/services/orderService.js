import api from './api'

export const orderApi = {
  list: (params) => api.get('/commandes/', { params }),
  detail: (id) => api.get(`/commandes/${id}/`),
  create: (data) => api.post('/commandes/', data),
  update: (id, data) => api.put(`/commandes/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/commandes/${id}/`, data),
  remove: (id) => api.delete(`/commandes/${id}/`),
}

export const orderItemApi = {
  list: (params) => api.get('/commandes/items/', { params }),
  create: (data) => api.post('/commandes/items/', data),
  update: (id, data) => api.put(`/commandes/items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/commandes/items/${id}/`, data),
  remove: (id) => api.delete(`/commandes/items/${id}/`),
}