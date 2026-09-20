# Endpoints backends requis pour l'admin BUJA MARKET

Message prêt à envoyer aux devs backend.

---

## Consignes transverses

- Toutes les réponses de listes doivent renvoyer le format paginé :

```json
{
  "results": [...],
  "total": 0,
  "totalPages": 1,
  "page": 1,
  "perPage": 10
}
```

- Support des filtres : `?search=`, `?page=`, `?perPage=` (et `?role=` / `?status=` quand mentionné).
- Merci de confirmer que les endpoints `/api/...` déjà existants couvrent bien les points ci-dessous.

---

## 1. Dashboard

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/admin/stats/` | `{ stats:[{id,label,value,change,trend,tone}], weeklyActivity:[...], moderationQueue:[{id,type,title,owner,date,status}] }` |
| GET | `/api/admin/activity/` | `[{id,title,description,time,kind}]` |
| GET | `/api/admin/moderation-queue/` | liste à modérer (boutiques / produits / avis) |

## 2. Utilisateurs

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/users/` | filtres `?search=&role=&status=` ; user : `{id, firstName, lastName, email, phone, role[admin\|merchant\|client], status[active\|pending\|suspended], joinedAt, lastActive, location, shop:{...}}` |
| GET | `/api/users/:id/` | + `timeline:[{id,label,date,kind}]` |
| POST | `/api/users/` | créer un utilisateur |
| PATCH | `/api/users/:id/` | modifier un utilisateur |
| DELETE | `/api/users/:id/` | supprimer un utilisateur |
| PATCH | `/api/users/:id/status/` | body `{status}` |

## 3. Boutiques / Shops

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/shops/` | filtres `?search=&status=` ; shop : `{id, name, category, status[validated\|pending\|suspended], rating, reviewCount, createdAt, description, views, messages, products, owner, ownerId, productList, reviewList}` |
| GET | `/api/shops/:id/` | détail boutique |
| PATCH | `/api/shops/:id/` | modifier boutique |
| DELETE | `/api/shops/:id/` | supprimer boutique |
| PATCH | `/api/shops/:id/validate/` | valider une boutique |
| PATCH | `/api/shops/:id/suspend/` | suspendre une boutique |
| PATCH | `/api/shops/:id/status/` | body `{status}` |

## 4. Produits

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/products/` | produit : `{id, name, price, stock, status[active\|inactive], date, shopId, shopName, shopCategory, shopStatus}` |
| POST | `/api/shops/:shopId/products/` | créer un produit |
| PATCH | `/api/products/:id/` | modifier un produit |
| DELETE | `/api/products/:id/` | supprimer un produit |
| PATCH | `/api/products/:id/status/` | body `{status}` |

## 5. Catégories

> Note : à ne pas confondre avec l'orthographe « categorie ».

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/categories/` | `[{id, name, count}]` |
| POST | `/api/categories/` | créer une catégorie |
| PATCH | `/api/categories/:id/` | renommer une catégorie |
| DELETE | `/api/categories/:id/` | supprimer une catégorie |

## 6. Commandes

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/orders/` | commande : `{id, client, location, shop, items, total, status[pending\|shipped\|completed\|cancelled], date}` |
| PATCH | `/api/orders/:id/status/` | body `{status}` |

## 7. Demandes de publication

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/publication-requests/` | `{id, product:{name,category,price}, seller, shop, date, status[pending\|approved\|rejected]}` |
| PATCH | `/api/publication-requests/:id/approve/` | approuver une demande |
| PATCH | `/api/publication-requests/:id/reject/` | rejeter une demande |

## 8. Avis

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/reviews/` | avis : `{id, author, note, comment, date, status[visible\|hidden], shopId, shopName}` |
| DELETE | `/api/reviews/:id/` | supprimer un avis |
| PATCH | `/api/reviews/:id/hide/` | masquer un avis |
| PATCH | `/api/reviews/:id/reveal/` | réafficher un avis |

## 9. Messages (conversations admin ↔ commerçant)

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/messages/` | conversation : `{id, sender, shop, avatar, message, time, unread, status[open\|closed]}` |
| PATCH | `/api/messages/:id/read/` | marquer une conversation comme lue |
| PATCH | `/api/messages/read-all/` | tout marquer comme lu |

Pour que l'admin puisse **répondre** aux commerçants :

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| POST | `/api/messages/send/` | body `{recipient_id, content}` |
| GET | `/api/messages/:conversation_id/` | fil de messages `[{id, sender, content, timestamp, is_admin}]` |

## 10. Notifications

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/notifications/` | `{id, title, description, time, kind[shop\|alert\|order\|product\|message], read}` |
| PATCH | `/api/notifications/:id/read/` | marquer une notification comme lue |
| DELETE | `/api/notifications/:id/` | supprimer une notification |

## 11. Paramètres

| Méthode | Endpoint | Attendu |
| --- | --- | --- |
| GET | `/api/settings/` | `{platformName, supportEmail, phone, defaultLanguage, currency, moderation:{...}, notifications:{...}, categories:[...]}` |
| PATCH | `/api/settings/` | modifier les paramètres |