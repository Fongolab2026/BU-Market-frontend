import api, { endpoints } from "../../../../../services/api.js";

const asPage = (payload) => payload?.results ?? payload ?? [];

const MAX_PAGE_SIZE = 100;

const loadMessages = async (conversationId) => {
  const { data: first } = await api.get(endpoints.messages.conversation(conversationId), {
    params: { page: 1, perPage: MAX_PAGE_SIZE },
  });
  const messages = asPage(first);
  const totalPages = Number(first?.totalPages) || 1;
  if (totalPages <= 1) return messages;
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      api.get(endpoints.messages.conversation(conversationId), {
        params: { page: index + 2, perPage: MAX_PAGE_SIZE },
      }),
    ),
  );
  return [...messages, ...rest.flatMap(({ data }) => asPage(data))];
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toThread = (messages, currentUserId) => messages.map((message) => ({
  from: message.sender === currentUserId ? "me" : "them",
  content: message.content,
  time: formatTime(message.timestamp),
}));

const loadConversations = async (params = {}) => {
  const { data } = await api.get(endpoints.messages.conversations, { params });
  const summaries = asPage(data);
  const { data: profile } = await api.get(endpoints.users.me);
  return Promise.all(summaries.map(async (summary) => {
    const messages = await loadMessages(summary.id);
    return {
      ...summary,
      avatar: summary.avatar || null,
      time: formatTime(summary.time),
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
  unreadCount: async () => {
    const { data } = await api.get(endpoints.messages.unreadCount);
    return Number(data?.count) || 0;
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
  markAllRead: async () => {
    await api.patch(endpoints.messages.readAll, {});
  },
};
