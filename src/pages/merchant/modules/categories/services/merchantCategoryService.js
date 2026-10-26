import api, { endpoints } from "../../../../../services/api.js";

const mapCategory = (category) => ({
  ...category,
  count: Number(category.count) || 0,
  productCount: Number(category.count) || 0,
  active: category.active !== false,
  icon: category.icon || "package",
  image: category.image || null,
});

const listCategories = async () => {
  const { data } = await api.get(endpoints.categories.list);
  const categories = data.results ?? data;
  return Array.isArray(categories) ? categories.map(mapCategory) : [];
};

/**
 * Prépare le corps de la requête : JSON lorsqu'il n'y a rien à téléverser,
 * multipart (`FormData`) dès qu'une image est ajoutée ou retirée — DRF
 * accepte les deux formats sur ce point d'entrée.
 */
const buildPayload = (input) => {
  const base = {
    name: input.name,
    description: input.description || "",
    icon: input.icon || "package",
  };
  const hasFile = Boolean(input.imageFile);
  const removesImage = input.removeImage === true;

  if (!hasFile && !removesImage) {
    if (input.active !== undefined) base.active = input.active;
    return base;
  }

  const payload = new FormData();
  payload.append("name", base.name);
  payload.append("description", base.description);
  payload.append("icon", base.icon);
  if (input.active !== undefined) payload.append("active", String(input.active));
  if (hasFile) payload.append("image", input.imageFile);
  if (removesImage) payload.append("remove_image", "true");
  return payload;
};

export const merchantCategoryService = {
  list: () => listCategories(),

  create: async (input) => {
    await api.post(endpoints.categories.create, buildPayload(input));
    return listCategories();
  },

  update: async (id, input) => {
    await api.patch(endpoints.categories.update(id), buildPayload(input));
    return listCategories();
  },

  remove: async (id) => {
    await api.delete(endpoints.categories.delete(id));
    return listCategories();
  },
};
