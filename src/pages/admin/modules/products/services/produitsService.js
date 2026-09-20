import { adminService } from '../../../../../services/mockAdminService.js'

export const produitEndpoints = {
  list: '/api/products/',
  detail: '/api/products/:id/',
  create: '/api/products/',
  update: '/api/products/:id/',
  remove: '/api/products/:id/',
}

export const produitsService = {
  list: () => adminService.listProducts(),
  listShopOptions: () => adminService.listShops({ perPage: 100 }),
  create: (shopId, input) => adminService.createProduct(shopId, input),
  update: (shopId, productId, input) => adminService.updateProduct(shopId, productId, input),
  updateStatus: (shopId, productId, status) => adminService.updateProductStatus(shopId, productId, status),
  remove: (shopId, productId) => adminService.deleteProduct(shopId, productId),
}