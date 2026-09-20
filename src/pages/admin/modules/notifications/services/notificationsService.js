import { adminService } from '../../../../../services/mockAdminService.js'

export const notificationEndpoints = {
  list: '/api/notifications/',
  detail: '/api/notifications/:id/',
  markRead: '/api/notifications/:id/read/',
  remove: '/api/notifications/:id/',
}

export const notificationsService = {
  list: (params) => adminService.listNotifications(params),
  markRead: (id) => adminService.markNotificationRead(id),
  remove: (id) => adminService.deleteNotification(id),
}