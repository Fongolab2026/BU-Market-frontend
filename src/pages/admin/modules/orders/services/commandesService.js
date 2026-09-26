import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const commandeEndpoints = {
  list: endpoints.orders.list,
  detail: (id) => endpoints.orders.detail(id),
  updateStatus: (id) => endpoints.orders.setStatus(id),
}

export const commandesService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await adminService.listOrders({ ...params, perPage })
  },
  updateStatus: async (id, status) => {
    return await adminService.updateOrderStatus(id, status)
  },
}
