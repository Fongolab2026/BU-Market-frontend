import { merchantService } from "../../../../../services/mockMerchantService.js";

export const merchantDashboardEndpoints = {
  stats: "/shops/shops/",
  activity: "/shops/shops/",
  weeklySales: "/shops/shops/",
};

export const merchantDashboardService = {
  get: async () => {
    return await merchantService.getDashboard();
  },
};
