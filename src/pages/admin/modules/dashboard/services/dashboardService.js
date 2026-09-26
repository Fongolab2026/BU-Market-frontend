import { endpoints } from "../../../../../services/api.js";
import { adminService } from "../../../../../services/mockAdminService.js";

export const dashboardEndpoints = {
  stats: endpoints.admin.stats,
  activity: endpoints.admin.activity,
  moderationQueue: endpoints.admin.moderationQueue,
};

export const dashboardService = {
  get: async () => adminService.getDashboard(),
};
