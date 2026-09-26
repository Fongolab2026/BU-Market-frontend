import { endpoints } from "../../../../../services/api.js";
import { merchantService } from "../../../../../services/mockMerchantService.js";

export const merchantShopEndpoints = {
  detail: endpoints.shops.list,
  create: endpoints.shops.list,
  update: (id) => endpoints.shops.detail(id),
};

export const merchantShopService = {
  get: async () => {
    return await merchantService.getMyShop();
  },
  create: async (input) => {
    return await merchantService.createShop(input);
  },
  update: async (input) => {
    return await merchantService.updateShop(input);
  },
};
