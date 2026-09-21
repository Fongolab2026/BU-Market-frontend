import { apiGet, apiPatch, endpoints } from '../../../../../services/api.js'

export const messageEndpoints = {
  list: endpoints.messages.list,
  detail: (id) => endpoints.messages.detail(id),
  markRead: (id) => `/messages/messages/${id}/read/`,
}

export const messagesService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(endpoints.messages.list, params)
  },
  markRead: async (id) => {
    return await apiPatch(`/messages/messages/${id}/read/`)
  },
  markAllRead: async () => {
    // No bulk endpoint in API
    throw new Error('Bulk mark read not implemented')
  },
}