import { apiGet } from "../../../../services/api.js";

/** Taille de page max acceptee par la pagination Django. */
export const MAX_PAGE_SIZE = 100;

const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** 1284 -> "1 284" */
export const formatNumber = (value) =>
  String(Number(value) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");

/** 12000.5 -> "12 000" (les centimes sont ignores). */
export const formatPrice = (value) => formatNumber(Math.round(Number(value) || 0));

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "15 fév. 2026" */
const shortDate = (date) =>
  date
    .toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    .replace(".", "");

/** Date seule, sans heure : "15 fév. 2026". */
export const formatDate = (value) => {
  const date = toDate(value);
  return date ? shortDate(date) : "";
};

/** "Aujourd'hui, 09:42" | "Hier, 16:05" | "18 mars 2026" */
export const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return "";
  const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS);
  if (days === 0) return `Aujourd'hui, ${time}`;
  if (days === 1) return `Hier, ${time}`;
  if (days < 7) return shortDate(date);
  return shortDate(date);
};

/** "Il y a 18 min" | "Hier" | "12 sept. 2026" */
export const formatRelative = (value) => {
  const date = toDate(value);
  if (!date) return "Jamais";
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "À l'instant";
  if (diff < 3_600_000) return `Il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < DAY_MS) return `Il y a ${Math.floor(diff / 3_600_000)} h`;
  const days = Math.floor(diff / DAY_MS);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 14) return "Il y a 1 semaine";
  return shortDate(date);
};

/** "+12,5 %" a partir d'un ecart en pourcentage signe. */
export const formatChange = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0 %";
  const sign = number > 0 ? "+" : "";
  return `${sign}${String(number).replace(".", ",")} %`;
};

/** Premiere lettre en majuscule, pour les pastilles d'avatar. */
export const initialsOf = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

/** Retire les filtres "all" / vides pour ne pas les envoyer a l'API. */
export const cleanFilters = (values = {}) => {
  const params = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed || trimmed === "all") continue;
      params[key] = trimmed;
    } else if (value !== "") {
      params[key] = value;
    }
  }
  return params;
};

const isPaginated = (payload) =>
  Boolean(payload) && !Array.isArray(payload) && Array.isArray(payload.results);

/** Normalise toute reponse en { results, total, totalPages, page, perPage }. */
export const toPage = (payload, perPage = MAX_PAGE_SIZE) => {
  if (Array.isArray(payload)) {
    const total = payload.length;
    return {
      results: payload,
      total,
      totalPages: 1,
      page: 1,
      perPage: total || perPage,
    };
  }
  if (isPaginated(payload)) {
    return {
      results: payload.results,
      total: payload.total ?? payload.results.length,
      totalPages: payload.totalPages ?? 1,
      page: payload.page ?? 1,
      perPage: payload.perPage ?? perPage,
    };
  }
  return { results: [], total: 0, totalPages: 1, page: 1, perPage };
};

/**
 * Recupere toutes les pages d'un endpoint pagine.
 * Utilise par les pages admin qui filtrent et paginent cote client.
 */
export const fetchAllPages = async (url, params = {}, limit = MAX_PAGE_SIZE) => {
  const first = toPage(await apiGet(url, { ...cleanFilters(params), page: 1, perPage: limit }), limit);
  if (first.totalPages <= 1) return first.results;

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) =>
      apiGet(url, { ...cleanFilters(params), page: index + 2, perPage: limit }),
    ),
  );
  return [...first.results, ...rest.flatMap((page) => (isPaginated(page) ? page.results : []))];
};

/** Premiere lettre d'un libelle, en majuscule. */
export const capitalize = (value) => {
  const text = String(value || "");
  return text ? text[0].toUpperCase() + text.slice(1) : "";
};

/** Produit renvoye par l'API produits ou imbrique dans une boutique. */
export const mapProduct = (product) => ({
  id: product.id,
  name: product.name || "",
  price: formatPrice(product.price),
  stock: Number(product.stock) || 0,
  status: product.status || "inactive",
  date: formatDate(product.date || product.created_at),
  shopId: product.shopId ?? product.ownerId ?? product.owner_id ?? null,
  shopName: product.shopName || product.shop_name || "",
  shopCategory: product.shopCategory || product.shop_category || "",
  shopStatus: product.shopStatus || "",
  category: product.categoryName || product.category_name || product.category || "",
  categoryId: product.categoryId ?? product.category ?? null,
  mainImage: product.main_image || null,
});

/** Avis renvoye par l'API avis ou imbrique dans une boutique. */
export const mapReview = (review, shopLocation = "") => ({
  id: review.id,
  author: review.author || review.user_username || "",
  note: Number(review.note ?? review.stars) || 0,
  comment: review.comment || "",
  status: review.status || "visible",
  date: formatDateTime(review.date || review.created_at),
  shopId: review.shopId ?? null,
  shopName: review.shopName || "",
  shopLocation,
});

/** Boutique renvoyee par l'API shops (un vendeur = une boutique). */
export const mapShop = (shop, shopLocation = "") => ({
  ...shop,
  id: shop.id,
  name: shop.name || "",
  category: shop.category || "",
  status: shop.status || "pending",
  rating: shop.rating ?? null,
  reviewCount: shop.reviewCount ?? 0,
  createdAt: formatDate(shop.createdAt),
  description: shop.description || "",
  views: formatNumber(shop.views),
  messages: shop.messages ?? 0,
  products: shop.products ?? 0,
  productList: (shop.productList || []).map(mapProduct),
  reviewList: (shop.reviewList || []).map((review) => mapReview(review, shopLocation)),
});

