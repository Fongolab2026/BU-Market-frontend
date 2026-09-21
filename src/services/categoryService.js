import api, { endpoints } from './api'

export const categoryApi = {
  list: (params) => api.get(endpoints.categories.list, { params }),
  detail: (id) => api.get(endpoints.categories.detail(id)),
  create: (data) => api.post(endpoints.categories.create, data),
  update: (id, data) => api.put(endpoints.categories.update(id), data),
  partialUpdate: (id, data) => api.patch(endpoints.categories.update(id), data),
  remove: (id) => api.delete(endpoints.categories.delete(id)),
}