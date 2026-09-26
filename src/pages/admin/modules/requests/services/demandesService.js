import { adminService } from "../../../../../services/mockAdminService.js";

export const demandeEndpoints = {
  list: "/publications/publications/",
  detail: (id) => `/publications/publications/${id}/`,
  approve: (id) => `/publications/publications/${id}/approve/`,
  reject: (id) => `/publications/publications/${id}/reject/`,
};

export const demandesService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, per_page: perPage };
    return await adminService.listRequests({ ...params, perPage });
  },
  approve: async (id) => {
    return await adminService.updateRequestStatus(id, "approved");
  },
  reject: async (id) => {
    return await adminService.updateRequestStatus(id, "rejected");
  },
};
