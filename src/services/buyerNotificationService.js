import api, { endpoints } from "./api.js";

export const BUYER_NOTIFICATIONS_UPDATED = "buyer-notifications-updated";

/** Prévient la barre de navigation qu'un compteur doit être rafraîchi. */
export const notifyBuyerNotificationsUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BUYER_NOTIFICATIONS_UPDATED));
  }
};

export const buyerNotificationService = {
  /** Récupère toutes les notifications de l'acheteur connecté. */
  list: async ({ isRead } = {}) => {
    const all = [];
    let page = 1;
    let totalPages = 1;

    do {
      const params = { page, perPage: 100 };
      if (isRead !== undefined && isRead !== null) params.is_read = isRead;

      const { data } = await api.get(endpoints.notifications.list, { params });
      const results = data.results ?? data;
      if (Array.isArray(results)) all.push(...results);
      totalPages = data.totalPages ?? data.total_pages ?? 1;
      page += 1;
    } while (page <= totalPages);

    return all;
  },

  /** Nombre de notifications non lues, utilisé par la pastille du menu. */
  unreadCount: async () => {
    const { data } = await api.get(endpoints.notifications.unreadCount);
    return Number(data?.count) || 0;
  },

  markRead: async (id) => {
    const { data } = await api.post(endpoints.notifications.markRead(id), {});
    notifyBuyerNotificationsUpdated();
    return data;
  },

  markAllRead: async () => {
    await api.post(endpoints.notifications.markAllRead, {});
    notifyBuyerNotificationsUpdated();
  },
};
