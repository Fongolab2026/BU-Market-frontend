import { endpoints, apiGet, apiPatch } from "../../../../../services/api.js";
import { cleanFilters, fetchAllPages, formatDateTime, toPage } from "../../shared/adminApi.js";

export const demandesLocationEndpoints = {
  list: endpoints.boutiques.list,
  detail: (id) => endpoints.boutiques.detail(id),
  validate: (id) => endpoints.boutiques.validate(id),
  reject: (id) => endpoints.boutiques.reject(id),
  pendingCount: endpoints.boutiques.pendingCount,
};

const mapBoutique = (boutique) => ({
  ...boutique,
  companyName: boutique.companyName || "",
  ownerName: boutique.ownerName || "",
  status: boutique.status || "pending",
  date: formatDateTime(boutique.date || boutique.created_at),
});

export const demandesLocationService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 20 } = {}) => {
    const params = cleanFilters({ search: query, status, page, perPage });
    const response = toPage(await apiGet(demandesLocationEndpoints.list, params), perPage);
    return { ...response, results: response.results.map(mapBoutique) };
  },
  listAll: async ({ query = "", status = "all" } = {}) => {
    const boutiques = await fetchAllPages(demandesLocationEndpoints.list, {
      search: query,
      status,
    });
    return boutiques.map(mapBoutique);
  },
  validate: async (id) => {
    const boutique = await apiPatch(demandesLocationEndpoints.validate(id), {});
    return mapBoutique(boutique);
  },
  reject: async (id) => mapBoutique(await apiPatch(demandesLocationEndpoints.reject(id), {})),
  pendingCount: async () => {
    const response = await apiGet(demandesLocationEndpoints.pendingCount);
    return response?.count ?? 0;
  },
};
