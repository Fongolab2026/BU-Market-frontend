import { apiGet, endpoints } from "../../../../../services/api.js";

export const merchantDashboardEndpoints = {
  stats: "/products/products/my-stats/",
  myShop: "/shops/shops/my-shop/",
  myProducts: "/products/products/my-products/",
  myOrders: "/orders/orders/shop-orders/",
};

const ORDER_STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  completed: "Livrée",
  cancelled: "Annulée",
};

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("fr-FR") : "0";
};

const formatPrice = (value) => formatNumber(Math.round(Number(value) || 0));

const formatPercent = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0 %";
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toLocaleString("fr-FR", {
    maximumFractionDigits: 1,
  })} %`;
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const merchantDashboardService = {
  get: async () => {
    const [stats, shop, products, orders, categories] = await Promise.all([
      apiGet(merchantDashboardEndpoints.stats).catch(() => ({})),
      apiGet(merchantDashboardEndpoints.myShop).catch(() => null),
      apiGet(merchantDashboardEndpoints.myProducts).catch(() => ({ results: [] })),
      apiGet(merchantDashboardEndpoints.myOrders).catch(() => ({ results: [] })),
      apiGet(endpoints.categories.list).catch(() => []),
    ]);

    const categoryList = categories?.results ?? categories ?? [];
    const categoryNameById = new Map(
      (Array.isArray(categoryList) ? categoryList : []).map((category) => [
        category.id,
        category.name,
      ]),
    );

    const productList = products?.results ?? products ?? [];
    const orderList = orders?.results ?? orders ?? [];

    const totalProducts = Number(stats.total_products) || 0;
    const activeProducts = Number(stats.active_products) || 0;
    const inactiveProducts =
      Number(stats.inactive_products) ||
      Math.max(totalProducts - activeProducts, 0);
    const shopViews = Number(stats.shop_views) || 0;
    const ordersTotal = Number(stats.orders_total ?? orders?.total) || 0;
    const ordersWeek = Number(stats.orders_week) || 0;
    const ordersPreviousWeek = Number(stats.orders_previous_week) || 0;
    const salesWeek = Number(stats.sales_week) || 0;
    const salesChange = Number(stats.sales_change_percent) || 0;
    const weeklySales = Array.isArray(stats.weekly_sales)
      ? stats.weekly_sales.map((value) => Number(value) || 0)
      : [];
    const weeklySalesDates = Array.isArray(stats.weekly_sales_dates)
      ? stats.weekly_sales_dates
      : [];

    // Construit le fil d'activité à partir des dates brutes, puis trie avant
    // d'afficher : les libellés formatés ne permettent pas un tri fiable.
    const activity = [
      ...orderList.slice(0, 5).map((order) => ({
        id: `order-${order.id}`,
        title: `Commande #${order.id}`,
        description: `Client : ${order.client || "Inconnu"} · ${
          ORDER_STATUS_LABELS[order.status] || order.status
        }`,
        time: formatDateTime(order.created_at),
        createdAt: order.created_at,
        kind: "order",
      })),
      ...productList.slice(0, 5).map((product) => ({
        id: `product-${product.id}`,
        title: `Produit ajouté : ${product.name}`,
        description: `${
          categoryNameById.get(product.category) || "Sans catégorie"
        } · ${formatPrice(product.price)} BIF`,
        time: formatDateTime(product.created_at),
        createdAt: product.created_at,
        kind: "product",
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      stats: [
        {
          id: "sales",
          label: "Ventes (7j)",
          value: `${formatPrice(salesWeek)} BIF`,
          change: formatPercent(salesChange),
          hint: "vs 7 jours précédents",
          trend: salesChange >= 0 ? "up" : "down",
          tone: "brand",
        },
        {
          id: "orders",
          label: "Commandes",
          value: formatNumber(ordersTotal),
          change: `${formatNumber(ordersWeek)} cette semaine`,
          hint: `${formatNumber(ordersPreviousWeek)} la semaine dernière`,
          trend: ordersWeek >= ordersPreviousWeek ? "up" : "down",
          tone: "emerald",
        },
        {
          id: "products",
          label: "Produits actifs",
          value: formatNumber(activeProducts),
          change: inactiveProducts
            ? `${formatNumber(inactiveProducts)} inactif${
                inactiveProducts > 1 ? "s" : ""
              }`
            : "Tous actifs",
          hint: `${formatNumber(totalProducts)} produit${
            totalProducts > 1 ? "s" : ""
          } au total`,
          trend: "up",
          tone: "orange",
        },
        {
          id: "views",
          label: "Vues boutique",
          value: formatNumber(shopViews),
          change: "Cumul boutique",
          hint: "depuis l'ouverture",
          trend: "up",
          tone: "amber",
        },
      ],
      weeklySales,
      weeklySalesDates,
      shop: shop,
      products: productList,
      orders: orderList,
      activity,
    };
  },
};
