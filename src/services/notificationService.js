import api from './api'

export const notificationApi = {
  list: (params) => api.get('/notifications/', { params }),
  detail: (id) => api.get(`/notifications/${id}/`),
  create: (data) => api.post('/notifications/', data),
  update: (id, data) => api.put(`/notifications/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/notifications/${id}/`, data),
  remove: (id) => api.delete(`/notifications/${id}/`),
  markRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/mark_all_read/'),
}
