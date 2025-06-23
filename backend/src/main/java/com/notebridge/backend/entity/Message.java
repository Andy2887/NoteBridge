package com.notebridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;
    
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @Column(nullable = false, length = 1000)
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private boolean isRead = false;
    
}
