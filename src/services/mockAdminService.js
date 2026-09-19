const wait = (value, delay = 180) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), delay))

const dashboardData = {
  stats: [
    { id: 'users', label: 'Utilisateurs inscrits', value: '1 284', change: '+12,5 %', trend: 'up', tone: 'brand' },
    { id: 'shops', label: 'Boutiques actives', value: '326', change: '+8,2 %', trend: 'up', tone: 'violet' },
    { id: 'products', label: 'Produits publiés', value: '2 759', change: '+16,8 %', trend: 'up', tone: 'emerald' },
    { id: 'pending', label: 'À modérer', value: '18', change: '4 nouveaux', trend: 'down', tone: 'amber' },
  ],
  weeklyActivity: [42, 58, 49, 71, 66, 84, 91],
  moderationQueue: [
    { id: 'shop-104', type: 'Boutique', title: 'Saveurs d’Afrique', owner: 'Fatou Diallo', date: 'Aujourd’hui, 09:42', status: 'pending' },
    { id: 'product-572', type: 'Produit', title: 'Sac en raphia naturel', owner: 'Atelier Lumière', date: 'Aujourd’hui, 08:15', status: 'pending' },
    { id: 'review-810', type: 'Avis signalé', title: 'Commentaire à vérifier', owner: 'Client anonyme', date: 'Hier, 17:28', status: 'hidden' },
  ],
  activity: [
    { id: 1, title: 'Nouvelle boutique soumise', description: 'Saveurs d’Afrique attend une validation.', time: 'Il y a 18 min', kind: 'shop' },
    { id: 2, title: 'Compte commerçant validé', description: 'Sarr Mode peut maintenant publier.', time: 'Il y a 1 h', kind: 'user' },
    { id: 3, title: 'Avis signalé par un client', description: 'Un avis sur Maison Koné est à modérer.', time: 'Il y a 3 h', kind: 'alert' },
    { id: 4, title: 'Catégorie ajoutée', description: 'La catégorie “Beauté & soins” est disponible.', time: 'Hier', kind: 'settings' },
  ],
}

const users = [
  { id: 'usr-001', firstName: 'Fatou', lastName: 'Diallo', initials: 'FD', email: 'fatou.diallo@gmail.com', phone: '+225 07 45 21 890', role: 'merchant', status: 'active', joinedAt: '12 sept. 2026', lastActive: 'Il y a 12 min', location: 'Abidjan, Cocody', shop: { id: 'shop-041', name: 'Saveurs d’Afrique', category: 'Alimentation', status: 'validated', rating: 4.8, reviewCount: 46, createdAt: '15 fév. 2026', description: 'Épicerie fine et produits gastronomiques du continent : huiles, épices et condiments sélectionnés avec soin.', views: '8 426', messages: 184, products: 32 } },
  { id: 'usr-002', firstName: 'Ibrahima', lastName: 'Sarr', initials: 'IS', email: 'ibrahima.sarr@gmail.com', phone: '+221 77 312 90', role: 'merchant', status: 'active', joinedAt: '08 sept. 2026', lastActive: 'Il y a 1 h', location: 'Dakar, Plateau', shop: { id: 'shop-038', name: 'Sarr Mode', category: 'Mode & accessoires', status: 'validated', rating: 4.6, reviewCount: 27, createdAt: '12 jan. 2026', description: 'Vêtements et accessoires textiles confectionnés localement, à la fois modernes et authentiques.', views: '5 912', messages: 102, products: 18 } },
  { id: 'usr-003', firstName: 'Awa', lastName: 'Ndiaye', initials: 'AN', email: 'awa.ndiaye@outlook.com', phone: '+221 78 994 254', role: 'merchant', status: 'pending', joinedAt: '05 sept. 2026', lastActive: 'Hier', location: 'Dakar, Almadies', shop: { id: 'shop-104', name: 'Atelier Lumière', category: 'Artisanat', status: 'pending', rating: null, reviewCount: 0, createdAt: '05 sept. 2026', description: 'Atelier d’artisanat contemporain : luminaires, paniers et décoration inspirés des savoir-faire locaux.', views: '0', messages: 0, products: 7 } },
  { id: 'usr-004', firstName: 'Karim', lastName: 'Kouassi', initials: 'KK', email: 'karim.kouassi@gmail.com', phone: '+225 05 88 101 55', role: 'client', status: 'active', joinedAt: '02 sept. 2026', lastActive: 'Il y a 2 jours', location: 'Abidjan, Yopougon', shop: null },
  { id: 'usr-005', firstName: 'Mariam', lastName: 'Koné', initials: 'MK', email: 'mariam.kone@gmail.com', phone: '+225 07 49 455 660', role: 'merchant', status: 'suspended', joinedAt: '27 août 2026', lastActive: 'Il y a 6 jours', location: 'Abidjan, Marcory', shop: { id: 'shop-019', name: 'Maison Koné', category: 'Maison & décoration', status: 'suspended', rating: 3.9, reviewCount: 8, createdAt: '03 mars 2026', description: 'Objets de décoration et petit mobilier pour sublimer le quotidien.', views: '2 111', messages: 31, products: 9 } },
  { id: 'usr-006', firstName: 'Sophie', lastName: 'Lambert', initials: 'SL', email: 'sophie.lambert@gmail.com', phone: '+33 6 12 44 78 21', role: 'client', status: 'active', joinedAt: '25 août 2026', lastActive: 'Il y a 1 semaine', location: 'Cotonou, Ganhi', shop: null },
  { id: 'usr-007', firstName: 'Moussa', lastName: 'Traoré', initials: 'MT', email: 'moussa.traore@gmail.com', phone: '+223 76 12 34 56', role: 'merchant', status: 'active', joinedAt: '22 août 2026', lastActive: 'Aujourd’hui, 07:30', location: 'Bamako, ACI 2000', shop: { id: 'shop-029', name: 'Traoré Bazar', category: 'Électronique', status: 'validated', rating: 4.2, reviewCount: 15, createdAt: '20 avr. 2026', description: 'Accessoires électroniques et petit électroménager à prix serrés.', views: '4 380', messages: 58, products: 24 } },
  { id: 'usr-008', firstName: 'Fatoumata', lastName: 'Camara', initials: 'FC', email: 'fatoumata.camara@outlook.com', phone: '+224 62 33 11 08', role: 'client', status: 'active', joinedAt: '18 août 2026', lastActive: 'Il y a 3 jours', location: 'Conakry, Kaloum', shop: null },
  { id: 'usr-009', firstName: 'Aïcha', lastName: 'Benali', initials: 'AB', email: 'aicha.benali@gmail.com', phone: '+216 22 45 78 30', role: 'client', status: 'active', joinedAt: '11 août 2026', lastActive: 'Il y a 5 jours', location: 'Lomé, Bénin', shop: null },
  { id: 'usr-010', firstName: 'Yacouba', lastName: 'Ouédraogo', initials: 'YO', email: 'yacouba.ouedraogo@gmail.com', phone: '+226 70 84 51 12', role: 'merchant', status: 'pending', joinedAt: '07 août 2026', lastActive: 'Hier', location: 'Ouagadougou, Koulouba', shop: { id: 'shop-087', name: 'Corne de l’Or', category: 'Artisanat', status: 'pending', rating: null, reviewCount: 0, createdAt: '07 août 2026', description: 'Bijoux et objets en bronze fabriqués à la main.', views: '0', messages: 4, products: 11 } },
  { id: 'usr-011', firstName: 'Clarisse', lastName: 'Mensah', initials: 'CM', email: 'clarisse.mensah@gmail.com', phone: '+229 97 14 22 65', role: 'client', status: 'active', joinedAt: '01 août 2026', lastActive: 'Il y a 1 semaine', location: 'Cotonou, Haie Vive', shop: null },
  { id: 'usr-012', firstName: 'Ousmane', lastName: 'Touré', initials: 'OT', email: 'ousmane.toure@gmail.com', phone: '+224 65 20 99 40', role: 'merchant', status: 'active', joinedAt: '28 juil. 2026', lastActive: 'Aujourd’hui, 09:15', location: 'Conakry, Minière', shop: { id: 'shop-011', name: 'Bijoux Touré', category: 'Mode & accessoires', status: 'validated', rating: 4.7, reviewCount: 22, createdAt: '10 juin 2026', description: 'Maroquinerie et bijoux artisanaux en cuir.', views: '6 240', messages: 87, products: 15 } },
  { id: 'usr-013', firstName: 'Aminata', lastName: 'Sow', initials: 'AS', email: 'aminata.sow@gmail.com', phone: '+221 76 55 80 21', role: 'client', status: 'suspended', joinedAt: '15 juil. 2026', lastActive: 'Il y a 2 semaines', location: 'Dakar, Parcelles Assainies', shop: null },
  { id: 'usr-014', firstName: 'Papa', lastName: 'Gueye', initials: 'PG', email: 'papa.gueye@gmail.com', phone: '+221 77 21 46 09', role: 'merchant', status: 'suspended', joinedAt: '03 juil. 2026', lastActive: 'Il y a 3 semaines', location: 'Dakar, Grand Yoff', shop: { id: 'shop-055', name: 'Approvisionnement Gueye', category: 'Alimentation', status: 'suspended', rating: 3.5, reviewCount: 4, createdAt: '19 juin 2026', description: 'Grossiste en produits d’épicerie et boissons.', views: '980', messages: 12, products: 6 } },
  { id: 'usr-015', firstName: 'Chloé', lastName: 'Rousseau', initials: 'CR', email: 'chloe.rousseau@gmail.com', phone: '+33 7 84 20 41 77', role: 'client', status: 'active', joinedAt: '20 juin 2026', lastActive: 'Il y a 1 semaine', location: 'Libreville, Glass', shop: null },
]

let settings = { platformName: 'VIMA — Virtual Market', supportEmail: 'support@bumarket.app', phone: '+225 07 49 00 20 30', defaultLanguage: 'fr', moderation: { requireShopApproval: true, requireProductApproval: false, hideReportedReviews: true }, categories: [{ id: 'cat-01', name: 'Mode & accessoires', count: 64 }, { id: 'cat-02', name: 'Alimentation', count: 52 }, { id: 'cat-03', name: 'Artisanat', count: 47 }, { id: 'cat-04', name: 'Maison & décoration', count: 38 }, { id: 'cat-05', name: 'Beauté & soins', count: 29 }, { id: 'cat-06', name: 'Électronique', count: 21 }] }

export const adminService = {
  getDashboard: () => wait(dashboardData),
  listUsers: ({ query = '', role = 'all', status = 'all', page = 1, perPage = 5 } = {}) => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = users.filter((user) => { const content = `${user.firstName} ${user.lastName} ${user.email} ${user.shop?.name || ''}`.toLowerCase(); return (!normalizedQuery || content.includes(normalizedQuery)) && (role === 'all' || user.role === role) && (status === 'all' || user.status === status) })
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * perPage
    const results = filtered.slice(start, start + perPage)
    return wait({ results, total, totalPages, page: safePage, perPage })
  },
  getUser: (id) => wait(users.find((user) => user.id === id) || null),
  updateUserStatus: (id, status) => { const user = users.find((item) => item.id === id); if (user) { user.status = status; if (user.shop) user.shop.status = status === 'active' ? 'validated' : status } return wait(user) },
  getSettings: () => wait(settings),
  updateSettings: (nextSettings) => { settings = { ...settings, ...nextSettings }; return wait(settings) },
  addCategory: (name) => { settings.categories = [...settings.categories, { id: `cat-${Date.now()}`, name, count: 0 }]; return wait(settings.categories) },
  removeCategory: (id) => { settings.categories = settings.categories.filter((category) => category.id !== id); return wait(settings.categories) },
}

// Point d'intégration : remplacer les méthodes ci-dessus par les appels Axios vers
// /api/v1/admin/stats/, /api/v1/users/ et /api/v1/categories/ quand le backend sera prêt.