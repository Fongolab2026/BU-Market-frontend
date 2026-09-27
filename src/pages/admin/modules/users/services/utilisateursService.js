import { endpoints, apiGet, apiPost, apiPatch, apiDelete } from "../../../../../services/api.js";
import {
  cleanFilters,
  formatDate,
  formatDateTime,
  formatRelative,
  initialsOf,
  mapShop,
  toPage,
} from "../../shared/adminApi.js";

export const utilisateurEndpoints = {
  list: endpoints.users.list,
  detail: (id) => endpoints.users.detail(id),
  create: endpoints.users.create,
  update: (id) => endpoints.users.update(id),
  remove: (id) => endpoints.users.delete(id),
  setStatus: (id) => endpoints.users.setStatus(id),
};

/** Libelles de l'interface admin -> roles stockes en base. */
const roleToApi = { admin: "admin", merchant: "merchant", client: "client" };

/** Roles Django -> libelles de l'interface admin. */
const roleToLabel = {
  superadmin: "admin",
  admin: "admin",
  seller: "merchant",
  buyer: "client",
};

const mapUser = (user) => ({
  ...user,
  firstName: user.firstName || user.username || "Sans nom",
  initials: initialsOf(user.firstName || user.username),
  role: roleToLabel[user.role] || "client",
  phone: user.phone || "",
  location: user.location || "Non précisée",
  joinedAt: formatDate(user.joinedAt),
  lastActive: user.lastActive ? formatRelative(user.lastActive) : "Jamais",
  shop: user.shop
    ? { ...user.shop, name: user.shop.name || user.username, status: user.shop.status }
    : null,
  timeline: (user.timeline || []).map((entry) => ({
    ...entry,
    date: formatDateTime(entry.date),
  })),
});

const toPayload = (input) => ({
  firstName: (input.firstName || "").trim(),
  email: (input.email || "").trim(),
  phone: (input.phone || "").trim(),
  location: (input.location || "").trim(),
  role: roleToApi[input.role] || input.role,
});

export const utilisateursService = {
  list: async ({ query = "", role = "all", status = "all", page = 1, perPage = 5 } = {}) => {
    const params = cleanFilters({ search: query, role, status, page, perPage });
    return toPage(await apiGet(utilisateurEndpoints.list, params), perPage);
  },
  detail: async (id) => {
    const user = await apiGet(utilisateurEndpoints.detail(id));
    if (!user.shop) return mapUser(user);
    const shop = await apiGet(endpoints.shops.detail(id)).catch(() => null);
    return mapUser({ ...user, shop: shop ? mapShop(shop, user.location) : user.shop });
  },
  create: async (input) => {
    const created = await apiPost(utilisateurEndpoints.create, toPayload(input));
    return mapUser(created);
  },
  update: async (id, input) => {
    const updated = await apiPatch(utilisateurEndpoints.update(id), toPayload(input));
    return mapUser(updated);
  },
  updateStatus: async (id, status) => {
    const updated = await apiPatch(utilisateurEndpoints.setStatus(id), { status });
    return mapUser(updated);
  },
  remove: async (id) => {
    await apiDelete(utilisateurEndpoints.remove(id));
    return true;
  },
};
