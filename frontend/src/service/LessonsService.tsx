import axios from "axios";

// Type definitions matching backend entities
interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  profileUrl?: string;
}

interface Lesson {
  id: number;
  teacher: User;
  title: string;
  instrument: string;
  description?: string;
  imageUrl?: string;
  location: string; // ONLINE, IN_PERSON, HYBRID
  startTime?: string; // ISO string format
  endTime?: string; // ISO string format
  startDate?: string; // ISO string format
  endDate?: string; // ISO string format
  meetingLink?: string;
  physicalAddress?: string;
  isCancelled: boolean;
}

interface LessonsReqRes {
  // Response fields
  statusCode?: number;
  error?: string;
  message?: string;
  
  // Lesson fields for requests
  teacher?: User;
  title?: string;
  instrument?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  meetingLink?: string;
  physicalAddress?: string;
  isCancelled?: boolean;
  
  // Response objects
  lesson?: Lesson;
  lessonsList?: Lesson[];
}

class LessonsService {
  static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // GET ALL LESSONS - Available to all authenticated users
  static async getAllLessons(token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.get(`${LessonsService.BASE_URL}/lesson`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during getAllLessons: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // GET LESSON BY ID - Available to all authenticated users
  static async getLessonById(lessonId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.get(`${LessonsService.BASE_URL}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during getLessonById: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // GET LESSONS BY TEACHER - Available to all authenticated users
  static async getLessonsByTeacher(teacherId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.get(`${LessonsService.BASE_URL}/lesson/teacher/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during getLessonsByTeacher: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // CREATE LESSON - Only teachers can create lessons
  static async createLesson(lessonData: LessonsReqRes, teacherId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.post(`${LessonsService.BASE_URL}/lesson/create/${teacherId}`, lessonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during createLesson: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // CREATE LESSON FOR ADMIN - Admins can create lessons for any teacher
  static async createLessonForAdmin(lessonData: LessonsReqRes, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.post(`${LessonsService.BASE_URL}/admin/lesson/create`, lessonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during createLessonForAdmin: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // UPDATE LESSON - Only the teacher who created the lesson can update it
  static async updateLesson(lessonId: number, lessonData: LessonsReqRes, teacherId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.put(`${LessonsService.BASE_URL}/lesson/update/${lessonId}/${teacherId}`, lessonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during updateLesson: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // UPDATE LESSON FOR ADMIN - Admins can update any lesson
  static async updateLessonForAdmin(lessonId: number, lessonData: LessonsReqRes, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.put(`${LessonsService.BASE_URL}/admin/lesson/update/${lessonId}`, lessonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during updateLessonForAdmin: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // CANCEL LESSON - Only the teacher who created the lesson can cancel it
  static async cancelLesson(lessonId: number, teacherId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.put(`${LessonsService.BASE_URL}/lesson/cancel/${lessonId}/${teacherId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during cancelLesson: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // CANCEL LESSON FOR ADMIN - Admins can cancel any lesson
  static async cancelLessonForAdmin(lessonId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.put(`${LessonsService.BASE_URL}/admin/lesson/cancel/${lessonId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during cancelLessonForAdmin: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // REACTIVATE LESSON - Only the teacher who created the lesson can reactivate it
  static async reactivateLesson(lessonId: number, teacherId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.put(`${LessonsService.BASE_URL}/lesson/reactivate/${lessonId}/${teacherId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during reactivateLesson: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // REACTIVATE LESSON FOR ADMIN - Admins can reactivate any lesson
  static async reactivateLessonForAdmin(lessonId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.put(`${LessonsService.BASE_URL}/admin/lesson/reactivate/${lessonId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during reactivateLessonForAdmin: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // GET ALL LESSONS INCLUDING CANCELLED - Admin only
  static async getAllLessonsIncludingCancelled(token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.get(`${LessonsService.BASE_URL}/admin/lesson/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during getAllLessonsIncludingCancelled: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  // DELETE LESSON PERMANENTLY - Admin only
  static async deleteLessonPermanently(lessonId: number, token: string): Promise<LessonsReqRes> {
    try {
      const response = await axios.delete(`${LessonsService.BASE_URL}/admin/lesson/delete/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.log("Error during deleteLessonPermanently: ", err instanceof Error ? err.message : String(err));
      throw err;
    }
  }
}

export default LessonsService;
export type { Lesson, LessonsReqRes, User };
