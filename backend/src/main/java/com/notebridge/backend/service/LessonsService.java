package com.notebridge.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.notebridge.backend.dto.LessonsReqRes;
import com.notebridge.backend.entity.Lesson;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.repository.LessonsRepo;
import com.notebridge.backend.repository.UsersRepo;

@Service
public class LessonsService {
    
    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private LessonsRepo lessonsRepo;

    // GET ALL LESSONS - Available to all authenticated users
    @Cacheable(value = "lessons", key = "'all-active'")
    public LessonsReqRes getAllLessons(){
        LessonsReqRes resp = new LessonsReqRes();

        try {
            List<Lesson> lessonsList = lessonsRepo.findByIsCancelledFalse();
            if (!lessonsList.isEmpty()) {
                resp.setLessonsList(lessonsList);
                resp.setStatusCode(200);
                resp.setMessage("Lessons retrieved successfully");
            } else {
                resp.setStatusCode(200);
                resp.setMessage("No lessons found");
            }
        } catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // GET LESSON BY ID - Available to all authenticated users
    @Cacheable(value = "lesson", key = "#lessonId")
    public LessonsReqRes getLessonById(Long lessonId) {
        LessonsReqRes resp = new LessonsReqRes();
        try {
            Lesson lesson = lessonsRepo.findById(lessonId).orElse(null);
            if (lesson != null) {
                resp.setLesson(lesson);
                resp.setStatusCode(200);
                resp.setMessage("Lesson retrieved successfully");
            } else {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // GET LESSONS BY TEACHER - Available to all authenticated users
    @Cacheable(value = "teacher-lessons", key = "#teacherId")
    public LessonsReqRes getLessonsByTeacher(Long teacherId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            User teacher = usersRepo.findById(teacherId).orElse(null);
            if (teacher == null) {
                resp.setStatusCode(404);
                resp.setMessage("Teacher not found with id: " + teacherId);
                return resp;
            }
            
            List<Lesson> lessonsList = lessonsRepo.findByTeacherAndIsCancelledFalse(teacher);
            if (!lessonsList.isEmpty()) {
                resp.setLessonsList(lessonsList);
                resp.setStatusCode(200);
                resp.setMessage("Lessons retrieved successfully for teacher: " + teacher.getFirstName() + " " + teacher.getLastName());
            } else {
                resp.setStatusCode(200);
                resp.setMessage("No lessons found for teacher: " + teacher.getFirstName() + " " + teacher.getLastName());
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // CREATE LESSON - Only teachers can create lessons
    @Caching(evict = {
        @CacheEvict(value = "lessons", key = "'all-active'"),
        @CacheEvict(value = "teacher-lessons", key = "#teacherId")
    })
    public LessonsReqRes createLesson(LessonsReqRes lessonsRequest, Long teacherId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            User teacher = usersRepo.findById(teacherId).orElse(null);
            if (teacher == null) {
                resp.setStatusCode(404);
                resp.setMessage("Teacher not found with id: " + teacherId);
                return resp;
            }
            
            Lesson lesson = new Lesson();
            lesson.setTeacher(teacher);
            lesson.setTitle(lessonsRequest.getTitle());
            lesson.setInstrument(lessonsRequest.getInstrument());
            lesson.setDescription(lessonsRequest.getDescription());
            lesson.setLocation(lessonsRequest.getLocation());
            lesson.setStartTime(lessonsRequest.getStartTime());
            lesson.setEndTime(lessonsRequest.getEndTime());
            lesson.setStartDate(lessonsRequest.getStartDate());
            lesson.setEndDate(lessonsRequest.getEndDate());
            lesson.setMeetingLink(lessonsRequest.getMeetingLink());
            lesson.setPhysicalAddress(lessonsRequest.getPhysicalAddress());
            lesson.setCancelled(false);
            
            Lesson savedLesson = lessonsRepo.save(lesson);
            resp.setLesson(savedLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson created successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // CREATE LESSON FOR ADMIN - This is for admin, they could create any lesson and associate the lesson to a teacher
    @Caching(evict = {
        @CacheEvict(value = "lessons", key = "'all-active'"),
        @CacheEvict(value = "teacher-lessons", key = "#lessonsRequest.teacher.id")
    })
    public LessonsReqRes createLessonForAdmin(LessonsReqRes lessonsRequest) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            User teacher = usersRepo.findById(lessonsRequest.getTeacher().getId()).orElse(null);
            if (teacher == null) {
                resp.setStatusCode(404);
                resp.setMessage("Teacher not found with id: " + lessonsRequest.getTeacher().getId());
                return resp;
            }
            
            Lesson lesson = new Lesson();
            lesson.setTeacher(teacher);
            lesson.setTitle(lessonsRequest.getTitle());
            lesson.setInstrument(lessonsRequest.getInstrument());
            lesson.setDescription(lessonsRequest.getDescription());
            lesson.setLocation(lessonsRequest.getLocation());
            lesson.setStartTime(lessonsRequest.getStartTime());
            lesson.setEndTime(lessonsRequest.getEndTime());
            lesson.setStartDate(lessonsRequest.getStartDate());
            lesson.setEndDate(lessonsRequest.getEndDate());
            lesson.setMeetingLink(lessonsRequest.getMeetingLink());
            lesson.setPhysicalAddress(lessonsRequest.getPhysicalAddress());
            lesson.setCancelled(false);
            
            Lesson savedLesson = lessonsRepo.save(lesson);
            resp.setLesson(savedLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson created successfully by admin");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // UPDATE LESSON - Only the teacher who created the lesson can update it
    @Caching(
        put = @CachePut(value = "lesson", key = "#lessonId"),
        evict = {
            @CacheEvict(value = "lessons", key = "'all-active'"),
            @CacheEvict(value = "teacher-lessons", key = "#teacherId")
        }
    )
    public LessonsReqRes updateLesson(Long lessonId, LessonsReqRes lessonsRequest, Long teacherId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            if (!existingLesson.getTeacher().getId().equals(teacherId)) {
                resp.setStatusCode(403);
                resp.setMessage("You can only update your own lessons");
                return resp;
            }
            
            existingLesson.setTitle(lessonsRequest.getTitle());
            existingLesson.setInstrument(lessonsRequest.getInstrument());
            existingLesson.setDescription(lessonsRequest.getDescription());
            existingLesson.setLocation(lessonsRequest.getLocation());
            existingLesson.setStartTime(lessonsRequest.getStartTime());
            existingLesson.setEndTime(lessonsRequest.getEndTime());
            existingLesson.setStartDate(lessonsRequest.getStartDate());
            existingLesson.setEndDate(lessonsRequest.getEndDate());
            existingLesson.setMeetingLink(lessonsRequest.getMeetingLink());
            existingLesson.setPhysicalAddress(lessonsRequest.getPhysicalAddress());
            
            Lesson updatedLesson = lessonsRepo.save(existingLesson);
            resp.setLesson(updatedLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson updated successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // UPDATE LESSON FOR ADMIN - This is for admin, they could update any lesson
    @Caching(
        put = @CachePut(value = "lesson", key = "#lessonId"),
        evict = {
            @CacheEvict(value = "lessons", key = "'all-active'"),
            @CacheEvict(value = "teacher-lessons", key = "#lessonsRequest.teacher.id")
        }
    )
    public LessonsReqRes updateLessonForAdmin(Long lessonId, LessonsReqRes lessonsRequest) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            if (lessonsRequest.getTeacher() != null && lessonsRequest.getTeacher().getId() != null) {
                User newTeacher = usersRepo.findById(lessonsRequest.getTeacher().getId()).orElse(null);
                if (newTeacher != null) {
                    existingLesson.setTeacher(newTeacher);
                }
            }
            existingLesson.setTitle(lessonsRequest.getTitle());
            existingLesson.setInstrument(lessonsRequest.getInstrument());
            existingLesson.setDescription(lessonsRequest.getDescription());
            existingLesson.setLocation(lessonsRequest.getLocation());
            existingLesson.setStartTime(lessonsRequest.getStartTime());
            existingLesson.setEndTime(lessonsRequest.getEndTime());
            existingLesson.setStartDate(lessonsRequest.getStartDate());
            existingLesson.setEndDate(lessonsRequest.getEndDate());
            existingLesson.setMeetingLink(lessonsRequest.getMeetingLink());
            existingLesson.setPhysicalAddress(lessonsRequest.getPhysicalAddress());
            
            Lesson updatedLesson = lessonsRepo.save(existingLesson);
            resp.setLesson(updatedLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson updated successfully by admin");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // CANCEL LESSON - Only the teacher who created the lesson could cancel it
    @Caching(
        put = @CachePut(value = "lesson", key = "#lessonId"),
        evict = {
            @CacheEvict(value = "lessons", key = "'all-active'"),
            @CacheEvict(value = "teacher-lessons", key = "#teacherId")
        }
    )
    public LessonsReqRes cancelLesson(Long lessonId, Long teacherId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            if (!existingLesson.getTeacher().getId().equals(teacherId)) {
                resp.setStatusCode(403);
                resp.setMessage("You can only cancel your own lessons");
                return resp;
            }
            
            existingLesson.setCancelled(true);
            Lesson cancelledLesson = lessonsRepo.save(existingLesson);
            resp.setLesson(cancelledLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson cancelled successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // CANCEL LESSON FOR ADMIN - This is for Admin, they could cancel any lesson
    @Caching(
        put = @CachePut(value = "lesson", key = "#lessonId"),
        evict = {
            @CacheEvict(value = "lessons", key = "'all-active'"),
            @CacheEvict(value = "teacher-lessons", allEntries = true)
        }
    )
    public LessonsReqRes cancelLessonForAdmin(Long lessonId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            existingLesson.setCancelled(true);
            Lesson cancelledLesson = lessonsRepo.save(existingLesson);
            resp.setLesson(cancelledLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson cancelled successfully by admin");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // REACTIVATE LESSON - Only the teacher who created the lesson can reactivate it
    @Caching(
        put = @CachePut(value = "lesson", key = "#lessonId"),
        evict = {
            @CacheEvict(value = "lessons", key = "'all-active'"),
            @CacheEvict(value = "teacher-lessons", key = "#teacherId")
        }
    )
    public LessonsReqRes reactivateLesson(Long lessonId, Long teacherId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            if (!existingLesson.getTeacher().getId().equals(teacherId)) {
                resp.setStatusCode(403);
                resp.setMessage("You can only reactivate your own lessons");
                return resp;
            }
            
            existingLesson.setCancelled(false);
            Lesson reactivatedLesson = lessonsRepo.save(existingLesson);
            resp.setLesson(reactivatedLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson reactivated successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // REACTIVATE LESSON FOR ADMIN - Admin could reactivate any lesson
    @Caching(
        put = @CachePut(value = "lesson", key = "#lessonId"),
        evict = {
            @CacheEvict(value = "lessons", key = "'all-active'"),
            @CacheEvict(value = "teacher-lessons", allEntries = true)
        }
    )
    public LessonsReqRes reactivateLessonForAdmin(Long lessonId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            existingLesson.setCancelled(false);
            Lesson reactivatedLesson = lessonsRepo.save(existingLesson);
            resp.setLesson(reactivatedLesson);
            resp.setStatusCode(200);
            resp.setMessage("Lesson reactivated successfully by admin");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // GET ALL LESSONS INCLUDING CANCELLED - Only admins can access this
    public LessonsReqRes getAllLessonsIncludingCancelled() {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            List<Lesson> lessonsList = lessonsRepo.findAll();
            if (!lessonsList.isEmpty()) {
                resp.setLessonsList(lessonsList);
                resp.setStatusCode(200);
                resp.setMessage("All lessons (including cancelled) retrieved successfully");
            } else {
                resp.setStatusCode(200);
                resp.setMessage("No lessons found");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // DELETE LESSON PERMANENTLY - Only admins can permanently delete lessons
    // When you delete the lesson from database, you also need to delete the 
    // lesson image (in files repo) associated with the lesson
    @Caching(evict = {
        @CacheEvict(value = "lessons", key = "'all-active'"),
        @CacheEvict(value = "lesson", key = "#lessonId"),
        @CacheEvict(value = "teacher-lessons", allEntries = true)
    })
    public LessonsReqRes deleteLessonPermanently(Long lessonId) {
        LessonsReqRes resp = new LessonsReqRes();
        
        try {
            Lesson existingLesson = lessonsRepo.findById(lessonId).orElse(null);
            if (existingLesson == null) {
                resp.setStatusCode(404);
                resp.setMessage("Lesson not found with id: " + lessonId);
                return resp;
            }
            
            // Note: If there are lesson images associated with the lesson, 
            // you would need to implement the logic to find and delete them
            // For example: filesRepo.deleteByLessonId(lessonId);
            // This depends on your FileMetaData entity structure
            
            lessonsRepo.deleteById(lessonId);
            resp.setStatusCode(200);
            resp.setMessage("Lesson deleted permanently");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

}
