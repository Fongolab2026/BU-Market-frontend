import api, { endpoints } from "../../../../../services/api.js";

const asPage = (payload) => payload?.results ?? payload ?? [];

const initials = (value) => String(value || "?")
  .trim()
  .split(/\s+/)
  .map((part) => part[0] || "")
  .join("")
  .slice(0, 2)
  .toUpperCase();

const toThread = (messages, currentUserId) => messages.map((message) => ({
  from: message.sender === currentUserId ? "me" : "them",
  content: message.content,
  time: message.timestamp,
}));

const loadConversations = async (params = {}) => {
  const { data } = await api.get(endpoints.messages.conversations, { params });
  const summaries = asPage(data);
  const { data: profile } = await api.get(endpoints.users.me);
  return Promise.all(summaries.map(async (summary) => {
    const { data: conversation } = await api.get(endpoints.messages.conversation(summary.id));
    const messages = asPage(conversation);
    return {
      ...summary,
      avatar: summary.avatar || initials(summary.sender),
      time: summary.time || "",
      thread: toThread(messages, profile.id),
    };
  }));
};

export const merchantMessageEndpoints = {
  list: endpoints.messages.list,
  conversations: endpoints.messages.conversations,
  send: endpoints.messages.create,
  markRead: (id) => endpoints.messages.markRead(id),
};

export const merchantMessageService = {
  list: async ({ query = "", page = 1, perPage = 20 } = {}) => {
    const params = { search: query, page, per_page: perPage };
    return loadConversations(params);
  },
  conversations: async () => {
    return loadConversations();
  },
  send: async (conversationId, content) => {
    await api.post(endpoints.messages.send, {
      recipient_id: conversationId,
      content,
    });
    const conversations = await loadConversations();
    return conversations.find((conversation) => conversation.id === conversationId);
  },
  markRead: async (id) => {
    await api.patch(endpoints.messages.markRead(id), {});
    return { id, unread: 0 };
  },
};
