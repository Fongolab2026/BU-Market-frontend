import { apiGet, apiPost, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

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
    return await apiGet(endpoints.users.list, params)
  },
  detail: async (id) => {
    return await apiGet(endpoints.users.detail(id))
  },
  create: async (input) => {
    return await apiPost(endpoints.users.create, input)
  },
  update: async (id, input) => {
    return await apiPatch(endpoints.users.update(id), input)
  },
  updateStatus: async (id, status) => {
    return await apiPatch(endpoints.users.setStatus(id), { status })
  },
  remove: async (id) => {
    return await apiDelete(endpoints.users.delete(id))
  },
}