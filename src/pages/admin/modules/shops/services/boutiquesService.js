import { adminService } from "../../../../../services/mockAdminService.js";

export const boutiqueEndpoints = {
  list: "/shops/shops/",
  detail: (id) => `/shops/shops/${id}/`,
  update: (id) => `/shops/shops/${id}/`,
  validate: (id) => `/shops/shops/${id}/validate/`,
  suspend: (id) => `/shops/shops/${id}/suspend/`,
  remove: (id) => `/shops/shops/${id}/`,
};

export const boutiquesService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage };
    return await adminService.listShops({ ...params, perPage });
  },
  validate: async (shopId) => {
    return await adminService.updateShopStatus(shopId, "validated");
  },
  suspend: async (shopId) => {
    return await adminService.updateShopStatus(shopId, "suspended");
  },
  update: async (shopId, input) => {
    return await adminService.updateShopInfo(shopId, input);
  },
  remove: async (shopId) => {
    return await adminService.deleteShop(shopId);
  },
};
