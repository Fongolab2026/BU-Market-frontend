import api from './api'

export const cartApi = {
  list: (params) => api.get('/api/carts/', { params }),
  detail: (id) => api.get(`/api/carts/${id}/`),
  create: (data) => api.post('/api/carts/', data),
  update: (id, data) => api.put(`/api/carts/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/carts/${id}/`, data),
  remove: (id) => api.delete(`/api/carts/${id}/`),
}

export const cartItemApi = {
  list: (params) => api.get('/api/cart-items/', { params }),
  create: (data) => api.post('/api/cart-items/', data),
  update: (id, data) => api.put(`/api/cart-items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/cart-items/${id}/`, data),
  remove: (id) => api.delete(`/api/cart-items/${id}/`),
}