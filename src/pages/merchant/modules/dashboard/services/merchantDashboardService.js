import { apiGet } from "../../../../../services/api.js";

export const merchantDashboardEndpoints = {
  stats: "/products/products/my-stats/",
  myShop: "/shops/shops/my-shop/",
  myProducts: "/products/products/my-products/",
  myOrders: "/orders/orders/shop-orders/",
};

export const merchantDashboardService = {
  get: async () => {
    const [stats, shop, products, orders] = await Promise.all([
      apiGet(merchantDashboardEndpoints.stats),
      apiGet(merchantDashboardEndpoints.myShop).catch(() => null),
      apiGet(merchantDashboardEndpoints.myProducts).catch(() => ({ results: [] })),
      apiGet(merchantDashboardEndpoints.myOrders).catch(() => ({ results: [] })),
    ]);

    const productCount = stats.total_products || 0;
    const activeProductCount = stats.active_products || 0;
    const totalViews = stats.total_views || 0;
    const weeklySales = stats.weekly_sales || 0;

    return {
      stats: [
        { id: "sales", label: "Ventes (7j)", value: weeklySales.toLocaleString() + " F", change: "+12%", trend: "up", tone: "brand" },
        { id: "orders", label: "Commandes", value: orders.results?.length || 0, change: "+5%", trend: "up", tone: "emerald" },
        { id: "products", label: "Produits actifs", value: activeProductCount, change: `${productCount - activeProductCount} inactifs`, trend: "up", tone: "violet" },
        { id: "views", label: "Vues boutique", value: totalViews.toLocaleString(), change: "+8%", trend: "up", tone: "amber" },
      ],
      weeklySales: stats.weekly_sales ? [stats.weekly_sales] : [0, 0, 0, 0, 0, 0, 0],
      shop: shop,
      products: products.results || [],
      orders: orders.results || [],
    };
  },
};