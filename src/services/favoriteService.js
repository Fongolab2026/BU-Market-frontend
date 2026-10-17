import api from "./api";

export const favoriteApi = {
  list: (params) => api.get("/favorites/favorites/", { params }),
  detail: (id) => api.get(`/favorites/favorites/${id}/`),
  create: (data) => api.post("/favorites/favorites/", data),
  update: (id, data) => api.put(`/favorites/favorites/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/favorites/favorites/${id}/`, data),
  remove: (id) => api.delete(`/favorites/favorites/${id}/`),
};
