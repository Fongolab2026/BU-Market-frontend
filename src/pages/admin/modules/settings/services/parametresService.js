import { endpoints } from "../../../../../services/api.js";
import { adminService } from "../../../../../services/mockAdminService.js";

export const parametreEndpoints = {
  get: endpoints.admin.settings,
  update: endpoints.admin.settings,
  categories: endpoints.categories.list,
};

export const parametresService = {
  get: async () => {
    return await adminService.getSettings();
  },
  update: async (nextSettings) => {
    return await adminService.updateSettings(nextSettings);
  },
  addCategory: async (name) => {
    return await adminService.addCategory(name);
  },
  renameCategory: async (id, name) => {
    return await adminService.renameCategory(id, name);
  },
  removeCategory: async (id) => {
    return await adminService.removeCategory(id);
  },
};
