import { apiGet, apiPost, apiPatch } from '../../../../../services/api.js'

export const merchantShopEndpoints = {
  detail: '/merchant/shops/mine/',
  create: '/merchant/shops/',
  update: (id) => `/merchant/shops/${id}/`,
}

export const merchantShopService = {
  get: async () => {
    return await apiGet(merchantShopEndpoints.detail)
  },
  create: async (input) => {
    return await apiPost(merchantShopEndpoints.create, input)
  },
  update: async (input) => {
    return await apiPatch(merchantShopEndpoints.update(input.id), input)
  },
}