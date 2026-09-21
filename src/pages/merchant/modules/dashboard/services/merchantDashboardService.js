import { apiGet } from '../../../../../services/api.js'

export const merchantDashboardEndpoints = {
  stats: '/merchant/stats/',
  activity: '/merchant/activity/',
  weeklySales: '/merchant/weekly-sales/',
}

export const merchantDashboardService = {
  get: async () => {
    const [stats, activity, weeklySales] = await Promise.all([
      apiGet(merchantDashboardEndpoints.stats),
      apiGet(merchantDashboardEndpoints.activity),
      apiGet(merchantDashboardEndpoints.weeklySales),
    ])
    return { stats, activity, weeklySales }
  },
}