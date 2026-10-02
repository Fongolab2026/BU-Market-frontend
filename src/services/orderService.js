import api from "./api";

export const orderApi = {
  list: (params) => api.get("/orders/orders/", { params }),
  detail: (id) => api.get(`/orders/orders/${id}/`),
  create: (data) => api.post("/orders/orders/", data),
  update: (id, data) => api.put(`/orders/orders/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/orders/orders/${id}/`, data),
  remove: (id) => api.delete(`/orders/orders/${id}/`),
};

export const orderItemApi = {
  list: (params) => api.get("/orders/order-items/", { params }),
  create: (data) => api.post("/orders/order-items/", data),
  update: (id, data) => api.put(`/orders/order-items/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/orders/order-items/${id}/`, data),
  remove: (id) => api.delete(`/orders/order-items/${id}/`),
};
