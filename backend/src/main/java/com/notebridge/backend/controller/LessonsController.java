package com.notebridge.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.notebridge.backend.dto.LessonsReqRes;
import com.notebridge.backend.service.LessonsService;

@RestController
public class LessonsController {

    @Autowired
    private LessonsService lessonsService;

    // Get all lessons
    @GetMapping("/lesson")
    public ResponseEntity<LessonsReqRes> getAllLessons(){
        return ResponseEntity.ok(lessonsService.getAllLessons());
    }    
    
    // Get lesson by id
    @GetMapping("/lesson/{lesson_id}")
    public ResponseEntity<LessonsReqRes> getLessonById(@PathVariable Long lesson_id){
        return ResponseEntity.ok(lessonsService.getLessonById(lesson_id));
    }

    // Get lessons by teacher
    @GetMapping("/lesson/teacher/{teacher_id}")
    public ResponseEntity<LessonsReqRes> getLessonsByTeacher(@PathVariable Long teacher_id){
        return ResponseEntity.ok(lessonsService.getLessonsByTeacher(teacher_id));
    }

    // Create lesson (for teachers)
    @PostMapping("/lesson/create/{teacher_id}")
    public ResponseEntity<LessonsReqRes> createLesson(@RequestBody LessonsReqRes lessonsRequest, @PathVariable Long teacher_id){
        return ResponseEntity.ok(lessonsService.createLesson(lessonsRequest, teacher_id));
    }

    // Create lesson for admin
    @PostMapping("/admin/lesson/create")
    public ResponseEntity<LessonsReqRes> createLessonForAdmin(@RequestBody LessonsReqRes lessonsRequest){
        return ResponseEntity.ok(lessonsService.createLessonForAdmin(lessonsRequest));
    }

    // Update lesson (for teachers)
    @PutMapping("/lesson/update/{lesson_id}/{teacher_id}")
    public ResponseEntity<LessonsReqRes> updateLesson(@PathVariable Long lesson_id, @RequestBody LessonsReqRes lessonsRequest, @PathVariable Long teacher_id){
        return ResponseEntity.ok(lessonsService.updateLesson(lesson_id, lessonsRequest, teacher_id));
    }

    // Update lesson for admin
    @PutMapping("/admin/lesson/update/{lesson_id}")
    public ResponseEntity<LessonsReqRes> updateLessonForAdmin(@PathVariable Long lesson_id, @RequestBody LessonsReqRes lessonsRequest){
        return ResponseEntity.ok(lessonsService.updateLessonForAdmin(lesson_id, lessonsRequest));
    }

    // Cancel lesson (for teachers)
    @PutMapping("/lesson/cancel/{lesson_id}/{teacher_id}")
    public ResponseEntity<LessonsReqRes> cancelLesson(@PathVariable Long lesson_id, @PathVariable Long teacher_id){
        return ResponseEntity.ok(lessonsService.cancelLesson(lesson_id, teacher_id));
    }

    // Cancel lesson for admin
    @PutMapping("/admin/lesson/cancel/{lesson_id}")
    public ResponseEntity<LessonsReqRes> cancelLessonForAdmin(@PathVariable Long lesson_id){
        return ResponseEntity.ok(lessonsService.cancelLessonForAdmin(lesson_id));
    }

    // Reactivate lesson (for teachers)
    @PutMapping("/lesson/reactivate/{lesson_id}/{teacher_id}")
    public ResponseEntity<LessonsReqRes> reactivateLesson(@PathVariable Long lesson_id, @PathVariable Long teacher_id){
        return ResponseEntity.ok(lessonsService.reactivateLesson(lesson_id, teacher_id));
    }

    // Reactivate lesson for admin
    @PutMapping("/admin/lesson/reactivate/{lesson_id}")
    public ResponseEntity<LessonsReqRes> reactivateLessonForAdmin(@PathVariable Long lesson_id){
        return ResponseEntity.ok(lessonsService.reactivateLessonForAdmin(lesson_id));
    }

    // Get all lessons including cancelled (admin only)
    @GetMapping("/admin/lesson/all")
    public ResponseEntity<LessonsReqRes> getAllLessonsIncludingCancelled(){
        return ResponseEntity.ok(lessonsService.getAllLessonsIncludingCancelled());
    }

    // Delete lesson permanently (admin only)
    @DeleteMapping("/admin/lesson/delete/{lesson_id}")
    public ResponseEntity<LessonsReqRes> deleteLessonPermanently(@PathVariable Long lesson_id){
        return ResponseEntity.ok(lessonsService.deleteLessonPermanently(lesson_id));
    }}
