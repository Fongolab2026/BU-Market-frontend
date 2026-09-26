import { merchantService } from '../../../../../services/mockMerchantService.js'

export const merchantCategoryService = {
  list: async () => {
    return await merchantService.listCategories()
  },
  create: async (input) => {
    return await merchantService.createCategory(input)
  },
  update: async (id, input) => {
    return await merchantService.updateCategory(id, input)
  },
  remove: async (id) => {
    return await merchantService.deleteCategory(id)
  },
}