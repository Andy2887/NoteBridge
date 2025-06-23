package com.notebridge.backend.repository;

import com.notebridge.backend.entity.Lesson;
import com.notebridge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LessonsRepo extends JpaRepository<Lesson, Long> {
    // Find lessons by teacher
    List<Lesson> findByTeacher(User teacher);

    // Find lessons by location type
    List<Lesson> findByLocation(String locationType);

    // Find upcoming lessons for a teacher
    List<Lesson> findByTeacherAndStartTimeAfter(User teacher, LocalDateTime now);

    // Find non-cancelled lessons
    List<Lesson> findByIsCancelledFalse();

    // Find non-cancelled lessons by teacher
    List<Lesson> findByTeacherAndIsCancelledFalse(User user);

    // Find non-cancelled lessons in the future
    List<Lesson> findByStartTimeAfterAndIsCancelledFalse(LocalDateTime now);
}
