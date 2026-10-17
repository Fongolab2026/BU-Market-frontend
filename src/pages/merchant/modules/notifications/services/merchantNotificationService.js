import api, { endpoints } from "../../../../../services/api.js";

export const merchantNotificationService = {
  /** Récupère toutes les notifications de l'utilisateur connecté. */
  list: async ({ isRead, type, perPage = 100 } = {}) => {
    const all = [];
    let page = 1;
    let totalPages = 1;
    do {
      const params = { page, perPage };
      if (isRead !== undefined && isRead !== null) params.is_read = isRead;
      if (type) params.type = type;
      const { data } = await api.get(endpoints.notifications.list, { params });
      const results = data.results ?? data;
      if (Array.isArray(results)) all.push(...results);
      totalPages = data.totalPages ?? data.total_pages ?? 1;
      page += 1;
    } while (page <= totalPages);
    return all;
  },

  /** Nombre de notifications non lues (pour le badge du menu). */
  unreadCount: async () => {
    const { data } = await api.get(endpoints.notifications.list, {
      params: { is_read: false, perPage: 1 },
    });
    return data.total ?? 0;
  },

  markRead: async (id) => {
    const { data } = await api.post(endpoints.notifications.markRead(id), {});
    return data;
  },

  markAllRead: async () => {
    await api.post(endpoints.notifications.markAllRead, {});
  },

  remove: async (id) => {
    await api.delete(endpoints.notifications.detail(id));
  },
};
