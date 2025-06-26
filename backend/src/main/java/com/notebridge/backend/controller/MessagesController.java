package com.notebridge.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.notebridge.backend.dto.MessagesReqRes;
import com.notebridge.backend.service.MessagesService;

@RestController
@RequestMapping("/message")
public class MessagesController {

    @Autowired
    private MessagesService messagesService;

    // Send message using request body
    @PostMapping("/send/user/{sender_id}")
    public ResponseEntity<MessagesReqRes> sendMessage(
            @PathVariable Long sender_id,
            @RequestBody MessagesReqRes messageRequest) {
        return ResponseEntity.ok(messagesService.sendMessage(messageRequest, sender_id));
    }

    // Get chat messages with pagination
    @GetMapping("/chat/{chat_id}/user/{user_id}")
    public ResponseEntity<MessagesReqRes> getChatMessages(
            @PathVariable Long chat_id,
            @PathVariable Long user_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(messagesService.getChatMessages(chat_id, user_id, page, size));
    }

    // Get recent chat messages (last 50)
    @GetMapping("/chat/{chat_id}/recent/user/{user_id}")
    public ResponseEntity<MessagesReqRes> getRecentChatMessages(
            @PathVariable Long chat_id,
            @PathVariable Long user_id) {
        return ResponseEntity.ok(messagesService.getRecentChatMessages(chat_id, user_id));
    }

    // Mark messages as read
    @PutMapping("/chat/{chat_id}/mark-read/user/{user_id}")
    public ResponseEntity<MessagesReqRes> markMessagesAsRead(
            @PathVariable Long chat_id,
            @PathVariable Long user_id) {
        return ResponseEntity.ok(messagesService.markMessagesAsRead(chat_id, user_id));
    }

    // Get unread message count for specific chat
    @GetMapping("/chat/{chat_id}/unread-count/user/{user_id}")
    public ResponseEntity<MessagesReqRes> getUnreadMessageCount(
            @PathVariable Long chat_id,
            @PathVariable Long user_id) {
        return ResponseEntity.ok(messagesService.getUnreadMessageCount(chat_id, user_id));
    }

    // Get total unread message count for user (across all chats)
    @GetMapping("/unread-count/user/{user_id}")
    public ResponseEntity<MessagesReqRes> getTotalUnreadMessageCount(@PathVariable Long user_id) {
        return ResponseEntity.ok(messagesService.getTotalUnreadMessageCount(user_id));
    }
}
