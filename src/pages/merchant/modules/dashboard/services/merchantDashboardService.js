import { apiGet } from '../../../../../services/api.js'
import { mockDashboardData } from '../data/mockDashboard.js'

export const merchantDashboardEndpoints = {
  stats: '/shops/shops/',
  activity: '/shops/shops/',
  weeklySales: '/shops/shops/',
}

export const merchantDashboardService = {
  get: async () => {
    return await new Promise((resolve) => setTimeout(() => resolve(structuredClone(mockDashboardData)), 180))
  },
}
