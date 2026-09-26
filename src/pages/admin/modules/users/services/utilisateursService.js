import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const utilisateurEndpoints = {
  list: endpoints.users.list,
  detail: (id) => endpoints.users.detail(id),
  create: endpoints.users.create,
  update: (id) => endpoints.users.update(id),
  remove: (id) => endpoints.users.delete(id),
  setStatus: (id) => endpoints.users.setStatus(id),
}

export const utilisateursService = {
  list: async ({ query = '', role = 'all', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, role, status, page, per_page: perPage }
    return await adminService.listUsers({ ...params, perPage })
  },
  detail: async (id) => {
    return await adminService.getUser(id)
  },
  create: async (input) => {
    return await adminService.createUser(input)
  },
  update: async (id, input) => {
    return await adminService.updateUser(id, input)
  },
  updateStatus: async (id, status) => {
    return await adminService.updateUserStatus(id, status)
  },
  remove: async (id) => {
    return await adminService.deleteUser(id)
  },
}