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
          products: Number(shop.products) || 0,
          rating: Number(shop.rating) || 0,
          reviewCount: Number(shop.reviewCount) || 0,
          views: Number(shop.views) || 0,
        }))
      : [];
  },

  /**
   * Produits publics d'un concurrent.
   * Le backend ne renvoie que les produits actifs pour les autres vendeurs.
   */
  productsByOwner: async (ownerId) => {
    const { data } = await api.get(endpoints.products.list, {
      params: { owner: ownerId, status: "active", perPage: 100 },
    });
    const products = data.results ?? data;
    return Array.isArray(products) ? products : [];
  },

  /** Mes propres produits (tous statuts) pour la comparaison. */
  myProducts: async () => {
    const { data } = await api.get(endpoints.products.myProducts, {
      params: { status: "all", perPage: 100 },
    });
    const products = data.results ?? data;
    return Array.isArray(products) ? products : [];
  },
};
