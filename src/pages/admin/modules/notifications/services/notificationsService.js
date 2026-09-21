import { apiGet, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const notificationEndpoints = {
  list: endpoints.notifications.list,
  detail: (id) => endpoints.notifications.detail(id),
  markRead: (id) => endpoints.notifications.markRead(id),
  remove: (id) => endpoints.notifications.detail(id),
}

export const notificationsService = {
  list: async ({ query = '', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage }
    return await apiGet(endpoints.notifications.list, params)
  },
  markRead: async (id) => {
    return await apiPatch(endpoints.notifications.markRead(id))
  },
  remove: async (id) => {
    return await apiDelete(endpoints.notifications.detail(id))
  },
}
