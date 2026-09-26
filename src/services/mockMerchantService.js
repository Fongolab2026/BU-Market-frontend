const wait = (value, delay = 180) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(value)), delay),
  );

const formatPrice = (value) =>
  String(Number(value) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const demoMerchant = {
  id: "usr-merchant-001",
  firstName: "Espoir",
  initials: "E",
  role: "merchant",
};

let shop = {
  id: "shop-merchant-001",
  name: "",
  category: "",
  description: "",
  status: "none",
  rating: 0,
  reviewCount: 0,
  products: 0,
  views: "0",
  createdAt: "",
};

let products = [
  {
    id: "prod-001",
    name: "Huile de tournesol 1 L",
    category: "Alimentation",
    price: "12 000",
    stock: 60,
    status: "active",
    date: "01 mars 2026",
  },
  {
    id: "prod-002",
    name: "Épices mélangées",
    category: "Alimentation",
    price: "3 500",
    stock: 120,
    status: "active",
    date: "12 mars 2026",
  },
  {
    id: "prod-003",
    name: "Sel de table 25 kg",
    category: "Alimentation",
    price: "28 000",
    stock: 40,
    status: "inactive",
    date: "05 avr. 2026",
  },
  {
    id: "prod-004",
    name: "Miel naturel 500 g",
    category: "Alimentation",
    price: "9 500",
    stock: 25,
    status: "active",
    date: "18 avr. 2026",
  },
  {
    id: "prod-005",
    name: "Riz local 25 kg",
    category: "Alimentation",
    price: "45 000",
    stock: 0,
    status: "inactive",
    date: "02 mai 2026",
  },
];

let conversations = [
  {
    id: "conv-001",
    sender: "Plateforme BUMA",
    shop: "Service client",
    avatar: "B",
    message: "Votre boutique a été validée, vous pouvez publier vos produits.",
    time: "Hier",
    unread: 1,
    status: "open",
    thread: [
      {
        from: "them",
        content: "Votre demande de création de boutique a bien été reçue.",
        time: "Il y a 3 jours",
      },
      {
        from: "me",
        content: "Merci, j'attends la validation.",
        time: "Il y a 2 jours",
      },
      {
        from: "them",
        content:
          "Votre boutique a été validée, vous pouvez publier vos produits.",
        time: "Hier",
      },
    ],
  },
  {
    id: "conv-002",
    sender: "Marie Niyonkuru",
    shop: "Client",
    avatar: "MN",
    message: "Bonjour, le miel est-il encore disponible ?",
    time: "Il y a 2 h",
    unread: 2,
    status: "open",
    thread: [
      {
        from: "them",
        content: "Bonjour, le miel est-il encore disponible ?",
        time: "Il y a 2 h",
      },
    ],
  },
  {
    id: "conv-003",
    sender: "Abdul Kamariza",
    shop: "Client",
    avatar: "AK",
    message: "La livraison de ma commande est bien notée, merci.",
    time: "Il y a 5 h",
    unread: 0,
    status: "open",
    thread: [
      {
        from: "them",
        content: "La livraison de ma commande est bien notée, merci.",
        time: "Il y a 5 h",
      },
      { from: "me", content: "Merci à vous, à bientôt !", time: "Il y a 4 h" },
    ],
  },
];

const orders = [
  {
    id: "CMD-1042",
    client: "Marie Niyonkuru",
    items: 2,
    total: "24 500",
    status: "pending",
    date: "Aujourd’hui, 09:12",
  },
  {
    id: "CMD-1041",
    client: "Abdul Kamariza",
    items: 1,
    total: "12 000",
    status: "shipped",
    date: "Hier, 16:40",
  },
  {
    id: "CMD-1038",
    client: "Clarisse Ndayizeye",
    items: 3,
    total: "45 000",
    status: "completed",
    date: "Il y a 2 jours",
  },
  {
    id: "CMD-1035",
    client: "Jean Bosco Habimana",
    items: 1,
    total: "9 500",
    status: "pending",
    date: "Il y a 3 jours",
  },
];

const categories = [
  {
    id: "cat-001",
    name: "Alimentation",
    slug: "alimentation",
    description: "Produits alimentaires et boissons",
    icon: "apple",
    productCount: 124,
    active: true,
  },
  {
    id: "cat-002",
    name: "Mode & accessoires",
    slug: "mode-accessoires",
    description: "Vêtements, chaussures, accessoires",
    icon: "shirt",
    productCount: 89,
    active: true,
  },
  {
    id: "cat-003",
    name: "Artisanat",
    slug: "artisanat",
    description: "Objets faits main, décoration",
    icon: "wrench",
    productCount: 56,
    active: true,
  },
  {
    id: "cat-004",
    name: "Maison & décoration",
    slug: "maison-decoration",
    description: "Meubles, luminaires, déco",
    icon: "house",
    productCount: 67,
    active: true,
  },
  {
    id: "cat-005",
    name: "Beauté & soins",
    slug: "beaute-soins",
    description: "Cosmétiques, hygiène, bien-être",
    icon: "sparkles",
    productCount: 78,
    active: true,
  },
  {
    id: "cat-006",
    name: "Électronique",
    slug: "electronique",
    description: "Appareils, accessoires tech",
    icon: "smartphone",
    productCount: 45,
    active: false,
  },
];

const competitorShops = [
  {
    id: "shop-002",
    name: "Épicerie du Quartier",
    category: "Alimentation",
    rating: 4.8,
    reviewCount: 156,
    products: 89,
    distance: "1.2 km",
    status: "active",
  },
  {
    id: "shop-003",
    name: "Mode Africaine",
    category: "Mode & accessoires",
    rating: 4.6,
    reviewCount: 98,
    products: 67,
    distance: "2.5 km",
    status: "active",
  },
  {
    id: "shop-004",
    name: "Artisanat Local",
    category: "Artisanat",
    rating: 4.9,
    reviewCount: 234,
    products: 45,
    distance: "0.8 km",
    status: "active",
  },
  {
    id: "shop-005",
    name: "Déco Maison",
    category: "Maison & décoration",
    rating: 4.7,
    reviewCount: 87,
    products: 56,
    distance: "3.1 km",
    status: "active",
  },
  {
    id: "shop-006",
    name: "Beauté Nature",
    category: "Beauté & soins",
    rating: 4.5,
    reviewCount: 112,
    products: 78,
    distance: "1.9 km",
    status: "active",
  },
  {
    id: "shop-007",
    name: "Tech Shop Buja",
    category: "Électronique",
    rating: 4.4,
    reviewCount: 65,
    products: 34,
    distance: "4.2 km",
    status: "active",
  },
];

const dashboardData = {
  stats: [
    {
      id: "sales",
      label: "Ventes du mois",
      value: "318 000 F",
      change: "+16,8 %",
      trend: "up",
      tone: "brand",
    },
    {
      id: "orders",
      label: "Commandes",
      value: "42",
      change: "+9,4 %",
      trend: "up",
      tone: "emerald",
    },
    {
      id: "products",
      label: "Produits publiés",
      value: "4",
      change: "2 brouillons",
      trend: "up",
      tone: "violet",
    },
    {
      id: "views",
      label: "Vues boutique",
      value: "1 284",
      change: "+12,3 %",
      trend: "up",
      tone: "amber",
    },
  ],
  weeklySales: [32, 48, 41, 65, 58, 74, 90],
  activity: [
    {
      id: 1,
      title: "Nouvelle commande reçue",
      description: "CMD-1042 de Marie Niyonkuru pour 24 500 F.",
      time: "Il y a 10 min",
      kind: "order",
    },
    {
      id: 2,
      title: "Produit publié",
      description: "Miel naturel 500 g est maintenant actif.",
      time: "Il y a 2 h",
      kind: "product",
    },
    {
      id: 3,
      title: "Message reçu",
      description: "Marie Niyonkuru vous a écrit.",
      time: "Il y a 2 h",
      kind: "message",
    },
    {
      id: 4,
      title: "Commande livrée",
      description: "CMD-1038 a été marquée comme livrée.",
      time: "Hier",
      kind: "delivery",
    },
  ],
};

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
