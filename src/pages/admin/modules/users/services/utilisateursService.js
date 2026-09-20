import { adminService } from '../../../../../services/mockAdminService.js'

export const utilisateurEndpoints = {
  list: '/api/users/',
  detail: '/api/users/:id/',
  create: '/api/users/',
  update: '/api/users/:id/',
  remove: '/api/users/:id/',
}

export const utilisateursService = {
  list: (params) => adminService.listUsers(params),
  detail: (id) => adminService.getUser(id),
  create: (input) => adminService.createUser(input),
  update: (id, input) => adminService.updateUser(id, input),
  updateStatus: (id, status) => adminService.updateUserStatus(id, status),
  remove: (id) => adminService.deleteUser(id),
}