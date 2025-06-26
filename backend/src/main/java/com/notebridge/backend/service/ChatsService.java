package com.notebridge.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.notebridge.backend.dto.ChatsReqRes;
import com.notebridge.backend.entity.Chat;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.repository.ChatsRepo;
import com.notebridge.backend.repository.UsersRepo;
import com.notebridge.backend.repository.MessagesRepo;

@Service
public class ChatsService {
    
    @Autowired
    private ChatsRepo chatsRepo;
    
    @Autowired
    private UsersRepo usersRepo;
    
    @Autowired
    private MessagesRepo messagesRepo;

    // Create or get chat between teacher and student
    public ChatsReqRes createOrGetChat(Long teacherId, Long studentId, String subject) {
        ChatsReqRes resp = new ChatsReqRes();
        
        try {
            User teacher = usersRepo.findById(teacherId).orElse(null);
            if (teacher == null) {
                resp.setStatusCode(404);
                resp.setMessage("Teacher not found with id: " + teacherId);
                return resp;
            }
            
            User student = usersRepo.findById(studentId).orElse(null);
            if (student == null) {
                resp.setStatusCode(404);
                resp.setMessage("Student not found with id: " + studentId);
                return resp;
            }
            
            // Check if chat already exists
            Optional<Chat> existingChat = chatsRepo.findByTeacherAndStudent(teacher, student);
            
            if (existingChat.isPresent()) {
                // Chat exists, return it
                Chat chat = existingChat.get();
                resp.setChat(chat);
                resp.setUnreadMessageCount(messagesRepo.countUnreadMessages(chat, teacher)); // Assuming current user is teacher
                resp.setIsNewChat(false);
                resp.setStatusCode(200);
                resp.setMessage("Chat retrieved successfully");
            } else {
                // Create new chat
                Chat newChat = new Chat();
                newChat.setTeacher(teacher);
                newChat.setStudent(student);
                newChat.setSubject(subject != null ? subject : "General Discussion");
                newChat.setCreatedAt(LocalDateTime.now());
                newChat.setLastMessageAt(LocalDateTime.now());
                
                Chat savedChat = chatsRepo.save(newChat);
                resp.setChat(savedChat);
                resp.setUnreadMessageCount(0L);
                resp.setIsNewChat(true);
                resp.setStatusCode(201);
                resp.setMessage("Chat created successfully");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Get current user's chats
    public ChatsReqRes getUserChats(Long userId) {
        ChatsReqRes resp = new ChatsReqRes();
        
        try {
            User user = usersRepo.findById(userId).orElse(null);
            if (user == null) {
                resp.setStatusCode(404);
                resp.setMessage("User not found with id: " + userId);
                return resp;
            }
            
            List<Chat> chatsList = chatsRepo.findByTeacherOrStudentOrderByLastMessageAtDesc(user, user);
            
            if (!chatsList.isEmpty()) {
                resp.setChatsList(chatsList);
                resp.setStatusCode(200);
                resp.setMessage("Chats retrieved successfully");
            } else {
                resp.setStatusCode(200);
                resp.setMessage("No chats found for user");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Get chat by ID
    public ChatsReqRes getChatById(Long chatId, Long userId) {
        ChatsReqRes resp = new ChatsReqRes();
        
        try {
            Chat chat = chatsRepo.findById(chatId).orElse(null);
            if (chat == null) {
                resp.setStatusCode(404);
                resp.setMessage("Chat not found with id: " + chatId);
                return resp;
            }
            
            User user = usersRepo.findById(userId).orElse(null);
            if (user == null) {
                resp.setStatusCode(404);
                resp.setMessage("User not found with id: " + userId);
                return resp;
            }
            
            // Check if user is part of this chat
            if (!chat.getTeacher().getId().equals(userId) && !chat.getStudent().getId().equals(userId)) {
                resp.setStatusCode(403);
                resp.setMessage("You don't have access to this chat");
                return resp;
            }
            
            resp.setChat(chat);
            resp.setUnreadMessageCount(messagesRepo.countUnreadMessages(chat, user));
            resp.setStatusCode(200);
            resp.setMessage("Chat retrieved successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Update chat subject
    public ChatsReqRes updateChatSubject(Long chatId, Long userId, String newSubject) {
        ChatsReqRes resp = new ChatsReqRes();
        
        try {
            Chat chat = chatsRepo.findById(chatId).orElse(null);
            if (chat == null) {
                resp.setStatusCode(404);
                resp.setMessage("Chat not found with id: " + chatId);
                return resp;
            }
            
            // Check if user is part of this chat
            if (!chat.getTeacher().getId().equals(userId) && !chat.getStudent().getId().equals(userId)) {
                resp.setStatusCode(403);
                resp.setMessage("You don't have access to this chat");
                return resp;
            }
            
            chat.setSubject(newSubject);
            Chat updatedChat = chatsRepo.save(chat);
            
            resp.setChat(updatedChat);
            resp.setStatusCode(200);
            resp.setMessage("Chat subject updated successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }
}
