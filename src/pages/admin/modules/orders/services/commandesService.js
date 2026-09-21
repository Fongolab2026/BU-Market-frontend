import { apiGet, apiPatch, endpoints } from '../../../../../services/api.js'

export const commandeEndpoints = {
  list: endpoints.orders.list,
  detail: (id) => endpoints.orders.detail(id),
  updateStatus: (id) => endpoints.orders.setStatus(id),
}

export const commandesService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(endpoints.orders.list, params)
  },
  updateStatus: async (id, status) => {
    return await apiPatch(endpoints.orders.setStatus(id), { status })
  },
}
