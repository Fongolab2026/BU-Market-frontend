# BU-Market — Frontend

Marketplace burundaise : catalogue, panier, commandes, avis (produits et
boutiques), location d'espaces marchands et espaces d'administration.

## Fonctionnalités récentes

- **Avis produits et boutiques** : clients et vendeurs déposent un avis noté
  de 1 à 5 sur une fiche produit ou sur une boutique (fiche produit, modale
  boutique, profil vendeur, espace vendeur), le modifient ou le suppriment.
  Un signalement notifie les administrateurs ; la page
  `/admin/avis` fusionne les deux types d'avis (badge *Produit* / *Boutique*)
  avec masquage, révélation et suppression.
- **Visuels de catégories** : chaque catégorie de l'espace marchand affiche
  une image téléversée, ou à défaut un dégradé de la palette et une icône
  déduite du nom de la catégorie (migration backend
  `categorie/migrations/0003_category_image`).

## Démarrage rapide

```bash
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`. Les requêtes `/api` et `/media`
sont relayées vers le backend Django configuré par `VITE_API_PROXY_TARGET`
(`http://127.0.0.1:8000` par défaut).

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build avec proxy API |
| `npm run lint` | Analyse Oxlint |
| `npm run check:lines` | Vérifie la limite de 500 lignes par fichier |
| `npm run verify` | lint + limite de lignes + build |

## Documentation

Le guide complet (architecture, flux métier, rôles, API, design system,
conventions et checklist) est disponible ici :

- **[docs/GUIDE-PROJET.md](docs/GUIDE-PROJET.md)**
- [docs/backlog-endpoints.md](docs/backlog-endpoints.md) — contrat d'API

## Règles principales

- Aucun fichier source ne dépasse **500 lignes**.
- La logique métier vit dans les hooks, les appels réseau dans `src/services/`.
- Les couleurs passent par les tokens du thème (`primary`, `base-100`,
  `var(--surface)`) pour rester compatibles avec le mode sombre.
- Les animations d'apparition utilisent le composant `Reveal`.

## Stack

React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · DaisyUI 5 · Axios ·
PrimeReact · lucide-react · react-hot-toast
