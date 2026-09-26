import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const dashboardEndpoints = {
  stats: endpoints.admin.stats,
  activity: endpoints.admin.activity,
  moderationQueue: endpoints.admin.moderationQueue,
}

export const dashboardService = {
  get: async () => adminService.getDashboard(),
}