import { adminService } from '../../../../../services/mockAdminService.js'

export const parametreEndpoints = {
  get: '/api/settings/',
  update: '/api/settings/',
  categories: '/api/categories/',
}

export const parametresService = {
  get: () => adminService.getSettings(),
  update: (nextSettings) => adminService.updateSettings(nextSettings),
  addCategory: (name) => adminService.addCategory(name),
  renameCategory: (id, name) => adminService.renameCategory(id, name),
  removeCategory: (id) => adminService.removeCategory(id),
}