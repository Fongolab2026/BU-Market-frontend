import { endpoints, apiPatch } from "../../../../../services/api.js";
import { fetchAllPages, formatDateTime, formatPrice } from "../../shared/adminApi.js";

export const demandeEndpoints = {
  list: endpoints.publicationRequests.list,
  detail: (id) => endpoints.publicationRequests.detail(id),
  approve: (id) => endpoints.publicationRequests.approve(id),
  reject: (id) => endpoints.publicationRequests.reject(id),
};

const mapRequest = (request) => ({
  ...request,
  product: {
    ...request.product,
    name: request.product?.name || "",
    category: request.product?.category || "",
    price: formatPrice(request.product?.price),
  },
  seller: request.seller || "",
  shop: request.shop || "",
  date: formatDateTime(request.date || request.created_at),
  status: request.status || "pending",
});

export const demandesService = {
  /** DemandesPage filtre et pagine cote client : on renvoie toutes les demandes. */
  list: async ({ query = "", status = "all" } = {}) => {
    const requests = await fetchAllPages(demandeEndpoints.list, { search: query, status });
    return requests.map(mapRequest);
  },
  approve: async (id) => mapRequest(await apiPatch(demandeEndpoints.approve(id), {})),
  reject: async (id) => mapRequest(await apiPatch(demandeEndpoints.reject(id), {})),
};
