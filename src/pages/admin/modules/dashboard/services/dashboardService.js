import { adminService } from '../../../../../services/mockAdminService.js'

export const dashboardEndpoints = {
  stats: '/api/admin/stats/',
  activity: '/api/admin/activity/',
  moderationQueue: '/api/admin/moderation-queue/',
}

export const dashboardService = {
  get: () => adminService.getDashboard(),
}