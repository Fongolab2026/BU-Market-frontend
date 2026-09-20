import { adminService } from '../../../../../services/mockAdminService.js'

export const boutiqueEndpoints = {
  list: '/api/shops/',
  detail: '/api/shops/:id/',
  update: '/api/shops/:id/',
  validate: '/api/shops/:id/validate/',
  suspend: '/api/shops/:id/suspend/',
  remove: '/api/shops/:id/',
}

export const boutiquesService = {
  list: (params) => adminService.listShops(params),
  validate: (shopId) => adminService.updateShopStatus(shopId, 'validated'),
  suspend: (shopId) => adminService.updateShopStatus(shopId, 'pending'),
  update: (shopId, input) => adminService.updateShopInfo(shopId, input),
  remove: (shopId) => adminService.deleteShop(shopId),
}