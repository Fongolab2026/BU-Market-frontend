import api, { endpoints } from "./api";

export const categoryApi = {
  list: async (params = {}) => {
    const perPage = Math.min(Number(params.perPage) || 1000, 1000)
    const first = await api.get(endpoints.categories.list, {
      params: { ...params, page: 1, perPage },
    })
    if (Array.isArray(first.data) || !Array.isArray(first.data?.results)) return first

    const pages = [first.data.results]
    const totalPages = Number(first.data.totalPages ?? first.data.total_pages ?? 1)
    for (let page = 2; page <= totalPages; page += 1) {
      const { data } = await api.get(endpoints.categories.list, {
        params: { ...params, page, perPage },
      })
      pages.push(Array.isArray(data) ? data : data?.results ?? [])
    }
    return { ...first, data: pages.flat() }
  },
  detail: (id) => api.get(endpoints.categories.detail(id)),
  create: (data) => api.post(endpoints.categories.create, data),
  update: (id, data) => api.put(endpoints.categories.update(id), data),
  partialUpdate: (id, data) => api.patch(endpoints.categories.update(id), data),
  remove: (id) => api.delete(endpoints.categories.delete(id)),
};
