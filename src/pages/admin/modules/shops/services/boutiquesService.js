import { apiGet, apiPatch, apiDelete } from '../../../../../services/api.js'

export const boutiqueEndpoints = {
  list: '/shops/shops/',
  detail: (id) => `/shops/shops/${id}/`,
  update: (id) => `/shops/shops/${id}/`,
  validate: (id) => `/shops/shops/${id}/validate/`,
  suspend: (id) => `/shops/shops/${id}/suspend/`,
  remove: (id) => `/shops/shops/${id}/`,
}

export const boutiquesService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(boutiqueEndpoints.list, params)
  },
  validate: async (shopId) => {
    return await apiPatch(boutiqueEndpoints.validate(shopId))
  },
  suspend: async (shopId) => {
    return await apiPatch(boutiqueEndpoints.suspend(shopId))
  },
  update: async (shopId, input) => {
    return await apiPatch(boutiqueEndpoints.update(shopId), input)
  },
  remove: async (shopId) => {
    return await apiDelete(boutiqueEndpoints.remove(shopId))
  },
}
