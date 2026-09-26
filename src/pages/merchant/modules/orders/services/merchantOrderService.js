import { merchantService } from '../../../../../services/mockMerchantService.js'
import { endpoints } from '../../../../../services/api.js'

export const merchantOrderEndpoints = {
  list: endpoints.orders.list,
  updateStatus: (id) => endpoints.orders.setStatus(id),
}

export const merchantOrderService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await merchantService.listOrders(params)
  },
  updateStatus: async (id, status) => {
    return await merchantService.updateOrderStatus(id, status)
  },
}
