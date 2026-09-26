import api from "./api";

export const orderApi = {
  list: (params) => api.get("/orders/", { params }),
  detail: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post("/orders/", data),
  update: (id, data) => api.put(`/orders/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/orders/${id}/`, data),
  remove: (id) => api.delete(`/orders/${id}/`),
};

export const orderItemApi = {
  list: (params) => api.get("/order-items/", { params }),
  create: (data) => api.post("/order-items/", data),
  update: (id, data) => api.put(`/order-items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/order-items/${id}/`, data),
  remove: (id) => api.delete(`/order-items/${id}/`),
};
