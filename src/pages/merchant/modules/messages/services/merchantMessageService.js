import { apiGet, apiPost, apiPatch, endpoints } from '../../../../../services/api.js'

export const merchantMessageEndpoints = {
  list: endpoints.messages.list,
  send: (id) => `/messages/messages/${id}/reply/`,
  markRead: (id) => `/messages/messages/${id}/read/`,
}

export const merchantMessageService = {
  list: async ({ query = '', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage }
    return await apiGet(endpoints.messages.list, params)
  },
  send: async (conversationId, content) => {
    return await apiPost(`/messages/messages/${conversationId}/reply/`, { content })
  },
  markRead: async (conversationId) => {
    return await apiPatch(`/messages/messages/${conversationId}/read/`)
  },
}