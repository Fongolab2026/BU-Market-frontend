import { apiGet, apiPatch, endpoints } from '../../../../../services/api.js'

export const merchantCategoryService = {
  list: async () => {
    return await apiGet(endpoints.categories.list)
  },
  update: async (id, input) => {
    return await apiPatch(endpoints.categories.update(id), input)
  },
}