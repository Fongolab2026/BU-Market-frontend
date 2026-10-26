import { endpoints, apiGet, apiPatch, apiDelete } from "../../../../../services/api.js";
import { fetchAllPages, mapReview } from "../../shared/adminApi.js";

export const avisEndpoints = {
  list: endpoints.reviews.list,
  detail: (id) => endpoints.reviews.detail(id),
  hide: (id) => endpoints.reviews.hide(id),
  reveal: (id) => endpoints.reviews.reveal(id),
  remove: (id) => endpoints.reviews.delete(id),
  // Avis déposés sur une boutique entière : endpoints distincts.
  shopList: endpoints.shopReviews.list,
  shopHide: (id) => endpoints.shopReviews.hide(id),
  shopReveal: (id) => endpoints.shopReviews.reveal(id),
  shopRemove: (id) => endpoints.shopReviews.delete(id),
};

/**
 * L'API avis ne renvoie pas la ville de la boutique : on la deduit du vendeur.
 * `type` ("product" | "shop") est conserve car `mapReview` construit un objet
 * neuf : il indique quel endpoint utiliser pour masquer/supprimer.
 */
const withShopLocation = async (reviews) => {
  const shopIds = [...new Set(reviews.map((review) => review.shopId).filter(Boolean))];
  if (shopIds.length === 0) {
    return reviews.map((review) => ({ ...mapReview(review), type: review.type || "product" }));
  }

  const locations = new Map();
  await Promise.all(
    shopIds.map(async (shopId) => {
      const user = await apiGet(endpoints.users.detail(shopId)).catch(() => null);
      if (user) locations.set(shopId, user.location || "");
    }),
  );
  return reviews.map((review) => ({
    ...mapReview(review, locations.get(review.shopId) || ""),
    type: review.type || "product",
  }));
};

export const avisService = {
  /** AvisPage filtre et pagine cote client : on renvoie tous les avis. */
  list: async ({ query = "", status = "all" } = {}) => {
    const [productReviews, shopReviews] = await Promise.all([
      fetchAllPages(avisEndpoints.list, { search: query, status }),
      // L'endpoint avis boutique n'expose pas les memes filtres serveur :
      // on recupere tout et la page filtre cote client.
      fetchAllPages(avisEndpoints.shopList, {}).catch(() => []),
    ]);
    return withShopLocation([
      ...productReviews.map((review) => ({ ...review, type: "product" })),
      ...shopReviews.map((review) => ({ ...review, type: "shop" })),
    ]);
  },
  /** Masque ou restitue un avis (produit ou boutique) selon son type. */
  updateStatus: async (review, status) => {
    const isShop = review.type === "shop";
    const url =
      status === "visible"
        ? isShop
          ? avisEndpoints.shopReveal(review.id)
          : avisEndpoints.reveal(review.id)
        : isShop
          ? avisEndpoints.shopHide(review.id)
          : avisEndpoints.hide(review.id);
    return mapReview(await apiPatch(url, {}));
  },
  remove: async (review) => {
    const url = review.type === "shop" ? avisEndpoints.shopRemove(review.id) : avisEndpoints.remove(review.id);
    await apiDelete(url);
    return true;
  },
};
