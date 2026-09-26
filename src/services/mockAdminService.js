const wait = (value, delay = 180) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), delay))

const formatPrice = (value) => String(Number(value) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const dashboardData = {
  stats: [
    { id: 'users', label: 'Utilisateurs inscrits', value: '1 284', change: '+12,5 %', trend: 'up', tone: 'brand' },
    { id: 'shops', label: 'Boutiques actives', value: '326', change: '+8,2 %', trend: 'up', tone: 'violet' },
    { id: 'products', label: 'Produits publiés', value: '2 759', change: '+16,8 %', trend: 'up', tone: 'emerald' },
    { id: 'pending', label: 'À modérer', value: '18', change: '4 nouveaux', trend: 'down', tone: 'amber' },
  ],
  weeklyActivity: [42, 58, 49, 71, 66, 84, 91],
  moderationQueue: [
    { id: 'shop-104', type: 'Boutique', title: 'Atelier Jade', owner: 'François Mercier', date: 'Aujourd’hui, 09:42', status: 'pending' },
    { id: 'product-572', type: 'Produit', title: 'Sac en raphia naturel', owner: 'Boutique Blanche', date: 'Aujourd’hui, 08:15', status: 'pending' },
    { id: 'review-810', type: 'Avis signalé', title: 'Commentaire à vérifier', owner: 'Client anonyme', date: 'Hier, 17:28', status: 'hidden' },
  ],
  activity: [
    { id: 1, title: 'Nouvelle boutique soumise', description: 'Atelier Jade attend une validation.', time: 'Il y a 18 min', kind: 'shop' },
    { id: 2, title: 'Compte commerçant validé', description: 'Boutique Blanche peut maintenant publier.', time: 'Il y a 1 h', kind: 'user' },
    { id: 3, title: 'Avis signalé par un client', description: 'Un avis sur Maison Dorée est à modérer.', time: 'Il y a 3 h', kind: 'alert' },
    { id: 4, title: 'Catégorie ajoutée', description: 'La catégorie « Beauté & soins » est disponible.', time: 'Hier', kind: 'settings' },
  ],
}

const shop = ({ id, name, category, status, rating, reviewCount, createdAt, description, views, messages, products, productList, reviewList }) => ({ id, name, category, status, rating, reviewCount, createdAt, description, views, messages, products, productList, reviewList })

const productOf = (shopId, index, name, price, stock, status, date) => ({ id: `${shopId}-p${index}`, name, price, stock, status, date })

const reviewOf = (shopId, index, author, note, comment, date, status) => ({ id: `${shopId}-r${index}`, author, note, comment, date, status })

const timeline = (entries) => entries.map(([label, date, kind], index) => ({ id: `evt-${index + 1}`, label, date, kind }))

const users = [
  {
    id: 'usr-001', firstName: 'Espoir', initials: 'E', email: 'espoir.durand@gmail.com', phone: '+257 79 45 62 18', role: 'merchant', status: 'active', joinedAt: '15 fév. 2026', lastActive: 'Il y a 12 min', location: 'Bujumbura, Rohero',
    shop: shop({
      id: 'shop-041', name: 'Maison Claire', category: 'Alimentation', status: 'validated', rating: 4.8, reviewCount: 46, createdAt: '18 fév. 2026', description: 'Épicerie fine : huiles, épices et condiments sélectionnés avec soin.', views: '8 426', messages: 184, products: 32,
      productList: [
        productOf('shop-041', 1, 'Huile de tournesol 1 L', '12 000', 60, 'active', '01 mars 2026'),
        productOf('shop-041', 2, 'Épices mélangées', '3 500', 120, 'active', '12 mars 2026'),
        productOf('shop-041', 3, 'Sel de table 25 kg', '28 000', 40, 'inactive', '05 avr. 2026'),
      ],
      reviewList: [
        reviewOf('shop-041', 1, 'Louise Gautier', 5, 'Produits frais et livraison rapide.', '12 sept. 2026', 'visible'),
        reviewOf('shop-041', 2, 'Thierry Cousin', 4, 'Bon rapport qualité prix.', '02 sept. 2026', 'visible'),
        reviewOf('shop-041', 3, 'Hélène Parmentier', 2, 'Le sel n’était plus disponible.', '28 août 2026', 'hidden'),
      ],
    }),
    timeline: timeline([['Compte créé', '15 fév. 2026', 'account'], ['Boutique « Maison Claire » inscrite', '18 fév. 2026', 'shop'], ['Boutique validée', '20 fév. 2026', 'validation'], ['32 produits publiés', '10 sept. 2026', 'products'], ['46 avis reçus', '12 sept. 2026', 'reviews'], ['Dernière connexion', 'Il y a 12 min', 'login']]),
  },
  {
    id: 'usr-002', firstName: 'Benoît', initials: 'B', email: 'benoit.lambert@gmail.com', phone: '+257 68 31 29 90', role: 'merchant', status: 'active', joinedAt: '22 jan. 2026', lastActive: 'Il y a 1 h', location: 'Bujumbura, Kinindo',
    shop: shop({
      id: 'shop-038', name: 'Boutique Blanche', category: 'Mode & accessoires', status: 'validated', rating: 4.6, reviewCount: 27, createdAt: '12 fév. 2026', description: 'Vêtements et accessoires textiles, modernes et authentiques.', views: '5 912', messages: 102, products: 18,
      productList: [
        productOf('shop-038', 1, 'Robe en wax', '45 000', 15, 'active', '20 fév. 2026'),
        productOf('shop-038', 2, 'Sac à main tressé', '38 000', 22, 'active', '05 mars 2026'),
        productOf('shop-038', 3, 'Écharpe en coton', '15 000', 34, 'inactive', '18 mars 2026'),
      ],
      reviewList: [
        reviewOf('shop-038', 1, 'Manon Chevalier', 5, 'Qualité exceptionnelle, je recommande.', '08 sept. 2026', 'visible'),
        reviewOf('shop-038', 2, 'Olivier Roullet', 3, 'Livraison un peu lente.', '01 sept. 2026', 'visible'),
      ],
    }),
    timeline: timeline([['Compte créé', '22 jan. 2026', 'account'], ['Boutique « Boutique Blanche » inscrite', '12 fév. 2026', 'shop'], ['Boutique validée', '15 fév. 2026', 'validation'], ['18 produits publiés', '06 sept. 2026', 'products'], ['27 avis reçus', '08 sept. 2026', 'reviews'], ['Dernière connexion', 'Il y a 1 h', 'login']]),
  },
  {
    id: 'usr-003', firstName: 'François', initials: 'F', email: 'francois.mercier@outlook.com', phone: '+257 71 99 42 54', role: 'merchant', status: 'pending', joinedAt: '05 sept. 2026', lastActive: 'Hier', location: 'Bujumbura, Nyakabiga',
    shop: shop({
      id: 'shop-104', name: 'Atelier Jade', category: 'Artisanat', status: 'pending', rating: null, reviewCount: 0, createdAt: '05 sept. 2026', description: 'Atelier d’artisanat contemporain : luminaires, paniers et objets décoratifs.', views: '0', messages: 0, products: 7,
      productList: [
        productOf('shop-104', 1, 'Lampe en rotin', '65 000', 6, 'active', '07 sept. 2026'),
        productOf('shop-104', 2, 'Panier décoratif', '24 000', 12, 'active', '07 sept. 2026'),
        productOf('shop-104', 3, 'Garde-robe en osier', '120 000', 3, 'active', '07 sept. 2026'),
      ],
      reviewList: [],
    }),
    timeline: timeline([['Compte créé', '05 sept. 2026', 'account'], ['Boutique « Atelier Jade » inscrite', '05 sept. 2026', 'shop'], ['7 produits publiés', '07 sept. 2026', 'products'], ['En attente de validation', 'Aujourd’hui', 'pending'], ['Dernière connexion', 'Hier', 'login']]),
  },
  { id: 'usr-004', firstName: 'Jules', initials: 'J', email: 'jules.bernard@gmail.com', phone: '+257 76 88 10 15', role: 'client', status: 'active', joinedAt: '02 sept. 2026', lastActive: 'Il y a 2 jours', location: 'Bujumbura, Bwiza', shop: null, timeline: timeline([['Compte créé', '02 sept. 2026', 'account'], ['Dernière connexion', 'Il y a 2 jours', 'login']]) },
  {
    id: 'usr-005', firstName: 'Camille', initials: 'C', email: 'camille.lefevre@gmail.com', phone: '+257 62 45 56 60', role: 'merchant', status: 'suspended', joinedAt: '20 fév. 2026', lastActive: 'Il y a 6 jours', location: 'Bujumbura, Mutanga',
    shop: shop({
      id: 'shop-019', name: 'Maison Dorée', category: 'Maison & décoration', status: 'suspended', rating: 3.9, reviewCount: 8, createdAt: '03 mars 2026', description: 'Objets de décoration et petit mobilier pour embellir le quotidien.', views: '2 111', messages: 31, products: 9,
      productList: [
        productOf('shop-019', 1, 'Vase en céramique', '55 000', 8, 'active', '10 mars 2026'),
        productOf('shop-019', 2, 'Tapis tissé main', '95 000', 4, 'inactive', '22 mars 2026'),
        productOf('shop-019', 3, 'Chandeliers en laiton', '30 000', 10, 'active', '01 avr. 2026'),
      ],
      reviewList: [
        reviewOf('shop-019', 1, 'Émile Berthier', 5, 'Très belle décoration.', '12 juil. 2026', 'visible'),
        reviewOf('shop-019', 2, 'Rémi Toussaint', 2, 'Qualité décevante pour le prix.', '11 août 2026', 'hidden'),
        reviewOf('shop-019', 3, 'Sophie Blanchard', 1, 'Produit reçu abîmé, service client absent.', '09 août 2026', 'hidden'),
      ],
    }),
    timeline: timeline([['Compte créé', '20 fév. 2026', 'account'], ['Boutique « Maison Dorée » inscrite', '03 mars 2026', 'shop'], ['Boutique validée', '05 mars 2026', 'validation'], ['2 signalements reçus', '10 août 2026', 'reviews'], ['Compte suspendu', '27 août 2026', 'suspension'], ['Dernière connexion', 'Il y a 6 jours', 'login']]),
  },
  { id: 'usr-006', firstName: 'Margaux', initials: 'M', email: 'margaux.petit@gmail.com', phone: '+257 69 00 42 36', role: 'client', status: 'active', joinedAt: '25 août 2026', lastActive: 'Il y a 1 semaine', location: 'Bujumbura, Buyenzi', shop: null, timeline: timeline([['Compte créé', '25 août 2026', 'account'], ['Dernière connexion', 'Il y a 1 semaine', 'login']]) },
  {
    id: 'usr-007', firstName: 'Martin', initials: 'M', email: 'martin.duval@gmail.com', phone: '+257 67 12 34 56', role: 'merchant', status: 'active', joinedAt: '20 avr. 2026', lastActive: 'Aujourd’hui, 07:30', location: 'Gitega',
    shop: shop({
      id: 'shop-029', name: 'Coin Électro', category: 'Électronique', status: 'validated', rating: 4.2, reviewCount: 15, createdAt: '25 avr. 2026', description: 'Accessoires électroniques et petit électroménager à prix serrés.', views: '4 380', messages: 58, products: 24,
      productList: [
        productOf('shop-029', 1, 'Chargeur universel', '18 000', 45, 'active', '05 mai 2026'),
        productOf('shop-029', 2, 'Écouteurs Bluetooth', '42 000', 28, 'active', '12 mai 2026'),
        productOf('shop-029', 3, 'Multiprise 4 prises', '12 000', 36, 'inactive', '20 mai 2026'),
      ],
      reviewList: [
        reviewOf('shop-029', 1, 'Grégoire Lemaire', 4, 'Matériel correct et prix intéressant.', '03 sept. 2026', 'visible'),
        reviewOf('shop-029', 2, 'Anouk Pichon', 3, 'La livraison a pris du retard.', '28 août 2026', 'visible'),
      ],
    }),
    timeline: timeline([['Compte créé', '20 avr. 2026', 'account'], ['Boutique « Coin Électro » inscrite', '25 avr. 2026', 'shop'], ['Boutique validée', '28 avr. 2026', 'validation'], ['24 produits publiés', '01 sept. 2026', 'products'], ['15 avis reçus', '05 sept. 2026', 'reviews'], ['Dernière connexion', 'Aujourd’hui, 07:30', 'login']]),
  },
  { id: 'usr-008', firstName: 'Noémie', initials: 'N', email: 'noemie.girard@outlook.com', phone: '+257 61 33 11 08', role: 'client', status: 'active', joinedAt: '18 août 2026', lastActive: 'Il y a 3 jours', location: 'Bujumbura, Kamenge', shop: null, timeline: timeline([['Compte créé', '18 août 2026', 'account'], ['Dernière connexion', 'Il y a 3 jours', 'login']]) },
  { id: 'usr-009', firstName: 'Élodie', initials: 'E', email: 'elodie.fournier@gmail.com', phone: '+257 75 45 78 30', role: 'client', status: 'active', joinedAt: '11 août 2026', lastActive: 'Il y a 5 jours', location: 'Ngozi', shop: null, timeline: timeline([['Compte créé', '11 août 2026', 'account'], ['Dernière connexion', 'Il y a 5 jours', 'login']]) },
  {
    id: 'usr-010', firstName: 'Théo', initials: 'T', email: 'theo.rousseau@gmail.com', phone: '+257 70 84 51 12', role: 'merchant', status: 'pending', joinedAt: '07 août 2026', lastActive: 'Hier', location: 'Muyinga',
    shop: shop({
      id: 'shop-087', name: 'Forge de Bronze', category: 'Artisanat', status: 'pending', rating: null, reviewCount: 0, createdAt: '12 août 2026', description: 'Objets en bronze fabriqués à la main.', views: '0', messages: 4, products: 11,
      productList: [
        productOf('shop-087', 1, 'Bracelet en bronze', '14 000', 20, 'active', '15 août 2026'),
        productOf('shop-087', 2, 'Statuette artisanale', '85 000', 5, 'active', '15 août 2026'),
        productOf('shop-087', 3, 'Collier gravé', '22 000', 15, 'active', '15 août 2026'),
      ],
      reviewList: [],
    }),
    timeline: timeline([['Compte créé', '07 août 2026', 'account'], ['Boutique « Forge de Bronze » inscrite', '12 août 2026', 'shop'], ['11 produits publiés', '15 août 2026', 'products'], ['En attente de validation', 'Aujourd’hui', 'pending'], ['Dernière connexion', 'Hier', 'login']]),
  },
  { id: 'usr-011', firstName: 'Liliane', initials: 'L', email: 'liliane.marchand@gmail.com', phone: '+257 74 14 22 65', role: 'client', status: 'active', joinedAt: '01 août 2026', lastActive: 'Il y a 1 semaine', location: 'Bujumbura, Kanyosha', shop: null, timeline: timeline([['Compte créé', '01 août 2026', 'account'], ['Dernière connexion', 'Il y a 1 semaine', 'login']]) },
  {
    id: 'usr-012', firstName: 'Lucas', initials: 'L', email: 'lucas.renard@gmail.com', phone: '+257 65 20 99 40', role: 'merchant', status: 'active', joinedAt: '02 juin 2026', lastActive: 'Aujourd’hui, 09:15', location: 'Kayanza',
    shop: shop({
      id: 'shop-011', name: 'Cuirs Nobles', category: 'Mode & accessoires', status: 'validated', rating: 4.7, reviewCount: 22, createdAt: '10 juin 2026', description: 'Maroquinerie et bijoux artisanaux en cuir.', views: '6 240', messages: 87, products: 15,
      productList: [
        productOf('shop-011', 1, 'Ceinture en cuir', '25 000', 30, 'active', '15 juin 2026'),
        productOf('shop-011', 2, 'Portefeuille cousu main', '35 000', 18, 'active', '22 juin 2026'),
        productOf('shop-011', 3, 'Sacoche bandoulière', '60 000', 12, 'inactive', '01 juil. 2026'),
      ],
      reviewList: [
        reviewOf('shop-011', 1, 'Constance Barbier', 5, 'Le cuir est vraiment de première qualité.', '05 sept. 2026', 'visible'),
        reviewOf('shop-011', 2, 'Fabrice Olivier', 4, 'Très bon travail artisanal.', '29 août 2026', 'visible'),
      ],
    }),
    timeline: timeline([['Compte créé', '02 juin 2026', 'account'], ['Boutique « Cuirs Nobles » inscrite', '10 juin 2026', 'shop'], ['Boutique validée', '12 juin 2026', 'validation'], ['15 produits publiés', '03 sept. 2026', 'products'], ['22 avis reçus', '06 sept. 2026', 'reviews'], ['Dernière connexion', 'Aujourd’hui, 09:15', 'login']]),
  },
  { id: 'usr-013', firstName: 'Célia', initials: 'C', email: 'celia.fontaine@gmail.com', phone: '+257 72 55 80 21', role: 'client', status: 'suspended', joinedAt: '15 juil. 2026', lastActive: 'Il y a 2 semaines', location: 'Rumonge', shop: null, timeline: timeline([['Compte créé', '15 juil. 2026', 'account'], ['Dernière connexion', 'Il y a 2 semaines', 'login']]) },
  {
    id: 'usr-014', firstName: 'Paul', initials: 'P', email: 'paul.garnier@gmail.com', phone: '+257 77 21 46 09', role: 'merchant', status: 'suspended', joinedAt: '10 juin 2026', lastActive: 'Il y a 3 semaines', location: 'Cibitoke',
    shop: shop({
      id: 'shop-055', name: 'Saveurs du Terroir', category: 'Alimentation', status: 'suspended', rating: 3.5, reviewCount: 4, createdAt: '19 juin 2026', description: 'Grossiste en produits d’épicerie et boissons.', views: '980', messages: 12, products: 6,
      productList: [
        productOf('shop-055', 1, 'Café en grains 1 kg', '16 000', 50, 'active', '25 juin 2026'),
        productOf('shop-055', 2, 'Miel naturel 500 g', '12 000', 35, 'active', '02 juil. 2026'),
        productOf('shop-055', 3, 'Riz local 25 kg', '45 000', 20, 'inactive', '10 juil. 2026'),
      ],
      reviewList: [
        reviewOf('shop-055', 1, 'Nadine Brehier', 4, 'Café aromatique, très bon.', '20 juin 2026', 'visible'),
        reviewOf('shop-055', 2, 'Hugo Clément', 2, 'Stock annoncé mais rupture à la commande.', '28 juin 2026', 'hidden'),
      ],
    }),
    timeline: timeline([['Compte créé', '10 juin 2026', 'account'], ['Boutique « Saveurs du Terroir » inscrite', '19 juin 2026', 'shop'], ['Boutique validée', '22 juin 2026', 'validation'], ['Compte suspendu', '03 juil. 2026', 'suspension'], ['Dernière connexion', 'Il y a 3 semaines', 'login']]),
  },
  { id: 'usr-015', firstName: 'Anaïs', initials: 'A', email: 'anais.roussel@gmail.com', phone: '+257 66 50 29 21', role: 'client', status: 'active', joinedAt: '20 juin 2026', lastActive: 'Il y a 1 semaine', location: 'Bujumbura, Kigobe', shop: null, timeline: timeline([['Compte créé', '20 juin 2026', 'account'], ['Dernière connexion', 'Il y a 1 semaine', 'login']]) },
]

const publicationRequests = [
  { id: 'REQ-001', product: { name: 'Lampe en rotin', category: 'Artisanat', price: '65 000' }, seller: 'François Mercier', shop: 'Atelier Jade', date: 'Aujourd’hui, 09:21', status: 'pending' },
  { id: 'REQ-002', product: { name: 'Robe en wax', category: 'Mode & accessoires', price: '45 000' }, seller: 'Benoît Lambert', shop: 'Boutique Blanche', date: 'Il y a 2 h', status: 'pending' },
  { id: 'REQ-003', product: { name: 'Écharpe de soie', category: 'Mode & accessoires', price: '18 000' }, seller: 'Espoir Durand', shop: 'Maison Claire', date: 'Hier', status: 'pending' },
  { id: 'REQ-004', product: { name: 'Tapis tissé main', category: 'Maison & décoration', price: '95 000' }, seller: 'Camille Lefèvre', shop: 'Maison Dorée', date: 'Il y a 3 jours', status: 'approved' },
  { id: 'REQ-005', product: { name: 'Chargeur universel', category: 'Électronique', price: '18 000' }, seller: 'Martin Duval', shop: 'Coin Électro', date: 'Il y a 5 jours', status: 'approved' },
  { id: 'REQ-006', product: { name: 'Collier gravé', category: 'Artisanat', price: '22 000' }, seller: 'Théo Rousseau', shop: 'Forge de Bronze', date: 'Il y a 8 jours', status: 'rejected' },
]

let settings = {
  platformName: 'BUJA MARKET',
  supportEmail: 'support@bumarket.app',
  phone: '+257 22 30 40 50',
  defaultLanguage: 'fr',
  currency: 'BIF',
  moderation: { requireShopApproval: true, requireProductApproval: false, hideReportedReviews: true },
  notifications: { newShopPending: true, newReportedReview: true, weeklyDigest: false },
  categories: [
    { id: 'cat-01', name: 'Mode & accessoires', count: 64 },
    { id: 'cat-02', name: 'Alimentation', count: 52 },
    { id: 'cat-03', name: 'Artisanat', count: 47 },
    { id: 'cat-04', name: 'Maison & décoration', count: 38 },
    { id: 'cat-05', name: 'Beauté & soins', count: 29 },
    { id: 'cat-06', name: 'Électronique', count: 21 },
  ],
}

const todayLabel = () => new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

const orders = [
  { id: 'CMD-1042', client: 'Jules Bernard', location: 'Bujumbura, Bwiza', shop: 'Maison Claire', items: 3, total: '82 500', status: 'pending', date: 'Aujourd’hui, 10:12' },
  { id: 'CMD-1041', client: 'Margaux Petit', location: 'Bujumbura, Buyenzi', shop: 'Boutique Blanche', items: 2, total: '83 000', status: 'shipped', date: 'Aujourd’hui, 08:40' },
  { id: 'CMD-1040', client: 'Noémie Girard', location: 'Bujumbura, Kamenge', shop: 'Coin Électro', items: 1, total: '18 000', status: 'completed', date: 'Hier, 16:05' },
  { id: 'CMD-1039', client: 'Élodie Fournier', location: 'Ngozi', shop: 'Maison Claire', items: 4, total: '120 500', status: 'pending', date: 'Hier, 11:22' },
  { id: 'CMD-1038', client: 'Liliane Marchand', location: 'Bujumbura, Kanyosha', shop: 'Atelier Jade', items: 2, total: '89 000', status: 'cancelled', date: 'Il y a 2 jours' },
  { id: 'CMD-1037', client: 'Célia Fontaine', location: 'Rumonge', shop: 'Cuirs Nobles', items: 1, total: '25 000', status: 'completed', date: 'Il y a 3 jours' },
  { id: 'CMD-1036', client: 'Anaïs Roussel', location: 'Bujumbura, Kigobe', shop: 'Coin Électro', items: 2, total: '60 000', status: 'shipped', date: 'Il y a 4 jours' },
  { id: 'CMD-1035', client: 'Jules Bernard', location: 'Bujumbura, Bwiza', shop: 'Saveurs du Terroir', items: 3, total: '73 000', status: 'cancelled', date: 'Il y a 5 jours' },
]

const conversations = [
  { id: 'cnv-001', sender: 'Espoir Durand', shop: 'Maison Claire', avatar: 'ED', message: 'Bonjour, la commande est-elle bien arrivée ?', time: 'Il y a 18 min', unread: 2, status: 'open' },
  { id: 'cnv-002', sender: 'Benoît Lambert', shop: 'Boutique Blanche', avatar: 'BL', message: 'Merci pour la validation de notre boutiques.', time: 'Il y a 1 h', unread: 1, status: 'open' },
  { id: 'cnv-003', sender: 'François Mercier', shop: 'Atelier Jade', avatar: 'FM', message: 'Quand notre boutique sera-t-elle examinée ?', time: 'Il y a 3 h', unread: 0, status: 'open' },
  { id: 'cnv-004', sender: 'Martin Duval', shop: 'Coin Électro', avatar: 'MD', message: 'Nous voudrions ajouter de nouveaux produits.', time: 'Hier', unread: 0, status: 'closed' },
  { id: 'cnv-005', sender: 'Lucas Renard', shop: 'Cuirs Nobles', avatar: 'LR', message: 'Une livraison est en retard à Kayanza.', time: 'Il y a 2 jours', unread: 0, status: 'open' },
  { id: 'cnv-006', sender: 'Camille Lefèvre', shop: 'Maison Dorée', avatar: 'CL', message: 'Pouvons-nous réactiver notre compte ?', time: 'Il y a 1 semaine', unread: 0, status: 'closed' },
]

const notifications = [
  { id: 'ntf-001', title: 'Nouvelle boutique en attente', description: 'Atelier Jade souhaite publier sur la plateforme.', time: 'Il y a 18 min', kind: 'shop', read: false },
  { id: 'ntf-002', title: 'Avis signalé', description: 'Un commentaire sur Maison Dorée doit être vérifié.', time: 'Il y a 3 h', kind: 'alert', read: false },
  { id: 'ntf-003', title: 'Commande reçue', description: 'Une nouvelle commande de 82 500 F pour Maison Claire.', time: 'Il y a 5 h', kind: 'order', read: false },
  { id: 'ntf-004', title: 'Catalogue suspendu', description: 'Six produits de Saveurs du Terroir ont été retirés.', time: 'Hier', kind: 'product', read: true },
  { id: 'ntf-005', title: 'Nouveau message', description: 'Espoir Durand vous a écrit au sujet d’une commande.', time: 'Il y a 2 jours', kind: 'message', read: true },
]

let ordersList = [...orders]
let conversationsList = [...conversations]
let notificationsList = [...notifications]

export const adminService = {
  getDashboard: () => wait(dashboardData),
  listUsers: ({ query = '', role = 'all', status = 'all', page = 1, perPage = 5 } = {}) => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = users.filter((user) => {
      const content = `${user.firstName} ${user.email} ${user.shop?.name || ''}`.toLowerCase()
      const matchesQuery = !normalizedQuery || content.includes(normalizedQuery)
      const matchesRole = role === 'all' || user.role === role
      const matchesStatus = status === 'all' || user.status === status
      return matchesQuery && matchesRole && matchesStatus
    })
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * perPage
    const results = filtered.slice(start, start + perPage)
    return wait({ results, total, totalPages, page: safePage, perPage })
  },
  getUser: (id) => wait(users.find((user) => user.id === id) || null),
  createUser: (input) => {
    const initials = `${(input.firstName || '').trim()[0] || ''}`.toUpperCase()
    const user = {
      id: `usr-${Date.now().toString(36)}`,
      firstName: input.firstName.trim(),
      initials,
      email: input.email.trim(),
      phone: input.phone.trim(),
      role: input.role,
      status: 'active',
      joinedAt: todayLabel(),
      lastActive: 'À l’instant',
      location: input.location.trim() || 'Non précisée',
      shop: null,
      timeline: timeline([['Compte créé', todayLabel(), 'account'], ['Dernière connexion', 'À l’instant', 'login']]),
    }
    users.unshift(user)
    return wait(user)
  },
  deleteUser: (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) users.splice(index, 1)
    return wait(true)
  },
  updateUserStatus: (id, status) => {
    const user = users.find((item) => item.id === id)
    if (user) {
      user.status = status
      if (user.shop) user.shop.status = status === 'active' ? 'validated' : status
      if (status === 'active') {
        user.timeline = [...user.timeline, ...timeline([['Compte validé', todayLabel(), 'validation']])]
      } else {
        user.timeline = [...user.timeline, ...timeline([['Compte suspendu', todayLabel(), 'suspension']])]
      }
    }
    return wait(user)
  },
  deleteShop: (shopId) => {
    const user = users.find((item) => item.shop?.id === shopId)
    if (user) {
      user.shop = null
      user.timeline = [...user.timeline, ...timeline([['Boutique supprimée', todayLabel(), 'suspension']])]
    }
    return wait(user)
  },
  updateProductStatus: (shopId, productId, status) => {
    const user = users.find((item) => item.shop?.id === shopId)
    const product = user?.shop?.productList.find((item) => item.id === productId)
    if (product) product.status = status
    return wait(user)
  },
  createProduct: (shopId, input) => {
    const user = users.find((item) => item.shop?.id === shopId)
    if (user?.shop) {
      const index = user.shop.productList.length + 1
      const product = productOf(shopId, index, input.name.trim(), formatPrice(input.price), Number(input.stock) || 0, 'active', todayLabel())
      user.shop.productList = [...user.shop.productList, product]
      user.shop.products += 1
    }
    return wait(user)
  },
  updateProduct: (shopId, productId, input) => {
    const user = users.find((item) => item.shop?.id === shopId)
    const product = user?.shop?.productList.find((item) => item.id === productId)
    if (product) {
      product.name = input.name.trim()
      product.price = formatPrice(input.price)
      product.stock = Number(input.stock) || 0
    }
    return wait(user)
  },
  deleteProduct: (shopId, productId) => {
    const user = users.find((item) => item.shop?.id === shopId)
    if (user?.shop) {
      user.shop.productList = user.shop.productList.filter((item) => item.id !== productId)
      user.shop.products = Math.max(0, user.shop.products - 1)
    }
    return wait(user)
  },
  updateReviewStatus: (shopId, reviewId, status) => {
    const user = users.find((item) => item.shop?.id === shopId)
    const review = user?.shop?.reviewList.find((item) => item.id === reviewId)
    if (review) review.status = status
    return wait(user)
  },
  deleteReview: (shopId, reviewId) => {
    const user = users.find((item) => item.shop?.id === shopId)
    if (user?.shop) {
      user.shop.reviewList = user.shop.reviewList.filter((item) => item.id !== reviewId)
      user.shop.reviewCount = Math.max(0, user.shop.reviewCount - 1)
    }
    return wait(user)
  },
  updateUser: (id, input) => {
    const user = users.find((item) => item.id === id)
    if (user) {
      user.firstName = input.firstName.trim()
      user.initials = `${(user.firstName[0] || '').toUpperCase()}`
      user.email = input.email.trim()
      user.phone = input.phone.trim()
      user.role = input.role
      user.location = input.location.trim() || 'Non précisée'
    }
    return wait(user)
  },
  updateShopInfo: (shopId, input) => {
    const user = users.find((item) => item.shop?.id === shopId)
    if (user?.shop) {
      user.shop.name = input.name.trim()
      user.shop.category = input.category
      user.shop.description = input.description.trim()
      user.timeline = [...user.timeline, ...timeline([['Boutique modifiée', todayLabel(), 'shop']])]
    }
    return wait(user)
  },
  listRequests: () => wait(publicationRequests),
  updateRequestStatus: (id, status) => {
    const request = publicationRequests.find((item) => item.id === id)
    if (request) request.status = status
    return wait(request)
  },
  listProducts: () => {
    const products = users
      .filter((user) => user.shop)
      .flatMap((user) => user.shop.productList.map((product) => ({ ...product, shopId: user.shop.id, shopName: user.shop.name, shopCategory: user.shop.category, shopStatus: user.shop.status })))
    return wait(products)
  },
  listShops: ({ query = '', status = 'all', page = 1, perPage = 6 } = {}) => {
    const normalizedQuery = query.trim().toLowerCase()
    const shops = users
      .filter((user) => user.shop)
      .map((user) => ({ ...user.shop, ownerId: user.id, owner: `${user.firstName}`, ownerInitials: user.initials }))
    const filtered = shops.filter((shop) => {
      const content = `${shop.name} ${shop.category} ${shop.owner}`.toLowerCase()
      const matchesQuery = !normalizedQuery || content.includes(normalizedQuery)
      const matchesStatus = status === 'all' || shop.status === status
      return matchesQuery && matchesStatus
    })
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * perPage
    const results = filtered.slice(start, start + perPage)
    return wait({ results, total, totalPages, page: safePage, perPage })
  },
  updateShopStatus: (shopId, status) => {
    const user = users.find((item) => item.shop?.id === shopId)
    if (user) {
      user.shop.status = status
      user.status = status === 'validated' ? 'active' : 'pending'
      user.timeline = [...user.timeline, ...timeline([[status === 'validated' ? 'Boutique validée' : 'Boutique en attente', todayLabel(), status === 'validated' ? 'validation' : 'pending']])]
    }
    return wait(user)
  },
  listReviews: () => {
    const reviews = users
      .filter((user) => user.shop)
      .flatMap((user) => user.shop.reviewList.map((review) => ({ ...review, shopId: user.shop.id, shopName: user.shop.name, shopLocation: user.location })))
    return wait(reviews)
  },
  getSettings: () => wait(settings),
  updateSettings: (nextSettings) => {
    settings = { ...settings, ...nextSettings }
    return wait(settings)
  },
  addCategory: (name) => {
    settings.categories = [...settings.categories, { id: `cat-${Date.now().toString(36)}`, name, count: 0 }]
    return wait(settings.categories)
  },
  renameCategory: (id, name) => {
    const category = settings.categories.find((item) => item.id === id)
    if (category) category.name = name
    return wait(settings.categories)
  },
  removeCategory: (id) => {
    settings.categories = settings.categories.filter((category) => category.id !== id)
    return wait(settings.categories)
  },
  listCategories: () => wait(settings.categories),
  listOrders: () => wait(ordersList),
  updateOrderStatus: (id, status) => {
    const order = ordersList.find((item) => item.id === id)
    if (order) order.status = status
    return wait(order)
  },
  listConversations: () => wait(conversationsList),
  markConversationRead: (id) => {
    const conversation = conversationsList.find((item) => item.id === id)
    if (conversation) {
      conversation.unread = 0
      conversation.status = 'closed'
    }
    return wait(conversation)
  },
  markAllConversationsRead: () => {
    conversationsList = conversationsList.map((conversation) => ({ ...conversation, unread: 0 }))
    return wait(conversationsList)
  },
  listNotifications: () => wait(notificationsList),
  markNotificationRead: (id) => {
    const notification = notificationsList.find((item) => item.id === id)
    if (notification) notification.read = true
    return wait(notification)
  },
  deleteNotification: (id) => {
    notificationsList = notificationsList.filter((notification) => notification.id !== id)
    return wait(true)
  },
}