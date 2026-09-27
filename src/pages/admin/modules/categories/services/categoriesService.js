import { endpoints, apiPost, apiPatch, apiDelete } from "../../../../../services/api.js";
import { fetchAllPages } from "../../shared/adminApi.js";

export const categorieEndpoints = {
  list: endpoints.categories.list,
  detail: (id) => endpoints.categories.detail(id),
  create: endpoints.categories.create,
  update: (id) => endpoints.categories.update(id),
  remove: (id) => endpoints.categories.delete(id),
};

const mapCategory = (category) => ({
  id: category.id,
  name: category.name || "",
  count: Number(category.count) || 0,
});

export const categoriesService = {
  /** CategoriesPage compte et filtre cote client : on renvoie la liste entiere. */
  list: async () => {
    const categories = await fetchAllPages(categorieEndpoints.list);
    return categories.map(mapCategory);
  },
  create: async (input) => {
    await apiPost(categorieEndpoints.create, { name: (input.name || "").trim() });
    return categoriesService.list();
  },
  update: async (id, input) => {
    await apiPatch(categorieEndpoints.update(id), { name: (input.name || "").trim() });
    return categoriesService.list();
  },
  remove: async (id) => {
    await apiDelete(categorieEndpoints.remove(id));
    return categoriesService.list();
  },
};

export { mapCategory };
