import { adminService } from '../../../../../services/mockAdminService.js'

export const avisEndpoints = {
  list: '/api/reviews/',
  detail: '/api/reviews/:id/',
  hide: '/api/reviews/:id/hide/',
  reveal: '/api/reviews/:id/reveal/',
  remove: '/api/reviews/:id/',
}

export const avisService = {
  list: () => adminService.listReviews(),
  updateStatus: (shopId, reviewId, status) => adminService.updateReviewStatus(shopId, reviewId, status),
  remove: (shopId, reviewId) => adminService.deleteReview(shopId, reviewId),
}