import api, { endpoints } from "../../../../../services/api.js";

export const merchantOrderEndpoints = {
  list: endpoints.orders.list,
  updateStatus: (id) => endpoints.orders.setStatus(id),
};

export const merchantOrderService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage };
    const { data } = await api.get(endpoints.orders.shopOrders, { params });
    const orders = data.results ?? data;
    return Array.isArray(orders)
      ? orders.map((order) => ({
          ...order,
          items: order.items?.length ?? 0,
          total: order.total_price ?? 0,
        }))
      : [];
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(endpoints.orders.setStatus(id), { status });
    return { ...data, total: data.total_price ?? 0, items: data.items?.length ?? 0 };
  },
};
