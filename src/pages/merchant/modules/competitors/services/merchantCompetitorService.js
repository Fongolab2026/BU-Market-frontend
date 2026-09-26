import { merchantService } from "../../../../../services/mockMerchantService.js";

export const merchantCompetitorService = {
  list: async () => {
    return await merchantService.listCompetitorShops();
  },
};
