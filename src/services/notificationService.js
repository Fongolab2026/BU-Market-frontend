import api from './api'

export const notificationApi = {
  list: (params) => api.get('/api/notifications/', { params }),
  detail: (id) => api.get(`/api/notifications/${id}/`),
  create: (data) => api.post('/api/notifications/', data),
  update: (id, data) => api.put(`/api/notifications/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/notifications/${id}/`, data),
  remove: (id) => api.delete(`/api/notifications/${id}/`),
  markRead: (id) => api.post(`/api/notifications/${id}/mark_read/`),
  markAllRead: () => api.post('/api/notifications/mark_all_read/'),
}