import api, { endpoints } from "../../../../../services/api.js";

export const merchantCompetitorService = {
  list: async () => {
    const { data } = await api.get(endpoints.shops.list, {
      params: { status: "validated", perPage: 100 },
    });
    const shops = data.results ?? data;
    return Array.isArray(shops)
      ? shops.map((shop) => ({
          ...shop,
          status: shop.status === "validated" ? "active" : "inactive",
          distance: shop.distance || "Non renseignée",
        }))
      : [];
  },
};
