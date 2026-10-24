import { endpoints, apiGet, apiPatch, apiPost } from "../../../../../services/api.js";
import { formatRelative } from "../../shared/adminApi.js";

export const messageEndpoints = {
  list: endpoints.messages.conversations,
  detail: (id) => endpoints.messages.detail(id),
  markRead: (id) => endpoints.messages.markRead(id),
  readAll: endpoints.messages.readAll,
  conversation: (id) => endpoints.messages.conversation(id),
  send: endpoints.messages.send,
};

const mapConversation = (conversation) => ({
  id: conversation.id,
  sender: conversation.sender || "",
  shop: conversation.shop || "",
  avatar: conversation.avatar || "",
  message: conversation.message || "",
  time: formatRelative(conversation.time),
  unread: Number(conversation.unread) || 0,
  status: conversation.status || "open",
});

export const messagesService = {
  /** L'endpoint conversations renvoie deja la liste plate des fils de discussion. */
  list: async () => (await apiGet(messageEndpoints.list)).map(mapConversation),
  thread: async (id) => {
    const [payload, profile] = await Promise.all([
      apiGet(messageEndpoints.conversation(id)),
      apiGet(endpoints.users.me),
    ]);
    const messages = Array.isArray(payload) ? payload : payload?.results ?? [];
    return messages.map((message) => ({
      id: message.id,
      from: message.sender === profile.id ? "me" : "them",
      content: message.content,
      time: formatRelative(message.timestamp),
    }));
  },
  send: (recipientId, content) => apiPost(messageEndpoints.send, {
    recipient_id: recipientId,
    content,
  }),
  markRead: async (id) => {
    await apiPatch(messageEndpoints.markRead(id), {});
    return mapConversation({ id, unread: 0, status: "closed" });
  },
  markAllRead: async () => {
    await apiPatch(messageEndpoints.readAll, {});
    const conversations = await apiGet(messageEndpoints.list);
    return conversations.map((conversation) => mapConversation({ ...conversation, unread: 0 }));
  },
};
