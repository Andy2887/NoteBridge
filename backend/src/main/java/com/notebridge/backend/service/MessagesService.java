package com.notebridge.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.notebridge.backend.dto.MessagesReqRes;
import com.notebridge.backend.entity.Chat;
import com.notebridge.backend.entity.Message;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.repository.ChatsRepo;
import com.notebridge.backend.repository.MessagesRepo;
import com.notebridge.backend.repository.UsersRepo;

@Service
public class MessagesService {
    
    @Autowired
    private MessagesRepo messagesRepo;
    
    @Autowired
    private ChatsRepo chatsRepo;
    
    @Autowired
    private UsersRepo usersRepo;

    // Send message to chat
    @Transactional
    public MessagesReqRes sendMessage(Long chatId, Long senderId, String content) {
        MessagesReqRes resp = new MessagesReqRes();
        
        try {
            Chat chat = chatsRepo.findById(chatId).orElse(null);
            if (chat == null) {
                resp.setStatusCode(404);
                resp.setMessage("Chat not found with id: " + chatId);
                return resp;
            }
            
            User sender = usersRepo.findById(senderId).orElse(null);
            if (sender == null) {
                resp.setStatusCode(404);
                resp.setMessage("Sender not found with id: " + senderId);
                return resp;
            }
            
            // Check if sender is part of this chat
            if (!chat.getTeacher().getId().equals(senderId) && !chat.getStudent().getId().equals(senderId)) {
                resp.setStatusCode(403);
                resp.setMessage("You don't have access to this chat");
                return resp;
            }
            
            // Create new message
            Message message = new Message();
            message.setChat(chat);
            message.setSender(sender);
            message.setContent(content);
            message.setSentAt(LocalDateTime.now());
            message.setRead(false);
            
            Message savedMessage = messagesRepo.save(message);
            
            // Update chat's last message time
            chat.setLastMessageAt(LocalDateTime.now());
            chatsRepo.save(chat);
            
            resp.setMessageObject(savedMessage);
            resp.setStatusCode(201);
            resp.setMessage("Message sent successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Send message using MessagesReqRes object
    @Transactional
    public MessagesReqRes sendMessage(MessagesReqRes messageRequest, Long senderId) {
        return sendMessage(messageRequest.getChatId(), senderId, messageRequest.getContent());
    }

    // Get chat messages with pagination
    public MessagesReqRes getChatMessages(Long chatId, Long userId, int page, int size) {
        MessagesReqRes resp = new MessagesReqRes();
        
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
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Message> messagesPage = messagesRepo.findByChatOrderBySentAtDesc(chat, pageable);
            
            resp.setMessagesList(messagesPage.getContent());
            resp.setTotalMessageCount(messagesPage.getTotalElements());
            resp.setUnreadMessageCount(messagesRepo.countUnreadMessages(chat, user));
            resp.setStatusCode(200);
            resp.setMessage("Messages retrieved successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Get recent chat messages (last 50)
    public MessagesReqRes getRecentChatMessages(Long chatId, Long userId) {
        MessagesReqRes resp = new MessagesReqRes();
        
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
            
            List<Message> messages = messagesRepo.findTop50ByChatOrderBySentAtDesc(chat);
            
            resp.setMessagesList(messages);
            resp.setTotalMessageCount((long) messages.size());
            resp.setUnreadMessageCount(messagesRepo.countUnreadMessages(chat, user));
            resp.setStatusCode(200);
            resp.setMessage("Recent messages retrieved successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Mark messages as read
    @Transactional
    public MessagesReqRes markMessagesAsRead(Long chatId, Long userId) {
        MessagesReqRes resp = new MessagesReqRes();
        
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
            
            // Count unread messages before marking as read
            long unreadCount = messagesRepo.countUnreadMessages(chat, user);
            
            // Mark messages as read
            messagesRepo.markMessagesAsRead(chat, user);
            
            resp.setMessagesMarkedAsRead((int) unreadCount);
            resp.setUnreadMessageCount(0L);
            resp.setStatusCode(200);
            resp.setMessage("Messages marked as read successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Get unread message count for a specific chat
    public MessagesReqRes getUnreadMessageCount(Long chatId, Long userId) {
        MessagesReqRes resp = new MessagesReqRes();
        
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
            
            long unreadCount = messagesRepo.countUnreadMessages(chat, user);
            
            resp.setUnreadMessageCount(unreadCount);
            resp.setStatusCode(200);
            resp.setMessage("Unread message count retrieved successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Get total unread message count for a user (across all chats)
    public MessagesReqRes getTotalUnreadMessageCount(Long userId) {
        MessagesReqRes resp = new MessagesReqRes();
        
        try {
            User user = usersRepo.findById(userId).orElse(null);
            if (user == null) {
                resp.setStatusCode(404);
                resp.setMessage("User not found with id: " + userId);
                return resp;
            }
            
            long totalUnreadCount = messagesRepo.countTotalUnreadMessages(user);
            
            resp.setUnreadMessageCount(totalUnreadCount);
            resp.setStatusCode(200);
            resp.setMessage("Total unread message count retrieved successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Internal Server Error");
            resp.setError(e.getMessage());
        }
        return resp;
    }
}
