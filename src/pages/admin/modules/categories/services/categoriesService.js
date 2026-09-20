import { adminService } from '../../../../../services/mockAdminService.js'

export const categorieEndpoints = {
  list: '/api/categories/',
  detail: '/api/categories/:id/',
  create: '/api/categories/',
  update: '/api/categories/:id/',
  remove: '/api/categories/:id/',
}

export const categoriesService = {
  list: () => adminService.listCategories(),
  create: (name) => adminService.addCategory(name),
  update: (id, name) => adminService.renameCategory(id, name),
  remove: (id) => adminService.removeCategory(id),
}