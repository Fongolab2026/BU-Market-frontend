import { apiGet, apiPatch, apiDelete } from '../../../../../services/api.js'

export const avisEndpoints = {
  list: '/reviews/reviews/',
  detail: (id) => `/reviews/reviews/${id}/`,
  hide: (id) => `/reviews/reviews/${id}/hide/`,
  reveal: (id) => `/reviews/reviews/${id}/reveal/`,
  remove: (id) => `/reviews/reviews/${id}/`,
}

export const avisService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(avisEndpoints.list, params)
  },
  updateStatus: async (id, status) => {
    const endpoint = status === 'hidden' ? avisEndpoints.hide(id) : avisEndpoints.reveal(id)
    return await apiPatch(endpoint)
  },
  remove: async (id) => {
    return await apiDelete(avisEndpoints.remove(id))
  },
}