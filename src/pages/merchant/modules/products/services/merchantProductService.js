import api, { endpoints } from "../../../../../services/api.js";

export const merchantProductEndpoints = {
  list: endpoints.products.list,
  create: endpoints.products.create,
  update: (id) => endpoints.products.update(id),
  updateStatus: (id) => endpoints.products.setStatus(id),
  remove: (id) => endpoints.products.delete(id),
};

export const merchantProductService = {
  list: async ({ query = "", status = "all", page = 1, perPage = 100 } = {}) => {
    const all = [];
    let currentPage = page;
    let totalPages = page;
    do {
      const { data } = await api.get(endpoints.products.myProducts, {
        params: { search: query, status, page: currentPage, perPage },
      });
      const products = data.results ?? data;
      if (Array.isArray(products)) all.push(...products);
      totalPages = data.totalPages ?? data.total_pages ?? currentPage;
      currentPage += 1;
    } while (currentPage <= totalPages);
    return all;
  },
  create: async (input, files = []) => {
    const formData = new FormData();
    formData.append("name", input.name ?? "");
    formData.append("category", input.category ?? "");
    formData.append("price", input.price ?? "");
    formData.append("stock", input.stock || 0);
    formData.append("details", (input.details || "").trim());
    files.forEach((file) => formData.append("images", file));
    const { data } = await api.post(endpoints.products.create, formData);
    return data;
  },
  update: async (id, input) => {
    const { data } = await api.patch(endpoints.products.update(id), {
      name: input.name,
      category: input.category,
      price: input.price,
      stock: input.stock || 0,
      details: (input.details || "").trim(),
    });
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(endpoints.products.setStatus(id), { status });
    return data;
  },
  remove: async (id) => {
    await api.delete(endpoints.products.delete(id));
    return true;
  },
  uploadImages: async (productId, files, isMain = true) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("is_main", String(isMain));
    const { data } = await api.post(endpoints.products.uploadImages(productId), formData);
    return data;
  },
  removeImage: async (productId, imageId) => {
    await api.delete(endpoints.products.removeImage(productId, imageId));
    return true;
  },
};
