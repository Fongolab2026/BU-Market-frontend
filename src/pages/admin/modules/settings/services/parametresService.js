import { endpoints, apiGet, apiPatch } from "../../../../../services/api.js";
import { categoriesService, mapCategory } from "../../categories/services/categoriesService.js";

export const parametreEndpoints = {
  get: endpoints.admin.settings,
  update: endpoints.admin.settings,
  categories: endpoints.categories.list,
};

const withDefaults = (settings) => ({
  platformName: settings?.platformName ?? "",
  supportEmail: settings?.supportEmail ?? "",
  phone: settings?.phone ?? "",
  defaultLanguage: settings?.defaultLanguage ?? "fr",
  currency: settings?.currency ?? "BIF",
  moderation: {
    requireShopApproval: Boolean(settings?.moderation?.requireShopApproval),
    requireProductApproval: Boolean(settings?.moderation?.requireProductApproval),
    hideReportedReviews: Boolean(settings?.moderation?.hideReportedReviews),
  },
  notifications: {
    newShopPending: Boolean(settings?.notifications?.newShopPending),
    newReportedReview: Boolean(settings?.notifications?.newReportedReview),
    weeklyDigest: Boolean(settings?.notifications?.weeklyDigest),
  },
  categories: (settings?.categories ?? []).map(mapCategory),
});

export const parametresService = {
  get: async () => withDefaults(await apiGet(parametreEndpoints.get)),
  update: async (nextSettings) => {
    const payload = {
      platformName: nextSettings.platformName,
      supportEmail: nextSettings.supportEmail,
      phone: nextSettings.phone,
      defaultLanguage: nextSettings.defaultLanguage,
      currency: nextSettings.currency,
      moderation: nextSettings.moderation,
      notifications: nextSettings.notifications,
    };
    return withDefaults(await apiPatch(parametreEndpoints.update, payload));
  },
  // Les categories vivent dans l'API categories : PlatformSettings les lit seulement.
  addCategory: (name) => categoriesService.create({ name }),
  renameCategory: (id, name) => categoriesService.update(id, { name }),
  removeCategory: (id) => categoriesService.remove(id),
};
