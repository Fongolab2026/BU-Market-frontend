import {
  categories,
  competitorShops,
  dashboardData,
  demoMerchant,
  initialConversations,
  initialProducts,
  initialShop,
  orders,
} from "./mocks/merchantMockData.js";

const wait = (value, delay = 180) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(value)), delay),
  );

const formatPrice = (value) =>
  String(Number(value) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Le mock conserve un état mutable local, comme le ferait un serveur.
let shop = structuredClone(initialShop);
let products = structuredClone(initialProducts);
let conversations = structuredClone(initialConversations);

export const merchantService = {
  getCurrentUser: () => wait(demoMerchant),
  getDashboard: () => wait(dashboardData),
  getMyShop: () => wait(shop),
  createShop: (input) => {
    shop = {
      id: "shop-merchant-001",
      name: input.name.trim(),
      category: input.category,
      description: input.description.trim(),
      status: "pending",
      rating: 0,
      reviewCount: 0,
      products: 0,
      views: "0",
      createdAt: "18 sept. 2026",
    };
    return wait(shop);
  },
  updateShop: (input) => {
    shop = {
      ...shop,
      name: input.name.trim(),
      category: input.category,
      description: input.description.trim(),
    };
    return wait(shop);
  },
  listProducts: ({ query = "", status = "all" } = {}) => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const content = `${product.name} ${product.category}`.toLowerCase();
      const matchesQuery =
        !normalizedQuery || content.includes(normalizedQuery);
      const matchesStatus = status === "all" || product.status === status;
      return matchesQuery && matchesStatus;
    });
    return wait(filtered);
  },
  createProduct: (input) => {
    const product = {
      id: `prod-${Date.now().toString(36)}`,
      name: input.name.trim(),
      category: input.category,
      price: formatPrice(input.price),
      stock: Number(input.stock) || 0,
      status: "active",
      date: "18 sept. 2026",
    };
    products = [...products, product];
    shop = { ...shop, products: products.length };
    return wait(product);
  },
  updateProduct: (id, input) => {
    products = products.map((product) =>
      product.id === id
        ? {
            ...product,
            name: input.name.trim(),
            category: input.category,
            price: formatPrice(input.price),
            stock: Number(input.stock) || 0,
          }
        : product,
    );
    return wait(products.find((product) => product.id === id));
  },
  updateProductStatus: (id, status) => {
    products = products.map((product) =>
      product.id === id ? { ...product, status } : product,
    );
    return wait(products.find((product) => product.id === id));
  },
  deleteProduct: (id) => {
    const target = products.find((product) => product.id === id);
    products = products.filter((product) => product.id !== id);
    shop = { ...shop, products: products.length };
    return wait(target);
  },
  listConversations: () => wait(conversations),
  sendMessage: (conversationId, content) => {
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            unread: 0,
            status: "open",
            message: content,
            time: "À l’instant",
            thread: [
              ...conversation.thread,
              { from: "me", content, time: "À l’instant" },
            ],
          }
        : conversation,
    );
    return wait(
      conversations.find((conversation) => conversation.id === conversationId),
    );
  },
  markConversationRead: (conversationId) => {
    conversations = conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, unread: 0 }
        : conversation,
    );
    return wait(
      conversations.find((conversation) => conversation.id === conversationId),
    );
  },
  listOrders: () => wait(orders),
  updateOrderStatus: (id, status) => {
    const order = orders.find((item) => item.id === id);
    if (order) order.status = status;
    return wait(order);
  },
  listCategories: () => wait(categories),
  createCategory: (input) => {
    const category = {
      id: `cat-${Date.now().toString(36)}`,
      name: input.name,
      slug: input.name.toLowerCase().replace(/\s+/g, "-"),
      description: input.description || "",
      icon: input.icon || "package",
      productCount: 0,
      active: true,
    };
    categories.push(category);
    return wait(category);
  },
  updateCategory: (id, input) => {
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...input };
      return wait(categories[index]);
    }
    return wait(null);
  },
  deleteCategory: (id) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index !== -1) categories.splice(index, 1);
    return wait(true);
  },
  listCompetitorShops: () => wait(competitorShops),
};
