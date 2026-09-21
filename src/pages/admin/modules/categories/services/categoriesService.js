import { apiGet, apiPost, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const categorieEndpoints = {
  list: endpoints.categories.list,
  detail: (id) => endpoints.categories.detail(id),
  create: endpoints.categories.create,
  update: (id) => endpoints.categories.update(id),
  remove: (id) => endpoints.categories.delete(id),
}

export const categoriesService = {
  list: async () => {
    return await apiGet(endpoints.categories.list)
  },
  create: async (input) => {
    return await apiPost(endpoints.categories.create, input)
  },
  update: async (id, input) => {
    return await apiPatch(endpoints.categories.update(id), input)
  },
  remove: async (id) => {
    return await apiDelete(endpoints.categories.delete(id))
  },
}