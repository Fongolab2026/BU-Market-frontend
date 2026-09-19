import api from './api'

export const productApi = {
  list: (params) => api.get('/products/produit/', { params }),
  detail: (id) => api.get(`/products/produit/${id}/`),
  create: (data) => api.post('/products/produit/', data),
  update: (id, data) => api.put(`/products/produit/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/products/produit/${id}/`, data),
  remove: (id) => api.delete(`/products/produit/${id}/`),
}