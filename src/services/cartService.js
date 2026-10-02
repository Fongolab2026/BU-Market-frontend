import api from "./api";

export const cartApi = {
  list: (params) => api.get("/carts/carts/", { params }),
  detail: (id) => api.get(`/carts/${id}/`),
  create: (data) => api.post("/carts/carts/", data),
  update: (id, data) => api.put(`/carts/carts/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/carts/carts/${id}/`, data),
  remove: (id) => api.delete(`/carts/carts/${id}/`),
  addItem: (product, quantity = 1) => api.post("/carts/carts/add-item/", { product, quantity }),
  checkout: () => api.post("/carts/carts/checkout/"),
};

export const cartItemApi = {
  list: (params) => api.get("/carts/cart-items/", { params }),
  create: (data) => api.post("/carts/cart-items/", data),
  update: (id, data) => api.put(`/carts/cart-items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/carts/cart-items/${id}/`, data),
  remove: (id) => api.delete(`/carts/cart-items/${id}/`),
};
