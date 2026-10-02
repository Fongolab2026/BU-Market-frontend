import api, { endpoints } from "../../../../../services/api.js";

const mapCategory = (category) => ({
  ...category,
  productCount: Number(category.count) || 0,
  active: category.active !== false,
  icon: category.icon || "package",
});

const listCategories = async () => {
  const { data } = await api.get(endpoints.categories.list);
  const categories = data.results ?? data;
  return Array.isArray(categories) ? categories.map(mapCategory) : [];
};

export const merchantCategoryService = {
  list: async () => {
    return listCategories();
  },
  create: async (input) => {
    await api.post(endpoints.categories.create, {
      name: input.name,
      description: input.description || "",
      icon: input.icon || "package",
      active: true,
    });
    return listCategories();
  },
  update: async (id, input) => {
    await api.patch(endpoints.categories.update(id), {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    });
    return listCategories();
  },
  remove: async (id) => {
    await api.delete(endpoints.categories.delete(id));
    return listCategories();
  },
};
