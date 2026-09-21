import { apiGet, apiPost, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const merchantProductEndpoints = {
  list: endpoints.products.list,
  create: endpoints.products.create,
  update: (id) => endpoints.products.update(id),
  updateStatus: (id) => endpoints.products.setStatus(id),
  remove: (id) => endpoints.products.delete(id),
}

export const merchantProductService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await apiGet(endpoints.products.list, params)
  },
  create: async (input) => {
    return await apiPost(endpoints.products.create, input)
  },
  update: async (id, input) => {
    return await apiPatch(endpoints.products.update(id), input)
  },
  updateStatus: async (id, status) => {
    return await apiPatch(endpoints.products.setStatus(id), { status })
  },
  remove: async (id) => {
    return await apiDelete(endpoints.products.delete(id))
  },
}