import { endpoints } from "../../../../../services/api.js";
import { merchantService } from "../../../../../services/mockMerchantService.js";

export const merchantMessageEndpoints = {
  list: endpoints.messages.list,
  conversations: endpoints.messages.conversations,
  send: endpoints.messages.create,
  markRead: (id) => endpoints.messages.markRead(id),
};

export const merchantMessageService = {
  list: async ({ query = "", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage };
    return await merchantService.listConversations(params);
  },
  conversations: async () => {
    return await merchantService.listConversations();
  },
  send: async (data) => {
    return await merchantService.sendMessage(data.conversationId, data.content);
  },
  markRead: async (id) => {
    return await merchantService.markConversationRead(id);
  },
};
