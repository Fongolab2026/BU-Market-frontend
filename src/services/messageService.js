import api from './api'

export const messageApi = {
  list: (params) => api.get('/api/messages/', { params }),
  detail: (id) => api.get(`/api/messages/${id}/`),
  create: (data) => api.post('/api/messages/', data),
  update: (id, data) => api.put(`/api/messages/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/messages/${id}/`, data),
  remove: (id) => api.delete(`/api/messages/${id}/`),
  inbox: (params) => api.get('/api/messages/inbox/', { params }),
  sent: (params) => api.get('/api/messages/sent/', { params }),
  conversation: (userId, params) => api.get(`/api/messages/conversation/${userId}/`, { params }),
}