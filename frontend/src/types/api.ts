export interface User {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  instrument?: string;
  bio?: string;
  password?: string;
}

export interface Lesson {
  id: number;
  teacher: User;
  description: string;
  location: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  startTime: string;
  endTime: string;
  meetingLink?: string;
  physicalAddress?: string;
  isCancelled: boolean;
}

export interface Chat {
  id: number;
  teacher: User;
  student: User;
  subject: string;
  createdAt: string;
  lastMessageAt: string;
  isActive: boolean;
}

export interface Message {
  id: number;
  chat: Chat;
  sender: User;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}