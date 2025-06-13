import { api } from '../lib/api';
import type { Chat, Message } from '../types/api';

interface CreateChatRequest {
  teacherId: number;
  studentId: number;
  subject: string;
}

interface SendMessageRequest {
  content: string;
}

export const chatService = {
  // Create or get chat
  async createChat(chatData: CreateChatRequest): Promise<Chat> {
    return api.post<Chat>('/chats', chatData);
  },

  // Get my chats
  async getMyChats(): Promise<Chat[]> {
    return api.get<Chat[]>('/chats');
  },

  // Send message
  async sendMessage(chatId: number, messageData: SendMessageRequest): Promise<Message> {
    return api.post<Message>(`/chats/${chatId}/messages`, messageData);
  },

  // Get chat messages
  async getChatMessages(chatId: number, page = 0, size = 20): Promise<{
    content: Message[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    return api.get(`/chats/${chatId}/messages?page=${page}&size=${size}`);
  },

  // Mark messages as read
  async markAsRead(chatId: number): Promise<string> {
    return api.put<string>(`/chats/${chatId}/read`);
  },

  // Get unread count
  async getUnreadCount(): Promise<{ unreadCount: number }> {
    return api.get<{ unreadCount: number }>('/chats/unread-count');
  },
};