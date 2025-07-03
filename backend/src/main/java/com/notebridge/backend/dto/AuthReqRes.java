package com.notebridge.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import com.notebridge.backend.entity.User;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields from JSON
@JsonIgnoreProperties(ignoreUnknown = true) // Ignore the "not defined" fields in my JSON file
public class AuthReqRes {
    // Response fields
    private int statusCode;
    private String error;
    private String message;
    
    // Authentication response fields
    private String token;
    private String refreshToken;
    private String expirationTime;
    
    // User fields for registration/login requests and responses
    private String email;
    private String password;
    private String role; // STUDENT, ADMIN, TEACHER
    private String bio;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profileUrl;
    
    // User object for responses
    private User user;
    private List<User> usersList;
}
