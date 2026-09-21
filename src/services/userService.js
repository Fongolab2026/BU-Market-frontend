import api, { endpoints } from './api'

export const userApi = {
  list: (params) => api.get(endpoints.users.list, { params }),
  detail: (id) => api.get(endpoints.users.detail(id)),
  create: (data) => api.post(endpoints.users.list, data),
  update: (id, data) => api.put(endpoints.users.detail(id), data),
  partialUpdate: (id, data) => api.patch(endpoints.users.detail(id), data),
  remove: (id) => api.delete(endpoints.users.detail(id)),
}