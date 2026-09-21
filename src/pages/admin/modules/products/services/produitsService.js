import { apiGet, apiPost, apiPatch, apiDelete, endpoints } from '../../../../../services/api.js'

export const produitEndpoints = {
  list: endpoints.products.list,
  detail: (id) => endpoints.products.detail(id),
  create: endpoints.products.create,
  update: (id) => endpoints.products.update(id),
  remove: (id) => endpoints.products.delete(id),
  setStatus: (id) => endpoints.products.setStatus(id),
}

export const produitsService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, perPage }
    return await apiGet(endpoints.products.list, params)
  },
  listShopOptions: async () => {
    return await apiGet('/shops/shops/', { perPage: 100 })
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
  uploadImages: async (productId, files, isMain = true) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    formData.append('is_main', String(isMain))
    const { default: api } = await import('../../../../../services/api.js')
    const { data } = await api.post(`/products/products/${productId}/images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}