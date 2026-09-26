import { endpoints, apiGet, apiPatch } from "../../../../../services/api.js"

export const demandesLocationEndpoints = {
  list: endpoints.boutiques.list,
  detail: (id) => endpoints.boutiques.detail(id),
  validate: (id) => endpoints.boutiques.validate(id),
  reject: (id) => endpoints.boutiques.reject(id),
  pendingCount: endpoints.boutiques.list + "pending-count/",
}

export const demandesLocationService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    const response = await apiGet(endpoints.boutiques.list, { params })
    return Array.isArray(response) ? response : (response.results || [])
  },
  validate: async (id) => {
    const { data } = await apiPatch(endpoints.boutiques.validate(id), {})
    return data
  },
  reject: async (id) => {
    const { data } = await apiPatch(endpoints.boutiques.reject(id), {})
    return data
  },
  pendingCount: async () => {
    const response = await apiGet(endpoints.boutiques.list + "pending-count/")
    return response.count
  },
}
