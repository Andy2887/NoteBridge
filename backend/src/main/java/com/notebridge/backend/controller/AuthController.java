package com.notebridge.backend.controller;

import com.notebridge.backend.dto.AuthReqRes;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.service.AuthService;
import com.notebridge.backend.repository.UsersRepo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private AuthService usersManagementService;

    // Register
    @PostMapping("/auth/register")
    public ResponseEntity<AuthReqRes> register(@RequestBody AuthReqRes reg){
        return ResponseEntity.ok(usersManagementService.register(reg));
    }

    // Login
    @PostMapping("/auth/login")
    public ResponseEntity<AuthReqRes> login(@RequestBody AuthReqRes req){
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    // Refresh Token
    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthReqRes> refreshToken(@RequestBody AuthReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    // Get all users - permit only to admin
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<AuthReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    // Get User by ID - permit only to admin
    @GetMapping("/admin/get-user/{userId}")
    public ResponseEntity<AuthReqRes> getUserById(@PathVariable Long userId){
        return ResponseEntity.ok(usersManagementService.getUserByID(userId));
    }

    // Update user
    @PutMapping("/user/update/{userId}")
    public ResponseEntity<AuthReqRes> updateUser(@PathVariable Long userId, @RequestBody AuthReqRes req){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, req));
    }

    // Get the profile
    @GetMapping("/user/get-profile")
    public ResponseEntity<AuthReqRes> getMyProfile(){
        // Get the Authentication object for the current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // getName() -> principle name(Username) for the current authenticated user
        String email = authentication.getName();
        
        // First get the user to extract the ID
        Optional<User> userOptional = usersRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            Long userId = userOptional.get().getId();
            AuthReqRes response = usersManagementService.getMyInfo(userId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } else {
            AuthReqRes response = new AuthReqRes();
            response.setStatusCode(404);
            response.setMessage("User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    // Delete User
    @DeleteMapping("/user/deleteUser/{userId}")
    public ResponseEntity<AuthReqRes> deleteUser(@PathVariable Long userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }


}
