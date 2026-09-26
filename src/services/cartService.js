import api from "./api";

export const cartApi = {
  list: (params) => api.get("/carts/", { params }),
  detail: (id) => api.get(`/carts/${id}/`),
  create: (data) => api.post("/carts/", data),
  update: (id, data) => api.put(`/carts/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/carts/${id}/`, data),
  remove: (id) => api.delete(`/carts/${id}/`),
};

export const cartItemApi = {
  list: (params) => api.get("/cart-items/", { params }),
  create: (data) => api.post("/cart-items/", data),
  update: (id, data) => api.put(`/cart-items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/cart-items/${id}/`, data),
  remove: (id) => api.delete(`/cart-items/${id}/`),
};
