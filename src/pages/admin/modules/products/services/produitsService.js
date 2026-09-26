import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const produitEndpoints = {
  list: endpoints.products.list,
  detail: (id) => endpoints.products.detail(id),
  create: endpoints.products.create,
  update: (id) => endpoints.products.update(id),
  remove: (id) => endpoints.products.delete(id),
  setStatus: (id) => endpoints.products.setStatus(id),
}

export const produitsService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, perPage }
    return await adminService.listProducts({ ...params, perPage })
  },
  listShopOptions: async () => {
    return await adminService.listShops({ perPage: 100 })
  },
  create: async (input) => {
    return await adminService.createProduct(input.shopId, input)
  },
  update: async (id, input) => {
    return await adminService.updateProduct(input.shopId, id, input)
  },
  updateStatus: async (id, status) => {
    return await adminService.updateAnyProductStatus(id, status)
  },
  remove: async (id) => {
    return await adminService.deleteAnyProduct(id)
  },
  uploadImages: async (productId, files, isMain = true) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    formData.append('is_main', String(isMain))
    return { productId, files: files.length, isMain }
  },
}