import api, { endpoints } from "../../../../../services/api.js";

export const merchantOrderEndpoints = {
  list: endpoints.orders.list,
  updateStatus: (id) => endpoints.orders.setStatus(id),
};

export const merchantOrderService = {
  pendingCount: async () => {
    const { data } = await api.get(endpoints.orders.shopOrders, {
      params: { status: "pending", page: 1, per_page: 1 },
    });
    return Number(data?.total ?? data?.count ?? 0) || 0;
  },
  list: async ({ query = "", status = "all", page = 1, perPage = 100 } = {}) => {
    const all = []
    let currentPage = page
    let totalPages = page
    do {
      const params = { search: query, status, page: currentPage, per_page: perPage };
      const { data } = await api.get(endpoints.orders.shopOrders, { params });
      const orders = data.results ?? data;
      if (Array.isArray(orders)) all.push(...orders);
      totalPages = data.totalPages ?? data.total_pages ?? currentPage;
      currentPage += 1;
    } while (currentPage <= totalPages);
    return all.map((order) => ({
      ...order,
      items: order.items?.length ?? 0,
      total: order.total_price ?? 0,
    }));
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(endpoints.orders.setStatus(id), { status });
    return { ...data, total: data.total_price ?? 0, items: data.items?.length ?? 0 };
  },
};
