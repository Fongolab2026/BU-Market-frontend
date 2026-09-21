import { apiGet, apiPost, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const parametreEndpoints = {
  get: endpoints.admin.settings,
  update: endpoints.admin.settings,
  categories: endpoints.categories.list,
}

export const parametresService = {
  get: async () => {
    return await apiGet(endpoints.admin.settings)
  },
  update: async (nextSettings) => {
    return await apiPatch(endpoints.admin.settings, nextSettings)
  },
  addCategory: async (name) => {
    return await apiPost(endpoints.categories, { name })
  },
  renameCategory: async (id, name) => {
    return await apiPatch(endpoints.categories.detail(id), { name })
  },
  removeCategory: async (id) => {
    return await apiDelete(endpoints.categories.delete(id))
  },
}