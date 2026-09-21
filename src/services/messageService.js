import api from './api'

export const messageApi = {
  list: (params) => api.get('/messages/', { params }),
  detail: (id) => api.get(`/messages/${id}/`),
  create: (data) => api.post('/messages/', data),
  update: (id, data) => api.put(`/messages/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/messages/${id}/`, data),
  remove: (id) => api.delete(`/messages/${id}/`),
  inbox: (params) => api.get('/messages/inbox/', { params }),
  sent: (params) => api.get('/messages/sent/', { params }),
  conversation: (userId, params) => api.get(`/messages/conversation/${userId}/`, { params }),
  conversations: () => api.get('/messages/conversations/'),
  send: (data) => api.post('/messages/send/', data),
  markRead: (id) => api.patch(`/messages/${id}/read/`),
  readAll: () => api.patch('/messages/read-all/'),
}
