import api from './api'

export const orderApi = {
  list: (params) => api.get('/api/orders/', { params }),
  detail: (id) => api.get(`/api/orders/${id}/`),
  create: (data) => api.post('/api/orders/', data),
  update: (id, data) => api.put(`/api/orders/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/orders/${id}/`, data),
  remove: (id) => api.delete(`/api/orders/${id}/`),
}

export const orderItemApi = {
  list: (params) => api.get('/api/order-items/', { params }),
  create: (data) => api.post('/api/order-items/', data),
  update: (id, data) => api.put(`/api/order-items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/order-items/${id}/`, data),
  remove: (id) => api.delete(`/api/order-items/${id}/`),
}