import { endpoints } from "../../../../../services/api.js";
import { merchantService } from "../../../../../services/mockMerchantService.js";

export const merchantProductEndpoints = {
  list: endpoints.products.list,
  create: endpoints.products.create,
  update: (id) => endpoints.products.update(id),
  updateStatus: (id) => endpoints.products.setStatus(id),
  remove: (id) => endpoints.products.delete(id),
};

export const merchantProductService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, status, page, perPage };
    return await merchantService.listProducts(params);
  },
  create: async (input) => {
    return await merchantService.createProduct(input);
  },
  update: async (id, input) => {
    return await merchantService.updateProduct(id, input);
  },
  updateStatus: async (id, status) => {
    return await merchantService.updateProductStatus(id, status);
  },
  remove: async (id) => {
    return await merchantService.deleteProduct(id);
  },
  uploadImages: async (productId, files, isMain = true) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("is_main", String(isMain));
    return { productId, files: files.length, isMain };
  },
  removeImage: async (productId, imageId) => {
    return { productId, imageId };
  },
};
