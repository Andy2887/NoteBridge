import { useApi } from './useApi';
import { lessonService } from '../services/lessonService';
import type { Lesson } from '../types/api';

export function useLessons() {
  return useApi(() => lessonService.getAllLessons(), []);
}

export function useUpcomingLessons() {
  return useApi(() => lessonService.getUpcomingLessons(), []);
}

export function useMyLessons() {
  return useApi(() => lessonService.getMyLessons(), []);
}

export function useLesson(id: number) {
  return useApi(() => lessonService.getLessonById(id), [id]);
}