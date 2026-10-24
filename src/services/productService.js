import api, { endpoints } from "./api";

export const productApi = {
  list: (params) => api.get(endpoints.products.list, { params }),
  listAll: async (params = {}) => {
    const perPage = 1000
    const first = await api.get(endpoints.products.list, { params: { ...params, page: 1, perPage } })
    if (Array.isArray(first.data) || !Array.isArray(first.data?.results)) {
      return Array.isArray(first.data) ? first.data : first.data?.results ?? []
    }
    const results = [...first.data.results]
    const totalPages = Number(first.data.totalPages ?? first.data.total_pages ?? 1)
    for (let page = 2; page <= totalPages; page += 1) {
      const { data } = await api.get(endpoints.products.list, { params: { ...params, page, perPage } })
      results.push(...(Array.isArray(data) ? data : data?.results ?? []))
    }
    return results
  },
  detail: (id) => api.get(endpoints.products.detail(id)),
  create: (data) => api.post(endpoints.products.create, data),
  update: (id, data) => api.put(endpoints.products.update(id), data),
  partialUpdate: (id, data) => api.patch(endpoints.products.update(id), data),
  remove: (id) => api.delete(endpoints.products.delete(id)),
};
