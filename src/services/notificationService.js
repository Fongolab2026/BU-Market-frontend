import api from "./api";

export const notificationApi = {
  list: (params) => api.get("/notifications/notifications/", { params }),
  detail: (id) => api.get(`/notifications/notifications/${id}/`),
  create: (data) => api.post("/notifications/notifications/", data),
  update: (id, data) => api.put(`/notifications/notifications/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/notifications/notifications/${id}/`, data),
  remove: (id) => api.delete(`/notifications/notifications/${id}/`),
  markRead: (id) => api.post(`/notifications/notifications/${id}/read/`),
  markAllRead: () => api.post("/notifications/notifications/mark_all_read/"),
};
