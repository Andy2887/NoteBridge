package com.notebridge.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.notebridge.backend.entity.Lesson;
import com.notebridge.backend.entity.User;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON
@JsonIgnoreProperties(ignoreUnknown = true) // Ignore the "not defined" fields in my JSON file
public class LessonsReqRes {
    // Response fields
    private int statusCode;
    private String error;
    private String message;

    // Lesson fields
    private User teacher;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String meetingLink;
    private String physicalAddress;
    private Boolean isCancelled;

    // Lessons
    Lesson lesson;
    List<Lesson> lessonsList;

}
