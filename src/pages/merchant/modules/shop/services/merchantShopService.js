import { apiGet, apiPost, apiPatch, endpoints } from '../../../../../services/api.js'

export const merchantShopEndpoints = {
  detail: endpoints.shops.list,
  create: endpoints.shops.list,
  update: (id) => endpoints.shops.detail(id),
}

export const merchantShopService = {
  get: async () => {
    return await apiGet(endpoints.shops.list)
  },
  create: async (input) => {
    return await apiPost(endpoints.shops.list, input)
  },
  update: async (input) => {
    return await apiPatch(endpoints.shops.detail(input.id), input)
  },
}
