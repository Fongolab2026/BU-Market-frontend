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
    await api.patch(endpoints.users.me, {
      shop_name: input.name.trim(),
      shop_description: (input.description || "").trim(),
    });
    // Recharge la boutique complète (le résumé renvoyé par /me est incomplet).
    const created = await merchantShopService.get();
    if (!created?.id) return created;
    // Applique aussi la catégorie et le logo via l'endpoint dédié.
    if (input.category || input.imageFile) {
      return merchantShopService.update({ ...input, id: created.id });
    }
    return created;
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
