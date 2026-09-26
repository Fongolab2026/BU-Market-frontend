import { endpoints } from "../../../../../services/api.js";
import { adminService } from "../../../../../services/mockAdminService.js";

export const notificationEndpoints = {
  list: endpoints.notifications.list,
  detail: (id) => endpoints.notifications.detail(id),
  markRead: (id) => endpoints.notifications.markRead(id),
  remove: (id) => endpoints.notifications.detail(id),
};

export const notificationsService = {
  list: async ({ query = "", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage };
    return await adminService.listNotifications({ ...params, perPage });
  },
  markRead: async (id) => {
    return await adminService.markNotificationRead(id);
  },
  remove: async (id) => {
    return await adminService.deleteNotification(id);
  },
};
