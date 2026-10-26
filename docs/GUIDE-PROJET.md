# Guide du projet BU-Market

Ce document décrit **comment le frontend BU-Market est construit**, les flux
métier qu'il implémente, les conventions à respecter et les procédures pour
ajouter une fonctionnalité sans casser l'existant.

> Le backend (Django REST) n'est pas dans ce dépôt. Toutes les requêtes passent
> par la couche `src/services/` et supposent l'API décrite dans
> [`docs/backlog-endpoints.md`](backlog-endpoints.md).

---

## 1. Objectif du produit

BU-Market est une marketplace burundaise avec trois espaces :

| Espace | Public | Rôle technique | URL de départ |
| --- | --- | --- | --- |
| Public | Visiteurs | — | `/` (landing) |
| Acheteur | Clients connectés | `client` | `/accueil` |
| Vendeur | Commerçants validés | `merchant` | `/marchand/tableau-de-bord` |
| Administration | Gestionnaires | `admin` | `/admin/tableau-de-bord` |

Un client peut demander la **location d'un espace marchand**. Après validation
par un administrateur, son compte est promu vendeur et il est redirigé
automatiquement vers son espace, sans reconnexion.

---

## 2. Stack technique

- **React 19** + **Vite 8**
- **React Router 7** (`createBrowserRouter`)
- **Tailwind CSS 4** + **DaisyUI 5** (thèmes `bumarket` / `bumarket-dark`)
- **PrimeReact** (composants ponctuels : boutons, divider, etc.)
- **Axios** avec intercepteurs (token + rafraîchissement)
- **lucide-react** pour les icônes
- **react-hot-toast** pour les notifications
- **Oxlint** pour le lint
- Données administratives Burundi embarquées (`src/data/burundi/`)

---

## 3. Démarrage

```bash
npm install
cp .env.example .env   # si le fichier existe, sinon créer .env
npm run dev            # http://localhost:5173
```

Variables d'environnement utilisées :

| Variable | Rôle |
| --- | --- |
| `VITE_API_URL` | URL absolue de l'API en production. Vide en dev (requêtes relatives). |
| `VITE_API_PROXY_TARGET` | Cible du proxy Vite pour `/api` et `/media` (Django, `http://127.0.0.1:8000` par défaut). |

Scripts :

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Sert le build (avec proxy API) |
| `npm run lint` | Oxlint sur tout le projet |
| `npm run check:lines` | Vérifie la limite de 500 lignes |
| `npm run verify` | lint + limite de lignes + build |

---

## 4. Architecture des dossiers

```text
src/
├── Users/                     Espace public et acheteur
│   ├── App.jsx                Providers + routeur + écran de démarrage
│   ├── auth/                  Connexion / inscription
│   ├── Pages/                 Landing, Home, Panier, Commandes, LouerEspace...
│   │   ├── home/              Sections + hooks de la page d'accueil connectée
│   │   └── louer-espace/      Formulaire de location découpé par étape
│   ├── Composants/            Navbar, footer, composants acheteur
│   │   └── nav/               Menus et badge de la navbar
│   ├── products/              Cartes et UI catalogue
│   └── routes/                Routes publiques et protégées
├── components/                Composants transverses
│   ├── profile/               Onglets et champs des paramètres du profil
│   ├── skeletons/             États de chargement
│   ├── Reveal.jsx             Animation d'apparition au défilement
│   └── WorkspaceShell.jsx     Coquille commune vendeur / admin
├── context/                   Auth, panier, thème
├── hooks/                     Hooks métier réutilisables
├── services/                  Accès API (un fichier par domaine)
│   └── mocks/                 Données de démonstration
├── pages/
│   ├── admin/                 Modules d'administration
│   └── merchant/              Modules de l'espace vendeur
├── utils/                     Rôles, téléphone, erreurs API, PDF
├── data/                      Données statiques (Burundi découpé)
├── styles/                    Styles extraits (champ téléphone)
├── theme.css                  Thème central (couleurs, composants)
└── index.css                  Base Tailwind + animations
```

### Règle d'or : 500 lignes maximum

Aucun fichier `.js`, `.jsx` ou `.css` de `src/` ne doit dépasser **500 lignes**.
La vérification est automatisée :

```bash
npm run check:lines
```

Quand un fichier grossit, découper par **responsabilité** :

- une page = orchestration + état local ;
- les sections visuelles dans un sous-dossier (`home/`, `louer-espace/`) ;
- la logique métier dans un hook (`useSpaceForm`, `useHomeCatalog`) ;
- les constantes et libellés dans un fichier dédié ;
- les appels réseau dans `services/` ;
- les sous-composants répétés (lignes de tableau, modales, badges) à part.

---

## 5. Point d'entrée et providers

`src/main.jsx` monte :

```text
ErrorBoundary
└── PrimeReactProvider
    └── App
```

`src/Users/App.jsx` empile les providers puis le routeur :

```text
AuthProvider → ThemeProvider → CartProvider → RouterProvider
```

- **AuthProvider** restaure la session depuis `localStorage`, rafraîchit le
  profil via `/users/users/me/`, expose `user`, `signIn`, `signOut`, `loading`.
- **ThemeProvider** applique `data-theme="bumarket"` ou `"bumarket-dark"` sur
  `<html>` et mémorise le choix dans `localStorage`.
- **CartProvider** synchronise le panier et son compteur.
- **RootLayout** exécute `useSellerUpgrade()` à chaque navigation : c'est lui
  qui détecte la validation d'une demande d'espace.

Un écran de démarrage de 2,8 s est affiché une seule fois par session
(`sessionStorage`), pour éviter un flash de page blanche.

---

## 6. Routage et contrôle d'accès

Les routes sont divisées en deux fichiers :

- `src/Users/routes/PublicRoutes.jsx` : landing, inscription, connexion,
  location d'espace, profil, pages d'erreur, connexion admin.
- `src/Users/routes/ProtectedRoutes.jsx` : accueil acheteur, catalogue,
  panier, commandes, espace marchand, administration.

### Gardes

| Garde | Fichier | Règle |
| --- | --- | --- |
| `RequireAuth` | `PublicRoutes.jsx` | Redirige vers `/` si aucun token. |
| `RequireNoOpenRequest` | `routes/RequireNoOpenRequest.jsx` | Empêche une 2e demande si une demande est `pending`/`validated`. |
| `RequireUser` | `ProtectedRoutes.jsx` | Authentification simple. |
| `RequireBuyer` | `ProtectedRoutes.jsx` | Réserve l'espace acheteur aux `client` ; redirige les vendeurs/admins. |
| `ProtectedRoute` | `pages/admin/components/ProtectedRoute.jsx` | Vérifie le rôle attendu et le chemin de secours. |
| `DefaultEntry` | `ProtectedRoutes.jsx` | `/` → landing si visiteur, sinon espace correspondant au rôle. |

Les rôles sont normalisés par `src/utils/roles.js` : le backend peut renvoyer
`seller`, `merchant`, `buyer`, `client`, etc. ; l'application ne manipule que
`admin`, `merchant`, `client`.

### Tableau des routes

| Route | Accès |
| --- | --- |
| `/` | Landing si déconnecté, sinon redirection |
| `/inscription`, `/connexion` | Public |
| `/louer-espace` | Client connecté sans demande ouverte |
| `/confirmation-location` | Client connecté |
| `/profil` | Client connecté |
| `/accueil` | Acheteur |
| `/produit/:id` | Acheteur |
| `/profil-vendeur/:id` | Acheteur |
| `/panier`, `/commandes`, `/favoris`, `/notifications` | Acheteur |
| `/marchand/*` | Vendeur (`ProtectedRoute`) |
| `/admin/*` | Admin (`ProtectedRoute`) |
| `/admin/connexion`, `/admin/acces-refuse` | Public |

---

## 7. Authentification et API

### Tokens

- Stockés dans `localStorage` : `access_token`, `refresh_token`.
- `setTokens`, `clearTokens`, `isAuthenticated` sont exportés par
  `src/services/api.js`.
- La session utilisateur complète est aussi mise en cache dans
  `bumarket_session` (`AuthContext`) pour un démarrage instantané.

### Axios

`src/services/api.js` :

1. ajoute `Authorization: Bearer <access>` à chaque requête ;
2. si une réponse est `401`, tente **un seul** rafraîchissement via
   `/auth/refresh/` puis rejoue la requête ;
3. si le rafraîchissement échoue, supprime les tokens ;
4. réécrit les URLs `/media/...` pour qu'elles pointent vers l'API configurée.

Les helpers `apiGet`, `apiPost`, `apiPatch`, `apiPut`, `apiDelete` renvoient
directement `response.data`.

### Erreurs API

- `src/utils/apiError.js` normalise les erreurs de validation Django
  (`extractApiError`) pour les formulaires.
- Dans les pages, les erreurs métier sont affichées via un toast ou un encart
  local. Ne jamais afficher une page HTML d'erreur Django telle quelle.

### Endpoints

Tous les chemins sont centralisés dans `endpoints` (`src/services/api.js`) :
`auth`, `users`, `products`, `categories`, `orders`, `messages`,
`notifications`, `favorites`, `reviews`, `shopReviews`, `shops`, `boutiques`,
`publicationRequests`, `carts`, `admin`.

**Ne pas écrire d'URL en dur dans une page** : passer par un service.

---

## 8. Parcours métier

### 8.1 Landing publique

`src/Users/Pages/Landing.jsx` présente la promesse, les statistiques, les
fonctionnalités, le catalogue mis en avant, les témoignages, la FAQ et le CTA.
Les sections apparaissent progressivement au défilement (`Reveal`).

### 8.2 Inscription / connexion

- `/inscription` crée un compte via `authApi.register`.
- `/connexion` appelle `authApi.login`, stocke les tokens, puis `authApi.me()`
  pour récupérer le profil et rediriger selon le rôle.
- L'admin possède sa propre page `/admin/connexion`.

### 8.3 Accueil acheteur

`src/Users/Pages/Home.jsx` orchestre :

- hero avec diaporama ;
- bandeau de demande d'espace en attente ;
- garanties et valeurs ;
- catalogue avec recherche, filtre catégorie et pagination
  (`home/useHomeCatalog.js`) ;
- boutiques validées et fiche boutique ;
- à propos, témoignages, CTA, formulaire de contact
  (`home/useContactForm.js`).

### 8.4 Location d'un espace marchand

`src/Users/Pages/LouerEspace.jsx` + `louer-espace/` :

1. **Identité** : nom, propriétaire (pré-rempli), industrie, e-mail,
   téléphone, WhatsApp, slogan.
2. **Informations** : liens sociaux facultatifs.
3. **Emplacement** : province → commune → quartier/colline
   (`src/data/burundi/`), avec option « Autre ».

Fonctionnement :

- validation native par étape + validation du téléphone (`utils/phone.js`) ;
- navigation par boutons, clic sur le stepper ou glissement tactile ;
- récapitulatif avant envoi ;
- `POST /shops/boutiques/` ;
- si la demande est acceptée : toast, événement
  `bu-market:space-request-updated`, redirection vers `/accueil`.

Tant que le statut est `pending`, l'utilisateur voit un bandeau d'attente et ne
peut pas soumettre une nouvelle demande. `useSellerUpgrade` interroge
périodiquement le statut ; dès que l'admin valide, il rafraîchit la session et
redirige vers `/marchand/tableau-de-bord`.

### 8.5 Espace marchand

Modules sous `src/pages/merchant/modules/` :

- tableau de bord (statistiques, ventes, activité) ;
- boutique (création / modification) + **avis reçus** par la boutique ;
- produits (CRUD, statut, images) ;
- commandes (statuts) ;
- messages clients ;
- notifications ;
- catégories ;
- concurrents ;
- paramètres du profil.

`MerchantLayout` vérifie l'existence d'une boutique validée et calcule les
badges (messages, notifications, commandes en attente).

#### Catégories avec visuel

`modules/categories/` affiche chaque catégorie sous forme de carte avec un
visuel en tête, calculé par `categoryVisuals.js` :

1. une **image** si la catégorie en a une (`Category.image`, champ ajouté par
   la migration backend `categorie/migrations/0003_category_image`) —
   téléversée depuis la modale (bouton *Téléverser une image* /
   *Remplacer*, *Retirer* envoie `remove_image: true` en PATCH multipart) ;
2. sinon un **dégradé** de la palette + une **icône** déduite du nom :
   mots-clés les plus spécifiques d'abord (`KEYWORDS`), puis l'icône
   enregistrée, puis la correspondance du libellé, sinon `package`.

La modale pré-sélectionne l'icône résolue à l'ouverture en édition. Le rendu
est centralisé dans `components/CategoryCover.jsx`, repris par la grille de la
page et par les prévisualisations de la modale.

#### Avis reçus (espace vendeur)

`MerchantShopPage` affiche le bloc « Avis reçus par ma boutique » : note
moyenne, répartition par étoiles, bandeau « vous ne pouvez pas noter votre
propre boutique » et la liste des avis (clients et autres vendeurs), avec
signalage.

### 8.6 Administration

Modules sous `src/pages/admin/modules/` :

- tableau de bord ;
- utilisateurs (liste, détail, création, édition, suppression) ;
- boutiques et demandes de location ;
- produits et catégories ;
- commandes ;
- **avis** : liste fusionnée produits + boutiques, badge `Produit` ou
  `Boutique`, recherche, filtre par statut, actions *Masquer* /
  *Rendre visible* / *Supprimer* (`modules/reviews/services/avisService.js`) ;
- messages, notifications ;
- demandes de publication ;
- paramètres.

`AdminLayout` fournit la navigation et les compteurs. Les pages réutilisent
`PageHeader`, `Pagination`, `StatusBadge`, `ConfirmDialog` et les skeletons.

### 8.7 Messages et notifications

- Les services de messages exposent liste, fil, envoi, lecture.
- L'admin et le vendeur ont chacun leurs services et pages dédiés.
- Les notifications non lues alimentent la navbar et les badges.
- L'événement `BUYER_NOTIFICATIONS_UPDATED` permet de rafraîchir les compteurs
  sans recharger la page.
- Un signalement d'avis (`report`) crée côté backend une notification
  « Avis signalé » envoyée à tous les administrateurs
  (`notification/utils.py::notify_admins`) : **l'avis reste visible** jusqu'à
  son masquage manuel par un admin.

### 8.8 Avis produits et boutiques

Deux modèles d'avis, une seule UI réutilisable (`src/components/reviews/`) :

| Fichier | Rôle |
| --- | --- |
| `ReviewSection.jsx` | Bloc complet : moyenne, répartition, formulaire, liste |
| `ReviewCard.jsx` | Une carte d'avis (modification / suppression pour l'auteur) |
| `StarRating.jsx` | Saisie et affichage des étoiles (accessibles) |
| `reviewUtils.js` | Moyenne, répartition, messages d'erreur |

```jsx
<ReviewSection targetType="product" targetId={id} ownerId={product.owner} />
<ReviewSection targetType="shop" targetId={shopId} ownerId={ownerId} compact />
```

Implantations : fiche produit (`DetailProduit.jsx`), modale boutique de
l'accueil (`HomeShops.jsx`), profil vendeur public (`ProfilVendeur.jsx`) et
espace vendeur (`MerchantShopPage.jsx`).

Règles (appliquées par le backend `favoris` pour les produits, `shops` pour
les boutiques) :

- un seul avis par couple (auteur, cible) ; note de 1 à 5 ;
- commentaire de 3 signes minimum ;
- **l'auteur d'un produit ou d'une boutique ne peut pas noter sa propre
  cible** — l'UI l'explique et masque le formulaire ;
- client **et** vendeur connecté peuvent déposer un avis ;
- après dépôt, le formulaire est remplacé par un encart et la carte de
  l'auteur propose *Modifier* (édition en ligne) puis *Supprimer*
  (confirmation en deux clics) ;
- *Signaler cet avis* marque `reported` et notifie les admins (voir 8.7) ;
- `GET` public : la liste n'expose que les avis `visible`.

Endpoints : `endpoints.reviews` (`/favorites/reviews/`) et
`endpoints.shopReviews` (`/shops/shop-reviews/`), chacun avec `report`,
`hide`, `reveal`, `delete`.

---

## 9. Couche services

| Fichier | Domaine |
| --- | --- |
| `api.js` | Axios, tokens, endpoints, helpers |
| `authService.js` | Connexion, profil, inscription |
| `productService.js` | Produits, pagination complète |
| `categoryService.js` | Catégories |
| `cartService.js` | Panier et lignes |
| `orderService.js` | Commandes et lignes |
| `favoriteService.js` | Favoris et avis |
| `shopService.js` | Boutiques, demandes de location |
| `userService.js` | Utilisateurs, mot de passe |
| `messageService.js` | Messagerie acheteur |
| `notificationService.js` | Notifications |
| `mockMerchantService.js` | Mode démo vendeur (sans backend) |

Les modules admin/merchant possèdent en plus leurs services locaux
(`modules/*/services/`) : par exemple
`admin/modules/reviews/services/avisService.js`, qui fusionne les avis
produits et les avis de boutiques derrière un champ `type`.

`services/mocks/merchantMockData.js` contient les données du mode démo : le
service les clone au démarrage pour conserver un état mutable local.

---

## 10. Données Burundi

`src/data/burundiLocations.js` ne contient plus les données : c'est un point
d'entrée qui ré-exporte `src/data/burundi/index.js`.

Les données sont découpées en `src/data/burundi/provinces/*.js` par province et
par tranche de communes, afin de rester sous 500 lignes. Structure :

```text
province → commune → zone → quartiers/collines
```

Le formulaire n'enregistre que `province`, `commune` et `neighborhood`.

---

## 11. Design system et animations

### Couleurs

Définies dans `src/theme.css` (DaisyUI) :

- primaire : `#c2410c` → classe `primary` / `brand`
- secondaire : `#ea580c`
- accent : `#f0a500`
- thème sombre : `bumarket-dark`

Utiliser les tokens (`bg-base-100`, `text-base-content`, `bg-primary`,
`border-base-300`, `var(--surface)`) plutôt que des couleurs en dur. Les
surfaces `white` doivent être remplacées par `bg-[var(--surface)]` ou
`bg-base-100` pour rester lisibles en mode sombre.

### Composants réutilisables

- `src/pages/admin/components/ui.jsx` : `PageHeader`, `Pagination`,
  `StatusBadge`.
- `src/pages/admin/components/ConfirmDialog.jsx` : confirmation destructive.
- `src/components/skeletons/` : chargements (tableaux, cartes, listes…).
- `src/components/PhoneInput.jsx` : téléphone international.
- `src/components/Avatar.jsx` : avatar avec initiales.
- `src/components/Reveal.jsx` : apparition au défilement.
- `src/components/reviews/` : avis produits et boutiques (voir 8.8).

### Scroll reveal

```jsx
import Reveal from '../../components/Reveal.jsx'

<Reveal as="section" variant="up" delay={80} className="...">
  ...
</Reveal>
```

Propulseurs :

| Prop | Valeurs | Effet |
| --- | --- | --- |
| `as` | balise HTML | `section`, `article`, `li`… |
| `variant` | `up`, `down`, `left`, `right`, `zoom` | Sens de l'animation |
| `delay` | nombre (ms) | Décalage pour les listes en cascade |

Règles :

- Ne pas envelopper le hero au-dessus de la ligne de flottaison ; il utilise
  déjà `animate-fade-up`.
- Mettre `Reveal` sur les sections et sur les cartes d'une grille (avec un
  `delay` progressif).
- L'animation est désactivée automatiquement si
  `prefers-reduced-motion: reduce` ou si `IntersectionObserver` est absent.

### Accessibilité

- Chaque bouton icône doit avoir un `aria-label`.
- Les champs doivent avoir un `<label htmlFor>` ou un `aria-label`.
- Les modales utilisent `role="dialog"` et `aria-modal="true"`.
- Les steppers utilisent `aria-current="step"`.
- Toujours vérifier le contraste en mode sombre.

---

## 12. Conventions de code

### Nommage

| Élément | Convention | Exemple |
| --- | --- | --- |
| Composant React | PascalCase | `HomeHero.jsx` |
| Hook | `use` + camelCase | `useHomeCatalog.js` |
| Service | camelCase | `productService.js` |
| Constante | UPPER_SNAKE_CASE | `PRODUCTS_PER_PAGE` |
| Fonction / variable | camelCase | `handleSubmit` |
| Fichier de données | camelCase | `merchantMockData.js` |

### Imports et exports

- Composants : `export default`.
- Constantes / helpers : exports nommés.
- Services : objet exporté nommé (`export const productApi = {...}`).
- Importer via les barrels quand ils existent (`services/index.js`,
  `components/skeletons`), sinon chemin direct.

### État et logique

- Une page orchestre ; elle ne contient pas 400 lignes de JSX.
- Extraire la logique complexe dans un hook dédié.
- Les appels API ne se font pas dans le JSX.
- Utiliser `useMemo` pour les dérivations coûteuses (filtres, listes).
- Éviter les `useEffect` pour des valeurs calculables.

### Formulaires

- Toujours `noValidate` + validation explicite si le navigateur est trop
  permissif.
- Afficher les erreurs près du champ et un message global.
- Désactiver le bouton pendant l'envoi et afficher un état de chargement.
- Ne jamais perdre les données saisies en cas d'erreur API.

### API et erreurs

- Passer par `services/`.
- Utiliser `extractApiError` ou `parseApiErrors`.
- Les messages utilisateur sont en français, courts et actionnables.
- Ne pas exposer les détails techniques (stack, HTML Django).

### UI

- Mobile first ; tester à 390 px de large.
- Réutiliser les skeletons au lieu d'un spinner plein écran.
- Classes Tailwind ordonnées : layout → espacement → typo → couleur → état.
- Éviter les styles inline sauf pour les valeurs dynamiques (largeur de
  progression, délai d'animation).

### Commentaires

- Commenter **pourquoi**, pas **quoi**.
- Expliquer les contournements backend ou les règles métier non évidentes.
- Laisser les commentaires en français, cohérents avec le reste du projet.

### Git

- Commits courts et ciblés (une intention par commit).
- Ne pas committer `dist/`, `node_modules/`, `.env`.
- Avant de pousser : `npm run verify`.

---

## 13. Recettes

### Ajouter une page protégée

1. Créer la page dans le module concerné.
2. Ajouter la route dans `PublicRoutes.jsx` ou `ProtectedRoutes.jsx`.
3. Vérifier le rôle avec `ProtectedRoute` ou une garde dédiée.
4. Ajouter l'entrée de navigation dans le layout (`AdminLayout`,
   `MerchantLayout` ou `nav.jsx`).
5. Tester le retour arrière et l'accès direct par URL.

### Ajouter un appel API

1. Ajouter le chemin dans `endpoints` (`services/api.js`).
2. Créer la méthode dans le service du domaine.
3. Consommer le service dans la page ou le hook.
4. Gérer `loading`, `error`, `success` et l'état vide.

### Ajouter une section animée

1. Découper la section dans un composant dédié si elle dépasse ~80 lignes.
2. L'envelopper avec `Reveal` (`as="section"`).
3. Ajouter des `Reveal` enfants avec `delay={index * 70}` pour les grilles.
4. Vérifier le rendu en mode sombre et avec `prefers-reduced-motion`.

### Découper un gros fichier

1. Identifier les blocs : constantes, hooks, sous-composants, rendu.
2. Créer un sous-dossier au nom du domaine.
3. Déplacer sans changer le comportement.
4. Mettre à jour les imports.
5. Lancer `npm run verify`.

---

## 14. Checklist avant livraison

- [ ] `npm run verify` passe (lint + 500 lignes + build).
- [ ] Aucun fichier > 500 lignes (`npm run check:lines`).
- [ ] Rendu vérifié à 390 px et en desktop.
- [ ] Mode clair **et** sombre vérifiés.
- [ ] Aucun débordement horizontal.
- [ ] Les états `loading`, `empty`, `error` sont couverts.
- [ ] Les boutons icône ont un `aria-label`.
- [ ] Les appels API passent par un service.
- [ ] Les messages d'erreur sont compréhensibles.
- [ ] Aucun `console.log` de debug oublié.

---

## 15. Dépannage

| Symptôme | Piste |
| --- | --- |
| Les requêtes API échouent en dev | Vérifier que Django tourne sur `VITE_API_PROXY_TARGET` (8000 par défaut). |
| Les images `/media` sont cassées | Vérifier le proxy `/media` et `VITE_API_URL`. |
| L'utilisateur est déconnecté sans raison | Le refresh token a échoué ; vérifier `/auth/refresh/`. |
| Un vendeur voit l'espace acheteur | Le rôle backend n'est pas normalisé ; vérifier `resolveRole`. |
| Le thème clignote | Vérifier `data-theme` sur `<html>` et le `ThemeProvider`. |
| Un fichier dépasse 500 lignes | `npm run check:lines` liste les fichiers à découper. |
| Le build passe mais la page est blanche | Vérifier la console : import circulaire, composant non exporté, erreur de route. |

---

## 16. Ressources

- [`README.md`](../README.md) : démarrage rapide.
- [`docs/backlog-endpoints.md`](backlog-endpoints.md) : contrat d'API attendu.
- `src/theme.css` : source de vérité des couleurs et styles.
- `src/Users/routes/` : source de vérité des accès.
- `scripts/check-file-length.mjs` : règle des 500 lignes.
