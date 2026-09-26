import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const messageEndpoints = {
  list: endpoints.messages.list,
  detail: (id) => endpoints.messages.detail(id),
  markRead: (id) => endpoints.messages.markRead(id),
  readAll: endpoints.messages.readAll,
  conversations: endpoints.messages.conversations,
}

export const messagesService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await adminService.listConversations({ ...params, perPage })
  },
  markRead: async (id) => {
    return await adminService.markConversationRead(id)
  },
  markAllRead: async () => {
    return await adminService.markAllConversationsRead()
  },
}
