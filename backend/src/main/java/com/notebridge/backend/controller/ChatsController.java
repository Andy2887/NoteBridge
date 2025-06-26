package com.notebridge.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.notebridge.backend.dto.ChatsReqRes;
import com.notebridge.backend.service.ChatsService;

@RestController
@RequestMapping("/chat")
public class ChatsController {

    @Autowired
    private ChatsService chatsService;

    // Create or get chat between teacher and student
    @PostMapping("/create/{teacher_id}/{student_id}")
    public ResponseEntity<ChatsReqRes> createOrGetChat(
            @PathVariable Long teacher_id, 
            @PathVariable Long student_id,
            @RequestParam(required = false) String subject) {
        return ResponseEntity.ok(chatsService.createOrGetChat(teacher_id, student_id, subject));
    }

    // Alternative endpoint using request body
    @PostMapping("/create")
    public ResponseEntity<ChatsReqRes> createOrGetChatWithBody(@RequestBody ChatsReqRes chatRequest) {
        return ResponseEntity.ok(chatsService.createOrGetChat(
            chatRequest.getTeacher().getId(), 
            chatRequest.getStudent().getId(), 
            chatRequest.getSubject()
        ));
    }

    // Get current user's chats
    @GetMapping("/user/{user_id}")
    public ResponseEntity<ChatsReqRes> getUserChats(@PathVariable Long user_id) {
        return ResponseEntity.ok(chatsService.getUserChats(user_id));
    }

    // Get chat by ID
    @GetMapping("/{chat_id}/user/{user_id}")
    public ResponseEntity<ChatsReqRes> getChatById(
            @PathVariable Long chat_id, 
            @PathVariable Long user_id) {
        return ResponseEntity.ok(chatsService.getChatById(chat_id, user_id));
    }

    // Update chat subject
    @PutMapping("/{chat_id}/subject/{user_id}")
    public ResponseEntity<ChatsReqRes> updateChatSubject(
            @PathVariable Long chat_id,
            @PathVariable Long user_id,
            @RequestParam String subject) {
        return ResponseEntity.ok(chatsService.updateChatSubject(chat_id, user_id, subject));
    }

    // Alternative endpoint using request body for subject update
    @PutMapping("/{chat_id}/subject/user/{user_id}")
    public ResponseEntity<ChatsReqRes> updateChatSubjectWithBody(
            @PathVariable Long chat_id,
            @PathVariable Long user_id,
            @RequestBody ChatsReqRes chatRequest) {
        return ResponseEntity.ok(chatsService.updateChatSubject(chat_id, user_id, chatRequest.getSubject()));
    }
}
