package com.notebridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String instrument;

    @Column(length = 1000)
    private String description;

    // ONLINE, IN_PERSON, HYBRID
    @Column(nullable = false)
    private String location;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String meetingLink;

    private String physicalAddress;

    private boolean isCancelled = false;

}
