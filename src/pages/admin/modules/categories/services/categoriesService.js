import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const categorieEndpoints = {
  list: endpoints.categories.list,
  detail: (id) => endpoints.categories.detail(id),
  create: endpoints.categories.create,
  update: (id) => endpoints.categories.update(id),
  remove: (id) => endpoints.categories.delete(id),
}

export const categoriesService = {
  list: async () => {
    return await adminService.listCategories()
  },
  create: async (input) => {
    return await adminService.addCategory(input.name)
  },
  update: async (id, input) => {
    return await adminService.renameCategory(id, input.name)
  },
  remove: async (id) => {
    return await adminService.removeCategory(id)
  },
}