import { apiGet, apiPatch, endpoints } from '../../../../../services/api.js'

export const merchantOrderEndpoints = {
  list: endpoints.orders.list,
  updateStatus: (id) => `/orders/orders/${id}/status/`,
}

export const merchantOrderService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(endpoints.orders.list, params)
  },
  updateStatus: async (id, status) => {
    return await apiPatch(`/orders/orders/${id}/status/`, { status })
  },
}