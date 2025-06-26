package com.notebridge.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.notebridge.backend.entity.Message;
import com.notebridge.backend.entity.Chat;
import com.notebridge.backend.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessagesReqRes {
    // Response fields
    private int statusCode;
    private String error;
    private String message;

    // Message fields
    private Long id;
    private Chat chat;
    private User sender;
    private String content;
    private LocalDateTime sentAt;
    private Boolean isRead;
    
    // Message operations
    private Message messageObject;
    private List<Message> messagesList;
    
    // Additional fields for API responses
    private Long unreadMessageCount;
    private Long totalMessageCount;
    private Integer messagesMarkedAsRead; // Number of messages marked as read
    private Long chatId; // For sending messages to a specific chat

}
