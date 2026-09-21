import { apiGet, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const avisEndpoints = {
  list: endpoints.reviews.list,
  detail: (id) => endpoints.reviews.detail(id),
  hide: (id) => endpoints.reviews.hide(id),
  reveal: (id) => endpoints.reviews.reveal(id),
  remove: (id) => endpoints.reviews.delete(id),
}

export const avisService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(endpoints.reviews.list, params)
  },
  updateStatus: async (id, status) => {
    const endpoint = status === 'hidden' ? avisEndpoints.hide(id) : avisEndpoints.reveal(id)
    return await apiPatch(endpoint)
  },
  remove: async (id) => {
    return await apiDelete(avisEndpoints.remove(id))
  },
}
