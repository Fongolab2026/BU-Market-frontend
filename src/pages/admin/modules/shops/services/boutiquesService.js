import { apiGet, apiPatch, apiDelete } from '../../../../../services/api.js'

const shopsBase = '/admin/shops/'

export const boutiqueEndpoints = {
  list: shopsBase,
  detail: (id) => `${shopsBase}${id}/`,
  update: (id) => `${shopsBase}${id}/`,
  validate: (id) => `${shopsBase}${id}/validate/`,
  suspend: (id) => `${shopsBase}${id}/suspend/`,
  remove: (id) => `${shopsBase}${id}/`,
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