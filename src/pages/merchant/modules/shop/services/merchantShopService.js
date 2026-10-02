import api, { endpoints } from "../../../../../services/api.js";

export const merchantShopEndpoints = {
  detail: endpoints.shops.list,
  create: endpoints.shops.list,
  update: (id) => endpoints.shops.detail(id),
};

export const merchantShopService = {
  get: async () => {
    try {
      const { data } = await api.get(endpoints.shops.myShop);
      return data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },
  create: async (input) => {
    const { data } = await api.patch(endpoints.users.me, {
      shop_name: input.name.trim(),
      shop_description: input.description.trim(),
    });
    return data.shop;
  },
  update: async (input) => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("category", input.category);
    if (input.imageFile) formData.append("shop_image", input.imageFile);
    const { data } = await api.patch(endpoints.shops.updateInfo(input.id), formData);
    return data;
  },
};
