import { adminService } from '../../../../../services/mockAdminService.js'

export const messageEndpoints = {
  list: '/api/messages/',
  detail: '/api/messages/:id/',
  markRead: '/api/messages/:id/read/',
}

export const messagesService = {
  list: (params) => adminService.listConversations(params),
  markRead: (id) => adminService.markConversationRead(id),
  markAllRead: () => adminService.markAllConversationsRead(),
}