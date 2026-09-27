import { endpoints, apiGet, apiPatch, apiDelete } from "../../../../../services/api.js";
import { cleanFilters, initialsOf, mapShop, toPage } from "../../shared/adminApi.js";

export const boutiqueEndpoints = {
  list: endpoints.shops.list,
  detail: (id) => endpoints.shops.detail(id),
  update: (id) => endpoints.shops.updateInfo(id),
  validate: (id) => endpoints.shops.validate(id),
  suspend: (id) => endpoints.shops.suspend(id),
  setStatus: (id) => endpoints.shops.setStatus(id),
  remove: (id) => endpoints.shops.remove(id),
};

const toPayload = (input) => ({
  name: (input.name || "").trim(),
  category: (input.category || "").trim(),
  description: (input.description || "").trim(),
});

export const boutiquesService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 6 } = {}) => {
    const params = cleanFilters({ search: query, status, page, perPage });
    const response = toPage(await apiGet(boutiqueEndpoints.list, params), perPage);
    return {
      ...response,
      results: response.results.map((shop) => ({
        ...mapShop(shop),
        ownerInitials: initialsOf(shop.owner),
      })),
    };
  },
  detail: async (id) => mapShop(await apiGet(boutiqueEndpoints.detail(id))),
  validate: async (shopId) => {
    const shop = await apiPatch(boutiqueEndpoints.validate(shopId), {});
    return mapShop(shop);
  },
  suspend: async (shopId) => {
    const shop = await apiPatch(boutiqueEndpoints.suspend(shopId), {});
    return mapShop(shop);
  },
  update: async (shopId, input) => {
    const shop = await apiPatch(boutiqueEndpoints.update(shopId), toPayload(input));
    return mapShop(shop);
  },
  remove: async (shopId) => {
    await apiDelete(boutiqueEndpoints.remove(shopId));
    return true;
  },
};
