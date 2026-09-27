import { endpoints, apiPatch } from "../../../../../services/api.js";
import { fetchAllPages, formatDateTime, formatPrice } from "../../shared/adminApi.js";

export const commandeEndpoints = {
  list: endpoints.orders.list,
  detail: (id) => endpoints.orders.detail(id),
  updateStatus: (id) => endpoints.orders.setStatus(id),
};

const mapOrder = (order) => ({
  id: `CMD-${order.id}`,
  rawId: order.id,
  client: order.client || "",
  location: order.location || "Non précisée",
  shop: order.shop || "",
  items: Array.isArray(order.items) ? order.items.length : 0,
  total: formatPrice(order.total_price),
  status: order.status || "pending",
  date: formatDateTime(order.date || order.created_at),
});

export const commandesService = {
  /** CommandesPage filtre et pagine cote client : on renvoie toutes les lignes. */
  list: async ({ query = "", status = "all" } = {}) => {
    const orders = await fetchAllPages(commandeEndpoints.list, {
      search: query,
      status,
    });
    return orders.map(mapOrder);
  },
  updateStatus: async (id, status) => {
    const orderId = String(id).replace(/^CMD-/, "");
    const updated = await apiPatch(commandeEndpoints.updateStatus(orderId), { status });
    return mapOrder(updated);
  },
};
