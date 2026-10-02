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

    // Build activity from recent orders and products
    const activity = [
      ...(orders.results || []).slice(0, 5).map((order) => ({
        id: `order-${order.id}`,
        title: `Commande #${order.id}`,
        description: `Client: ${order.user?.username || 'Inconnu'} - ${order.get_status_display?.() || order.status}`,
        time: order.created_at,
        kind: "order",
      })),
      ...(products.results || []).slice(0, 5).map((product) => ({
        id: `product-${product.id}`,
        title: `Produit ajouté: ${product.name}`,
        description: `${product.categoryName || product.category} - ${product.price} BIF`,
        time: product.created_at,
        kind: "product",
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    // Generate weekly sales data (7 days) - for demo, use the weekly total distributed
    const dailyAverage = Math.floor(weeklySales / 7);
    const weeklySalesData = Array.from({ length: 7 }, (_, i) => dailyAverage + (i % 2 ? 1 : 0) * 10);

    return {
      stats: [
        { id: "sales", label: "Ventes (7j)", value: weeklySales.toLocaleString() + " BIF", change: "+12%", trend: "up", tone: "brand" },
        { id: "orders", label: "Commandes", value: orders.results?.length || 0, change: "+5%", trend: "up", tone: "emerald" },
        { id: "products", label: "Produits actifs", value: activeProductCount, change: `${productCount - activeProductCount} inactifs`, trend: "up", tone: "violet" },
        { id: "views", label: "Vues boutique", value: totalViews.toLocaleString(), change: "+8%", trend: "up", tone: "amber" },
      ],
      weeklySales: weeklySalesData,
      shop: shop,
      products: products.results || [],
      orders: orders.results || [],
      activity,
    };
  },
};