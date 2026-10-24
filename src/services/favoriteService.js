import api from "./api";

export const favoriteApi = {
  list: (params) => api.get("/favorites/favorites/", { params }),
  listAll: async (params = {}) => {
    const perPage = 1000
    const first = await api.get("/favorites/favorites/", { params: { ...params, page: 1, perPage } })
    if (Array.isArray(first.data) || !Array.isArray(first.data?.results)) {
      return Array.isArray(first.data) ? first.data : first.data?.results ?? []
    }
    const results = [...first.data.results]
    const totalPages = Number(first.data.totalPages ?? first.data.total_pages ?? 1)
    for (let page = 2; page <= totalPages; page += 1) {
      const { data } = await api.get("/favorites/favorites/", { params: { ...params, page, perPage } })
      results.push(...(Array.isArray(data) ? data : data?.results ?? []))
    }
    return results
  },
  detail: (id) => api.get(`/favorites/favorites/${id}/`),
  create: (data) => api.post("/favorites/favorites/", data),
  update: (id, data) => api.put(`/favorites/favorites/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/favorites/favorites/${id}/`, data),
  remove: (id) => api.delete(`/favorites/favorites/${id}/`),
};

export const reviewApi = {
  list: (params) => api.get("/favorites/reviews/", { params }),
  create: (data) => api.post("/favorites/reviews/", data),
  report: (id) => api.post(`/favorites/reviews/${id}/report/`),
};
