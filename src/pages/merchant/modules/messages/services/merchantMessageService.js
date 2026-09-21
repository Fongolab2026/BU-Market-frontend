import { apiGet, apiPost, apiPatch, endpoints } from '../../../../../services/api.js'

export const merchantMessageEndpoints = {
  list: endpoints.messages.list,
  conversations: endpoints.messages.conversations,
  send: endpoints.messages.create,
  markRead: (id) => endpoints.messages.markRead(id),
}

export const merchantMessageService = {
  list: async ({ query = '', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage }
    return await apiGet(endpoints.messages.list, params)
  },
  conversations: async () => {
    return await apiGet(endpoints.messages.conversations)
  },
  send: async (data) => {
    return await apiPost(endpoints.messages.create, data)
  },
  markRead: async (id) => {
    return await apiPatch(endpoints.messages.markRead(id))
  },
}
