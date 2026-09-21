import { apiGet, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const notificationEndpoints = {
  list: endpoints.notifications.list,
  detail: (id) => endpoints.notifications.detail(id),
  markRead: (id) => `/notifications/notifications/${id}/read/`,
  remove: (id) => endpoints.notifications.delete(id),
}

export const notificationsService = {
  list: async ({ query = '', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage }
    return await apiGet(endpoints.notifications.list, params)
  },
  markRead: async (id) => {
    return await apiPatch(`/notifications/notifications/${id}/read/`)
  },
  remove: async (id) => {
    return await apiDelete(endpoints.notifications.delete(id))
  },
}