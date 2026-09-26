import { adminService } from '../../../../../services/mockAdminService.js'
import { endpoints } from '../../../../../services/api.js'

export const avisEndpoints = {
  list: endpoints.reviews.list,
  detail: (id) => endpoints.reviews.detail(id),
  hide: (id) => endpoints.reviews.hide(id),
  reveal: (id) => endpoints.reviews.reveal(id),
  remove: (id) => endpoints.reviews.delete(id),
}

export const avisService = {
  list: async ({ query = '', status = 'all', page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage }
    return await adminService.listReviews({ ...params, perPage })
  },
  updateStatus: async (shopId, id, status) => {
    return await adminService.updateReviewStatus(shopId, id, status)
  },
  remove: async (id) => {
    return await adminService.deleteAnyReview(id)
  },
}
