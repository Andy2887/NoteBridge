package com.notebridge.backend.repository;

import com.notebridge.backend.entity.Chat;
import com.notebridge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatsRepo extends JpaRepository<Chat, Long> {
    
    // Find chat between specific teacher and student
    Optional<Chat> findByTeacherAndStudent(User teacher, User student);
    
    // Find all chats for a user (either as teacher or student)
    List<Chat> findByTeacherOrStudentOrderByLastMessageAtDesc(User teacher, User student);
}
