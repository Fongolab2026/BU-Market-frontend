import { endpoints, apiGet, apiPatch, apiDelete } from "../../../../../services/api.js";
import { fetchAllPages, mapReview } from "../../shared/adminApi.js";

export const avisEndpoints = {
  list: endpoints.reviews.list,
  detail: (id) => endpoints.reviews.detail(id),
  hide: (id) => endpoints.reviews.hide(id),
  reveal: (id) => endpoints.reviews.reveal(id),
  remove: (id) => endpoints.reviews.delete(id),
};

/** L'API avis ne renvoie pas la ville de la boutique : on la deduit du vendeur. */
const withShopLocation = async (reviews) => {
  const shopIds = [...new Set(reviews.map((review) => review.shopId).filter(Boolean))];
  if (shopIds.length === 0) return reviews.map((review) => mapReview(review));

  const locations = new Map();
  await Promise.all(
    shopIds.map(async (shopId) => {
      const user = await apiGet(endpoints.users.detail(shopId)).catch(() => null);
      if (user) locations.set(shopId, user.location || "");
    }),
  );
  return reviews.map((review) => mapReview(review, locations.get(review.shopId) || ""));
};

export const avisService = {
  /** AvisPage filtre et pagine cote client : on renvoie tous les avis. */
  list: async ({ query = "", status = "all" } = {}) => {
    const reviews = await fetchAllPages(avisEndpoints.list, { search: query, status });
    return withShopLocation(reviews);
  },
  updateStatus: async (id, status) => {
    const url = status === "visible" ? avisEndpoints.reveal(id) : avisEndpoints.hide(id);
    return mapReview(await apiPatch(url, {}));
  },
  remove: async (id) => {
    await apiDelete(avisEndpoints.remove(id));
    return true;
  },
};
