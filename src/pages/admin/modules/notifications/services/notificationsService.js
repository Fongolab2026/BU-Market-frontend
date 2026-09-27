import { endpoints, apiPost, apiPatch, apiDelete } from "../../../../../services/api.js";
import { fetchAllPages, formatRelative } from "../../shared/adminApi.js";

export const notificationEndpoints = {
  list: endpoints.notifications.list,
  detail: (id) => endpoints.notifications.detail(id),
  markRead: (id) => endpoints.notifications.markRead(id),
  markAllRead: endpoints.notifications.markAllRead,
  remove: (id) => endpoints.notifications.detail(id),
};

/** L'API renvoie `type` (shop, order, product, alert, message...). */
const mapNotification = (notification) => ({
  id: notification.id,
  title: notification.title || "",
  description: notification.message || "",
  time: formatRelative(notification.time || notification.created_at),
  kind: notification.kind || notification.type || "alert",
  read: Boolean(notification.read ?? notification.is_read),
});

export const notificationsService = {
  /** NotificationsPage filtre cote client : on renvoie toutes les notifications. */
  list: async ({ query = "" } = {}) => {
    const notifications = await fetchAllPages(notificationEndpoints.list, { search: query });
    return notifications.map(mapNotification);
  },
  markRead: async (id) => {
    const updated = await apiPatch(notificationEndpoints.markRead(id), {});
    return mapNotification(updated);
  },
  markAllRead: async () => {
    await apiPost(notificationEndpoints.markAllRead, {});
    return notificationsService.list();
  },
  remove: async (id) => {
    await apiDelete(notificationEndpoints.remove(id));
    return true;
  },
};
