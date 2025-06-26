package com.notebridge.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.notebridge.backend.entity.Chat;
import com.notebridge.backend.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatsReqRes {
    // Response fields
    private int statusCode;
    private String error;
    private String message;

    // Chat fields
    private Long id;
    private User teacher;
    private User student;
    private String subject;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    
    // Chat operations
    private Chat chat;
    private List<Chat> chatsList;
    
    // Additional fields for API responses
    private Long unreadMessageCount;
    private Boolean isNewChat; // To indicate if a chat was newly created or retrieved

}
