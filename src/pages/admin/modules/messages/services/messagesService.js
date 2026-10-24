import { endpoints, apiGet, apiPatch, apiPost } from "../../../../../services/api.js";
import { fetchAllPages, formatDateTime, formatRelative } from "../../shared/adminApi.js";

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

const mapThreadMessage = (message) => ({
  id: message.id,
  sender: message.sender,
  content: message.content,
  time: formatDateTime(message.timestamp),
});

export const messagesService = {
  /** L'endpoint conversations renvoie deja la liste plate des fils de discussion. */
  list: async () => (await apiGet(messageEndpoints.list)).map(mapConversation),
  unreadCount: async () => {
    const response = await apiGet(endpoints.messages.unreadCount);
    return Number(response?.count) || 0;
  },
  thread: async (id) => {
    const messages = await fetchAllPages(messageEndpoints.conversation(id));
    return messages.map(mapThreadMessage);
  },
  send: async (id, content) => {
    const message = await apiPost(messageEndpoints.send, {
      recipient_id: id,
      content,
    });
    return mapThreadMessage(message);
  },
  markRead: async (id) => {
    await apiPatch(messageEndpoints.markRead(id), {});
    return mapConversation({ id, unread: 0, status: "closed" });
  },
  markAllRead: async () => {
    await apiPatch(messageEndpoints.readAll, {});
  },
};
