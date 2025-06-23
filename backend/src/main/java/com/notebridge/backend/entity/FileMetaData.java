package com.notebridge.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class FileMetaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "unique_id", nullable = false)
    private String uniqueId;

    @Column(name = "object_name", nullable = false)
    private String objectName;

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

}