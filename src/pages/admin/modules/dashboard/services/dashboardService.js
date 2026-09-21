import { apiGet, endpoints } from '../../../../../services/api.js'

export const dashboardEndpoints = {
  stats: endpoints.admin.stats,
  activity: endpoints.admin.activity,
  moderationQueue: endpoints.admin.moderationQueue,
}

export const dashboardService = {
  get: async () => {
    const [stats, activity, moderationQueue] = await Promise.all([
      apiGet(endpoints.admin.stats),
      apiGet(endpoints.admin.activity),
      apiGet(endpoints.admin.moderationQueue),
    ])
    return { stats, activity, moderationQueue }
  },
}