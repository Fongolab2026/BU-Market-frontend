import { adminService } from '../../../../../services/mockAdminService.js'

export const demandeEndpoints = {
  list: '/api/publication-requests/',
  detail: '/api/publication-requests/:id/',
  approve: '/api/publication-requests/:id/approve/',
  reject: '/api/publication-requests/:id/reject/',
}

export const demandesService = {
  list: () => adminService.listRequests(),
  approve: (id) => adminService.updateRequestStatus(id, 'approved'),
  reject: (id) => adminService.updateRequestStatus(id, 'rejected'),
}