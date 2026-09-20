import { adminService } from '../../../../../services/mockAdminService.js'

export const commandeEndpoints = {
  list: '/api/orders/',
  detail: '/api/orders/:id/',
  updateStatus: '/api/orders/:id/status/',
}

export const commandesService = {
  list: (params) => adminService.listOrders(params),
  updateStatus: (id, status) => adminService.updateOrderStatus(id, status),
}