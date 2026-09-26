import api from "./api";

export const favoriteApi = {
  list: (params) => api.get("/favorites/", { params }),
  detail: (id) => api.get(`/favorites/${id}/`),
  create: (data) => api.post("/favorites/", data),
  update: (id, data) => api.put(`/favorites/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/favorites/${id}/`, data),
  remove: (id) => api.delete(`/favorites/${id}/`),
};
