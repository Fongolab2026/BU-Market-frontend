import api, { endpoints } from "./api";

export const productApi = {
  list: (params) => api.get(endpoints.products.list, { params }),
  detail: (id) => api.get(endpoints.products.detail(id)),
  create: (data) => api.post(endpoints.products.create, data),
  update: (id, data) => api.put(endpoints.products.update(id), data),
  partialUpdate: (id, data) => api.patch(endpoints.products.update(id), data),
  remove: (id) => api.delete(endpoints.products.delete(id)),
};
