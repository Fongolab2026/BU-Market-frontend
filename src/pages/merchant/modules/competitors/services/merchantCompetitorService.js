import { apiGet } from '../../../../../services/api.js'

export const merchantCompetitorService = {
  list: async () => {
    return await apiGet('/shops/shops/')
  },
}
