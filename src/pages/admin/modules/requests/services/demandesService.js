import { apiGet, apiPatch } from '../../../../../services/api.js'

export const demandeEndpoints = {
  list: '/admin/publication-requests/',
  detail: (id) => `/admin/publication-requests/${id}/`,
  approve: (id) => `/admin/publication-requests/${id}/approve/`,
  reject: (id) => `/admin/publication-requests/${id}/reject/`,
}

export const demandesService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(demandeEndpoints.list, params)
  },
  approve: async (id) => {
    return await apiPatch(demandeEndpoints.approve(id))
  },
  reject: async (id) => {
    return await apiPatch(demandeEndpoints.reject(id))
  },
}