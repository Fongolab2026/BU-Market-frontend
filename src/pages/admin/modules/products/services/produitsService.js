import { endpoints, api, apiGet, apiPost, apiPatch, apiDelete } from "../../../../../services/api.js";
import { cleanFilters, fetchAllPages, mapProduct, toPage } from "../../shared/adminApi.js";

export const produitEndpoints = {
  list: endpoints.products.list,
  detail: (id) => endpoints.products.detail(id),
  create: endpoints.products.create,
  update: (id) => endpoints.products.update(id),
  remove: (id) => endpoints.products.delete(id),
  setStatus: (id) => endpoints.products.setStatus(id),
  uploadImages: (id) => endpoints.products.uploadImages(id),
};

/** Le formulaire n'expose ni la categorie ni la description : on les deduit. */
const toPayload = (input) => {
  const payload = {
    shopId: input.shopId ? Number(input.shopId) : undefined,
    name: (input.name || "").trim(),
    price: input.price === "" ? "" : Number(String(input.price).replace(/\s/g, "")),
    stock: Number(input.stock) || 0,
  };
  if (input.categoryId) payload.categoryId = Number(input.categoryId);
  if (input.details !== undefined) payload.details = input.details;
  return payload;
};

export const produitsService = {
  /** La page ProduitsPage filtre et pagine cote client : on renvoie tout. */
  list: async ({ query = "", status = "all" } = {}) => {
    const products = await fetchAllPages(produitEndpoints.list, {
      search: query,
      status,
    });
    return products.map(mapProduct);
  },
  listShopOptions: async ({ perPage = 50 } = {}) => {
    const params = cleanFilters({ page: 1, perPage });
    return toPage(await apiGet(endpoints.shops.list, params), perPage);
  },
  create: async (input) => {
    const created = await apiPost(produitEndpoints.create, toPayload(input));
    return mapProduct(created);
  },
  update: async (id, input) => {
    const updated = await apiPatch(produitEndpoints.update(id), toPayload(input));
    return mapProduct(updated);
  },
  updateStatus: async (id, status) => {
    const updated = await apiPatch(produitEndpoints.setStatus(id), { status });
    return mapProduct(updated);
  },
  remove: async (id) => {
    await apiDelete(produitEndpoints.remove(id));
    return true;
  },
  uploadImages: async (productId, files, isMain = true) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("is_main", String(isMain));
    const { data } = await api.post(produitEndpoints.uploadImages(productId), formData);
    return data;
  },
};
