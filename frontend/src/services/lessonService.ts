import { api } from '../lib/api';
import type { Lesson } from '../types/api';

export const lessonService = {
  // Get all active lessons
  async getAllLessons(): Promise<Lesson[]> {
    return api.get<Lesson[]>('/lessons');
  },

  // Get lesson by ID
  async getLessonById(id: number): Promise<Lesson> {
    return api.get<Lesson>(`/lessons/${id}`);
  },

  // Get lessons by teacher
  async getLessonsByTeacher(teacherId: number): Promise<Lesson[]> {
    return api.get<Lesson[]>(`/lessons/teacher/${teacherId}`);
  },

  // Get upcoming lessons
  async getUpcomingLessons(): Promise<Lesson[]> {
    return api.get<Lesson[]>('/lessons/upcoming');
  },

  // Create lesson
  async createLesson(lessonData: Omit<Lesson, 'id' | 'cancelled'>): Promise<string> {
    return api.post<string>('/lessons', lessonData);
  },

  // Update lesson
  async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<string> {
    return api.put<string>(`/lessons/${id}`, lessonData);
  },

  // Cancel lesson
  async cancelLesson(id: number): Promise<string> {
    return api.put<string>(`/lessons/${id}/cancel`, {});
  },

  // Reactivate lesson
  async reactivateLesson(id: number): Promise<string> {
    return api.put<string>(`/lessons/${id}/reactivate`, {});
  },

  // Get my lessons
  async getMyLessons(): Promise<Lesson[]> {
    return api.get<Lesson[]>('/lessons/my-lessons');
  },

  // Upload lesson picture
  async uploadLessonPicture(lessonId: number, file: File): Promise<string> {
    return api.uploadFile<string>(`/files/upload/lesson_pic/${lessonId}`, file);
  },
};