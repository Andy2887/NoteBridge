package com.notebridge.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.notebridge.backend.dto.AuthReqRes;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.repository.UsersRepo;

@Service
public class AuthService {
    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // User Registration
    public AuthReqRes register(AuthReqRes registrationRequest){
        
        AuthReqRes resp = new AuthReqRes();

        try{
            // Validate required fields
            if(registrationRequest.getEmail() == null || registrationRequest.getEmail().trim().isEmpty()) {
                resp.setStatusCode(400);
                resp.setMessage("Email is required");
                return resp;
            }
            
            if(registrationRequest.getPassword() == null || registrationRequest.getPassword().trim().isEmpty()) {
                resp.setStatusCode(400);
                resp.setMessage("Password is required");
                return resp;
            }
            
            if(registrationRequest.getRole() == null || registrationRequest.getRole().trim().isEmpty()) {
                resp.setStatusCode(400);
                resp.setMessage("Role is required");
                return resp;
            }

            // Check if the user already exists
            if(usersRepo.existsByEmail(registrationRequest.getEmail()))
            {
                resp.setStatusCode(409);
                resp.setMessage("User with this email already exist.");
            }
            else
            {
                User ourUser = new User();
                ourUser.setEmail(registrationRequest.getEmail());
                ourUser.setRole(registrationRequest.getRole());
                ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
                
                // Optional fields - safe to be null
                ourUser.setBio(registrationRequest.getBio());
                ourUser.setFirstName(registrationRequest.getFirstName());
                ourUser.setLastName(registrationRequest.getLastName());
                ourUser.setPhoneNumber(registrationRequest.getPhoneNumber());
                
                User ourUsersResult = usersRepo.save(ourUser);

                if(ourUsersResult.getId() > 0) {
                    resp.setUser(ourUsersResult);
                    resp.setMessage("User Saved Successfully");
                    resp.setStatusCode(200);
                }
            }

        }
        catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // User login
    public AuthReqRes login(AuthReqRes loginRequest) {
        AuthReqRes response = new AuthReqRes();
        try {
            
            // Validates user credentials using AuthenticationManager
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );

            User user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setRole(user.getRole());
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully logged in");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    // 1, Check if the refresh token is valid and matches the user
    // 2, Generate a new JWT for continued access
    public AuthReqRes refreshToken(AuthReqRes refreshTokenRequest) {
        AuthReqRes response = new AuthReqRes();
        try {
            String email = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User user = usersRepo.findByEmail(email).orElseThrow();

            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), user)) {
                String newJwt = jwtUtils.generateToken(user);
                response.setStatusCode(200);
                response.setToken(newJwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Successfully refreshed the token");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    // Fetch all users
    public AuthReqRes getAllUsers() {
        AuthReqRes reqRes = new AuthReqRes();
        try {
            List<User> usersList = usersRepo.findAll();
            if (!usersList.isEmpty()) {
                reqRes.setUsersList(usersList);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Users retrieved successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error: " + e.getMessage());
        }
        return reqRes;
    }

    // Fetch user by ID
    @Cacheable(value = "users", key = "#userId")
    public AuthReqRes getUserByID(Long userId) {
        AuthReqRes reqRes = new AuthReqRes();
        try {
            User user = usersRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            reqRes.setUser(user);
            reqRes.setStatusCode(200);
            reqRes.setMessage("User retrieved successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage(e.getMessage());
        }
        return reqRes;
    }

    // Delete User
    @CacheEvict(value = "users", key = "#userId")
    public AuthReqRes deleteUser(Long userId){
        AuthReqRes reqRes = new AuthReqRes();

        try {
            Optional<User> userOptional = usersRepo.findById(userId);

            if(userOptional.isPresent()){
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error Occurred while deleting user : " + e.getMessage());
        }

        return reqRes;
    }

    // update User
    @CachePut(value = "users", key = "#userId")
    public AuthReqRes updateUser(Long userId, AuthReqRes updatedUserRequest){
        AuthReqRes reqRes = new AuthReqRes();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if(userOptional.isPresent()){
                User existingUser = userOptional.get();
                
                // Update fields from AuthReqRes to User entity
                if(updatedUserRequest.getEmail() != null) {
                    existingUser.setEmail(updatedUserRequest.getEmail());
                }
                if(updatedUserRequest.getRole() != null) {
                    existingUser.setRole(updatedUserRequest.getRole());
                }
                if(updatedUserRequest.getBio() != null) {
                    existingUser.setBio(updatedUserRequest.getBio());
                }
                if(updatedUserRequest.getFirstName() != null) {
                    existingUser.setFirstName(updatedUserRequest.getFirstName());
                }
                if(updatedUserRequest.getLastName() != null) {
                    existingUser.setLastName(updatedUserRequest.getLastName());
                }
                if(updatedUserRequest.getPhoneNumber() != null) {
                    existingUser.setPhoneNumber(updatedUserRequest.getPhoneNumber());
                }

                // Check if password is present in the request
                if(updatedUserRequest.getPassword() != null && !updatedUserRequest.getPassword().isEmpty()){
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUserRequest.getPassword()));
                }

                User savedUser = usersRepo.save(existingUser);
                reqRes.setUser(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error Occurred while updating the user : " + e.getMessage());
        }
        return reqRes;
    }

    // Get my info
    @Cacheable(value = "users", key = "#userId")
    public AuthReqRes getMyInfo(Long userId){
        AuthReqRes reqRes = new AuthReqRes();
        try{
            Optional<User> userOptional = usersRepo.findById(userId);
            if(userOptional.isPresent()){
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User is not found");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting your info : " + e.getMessage());
        }
        return reqRes;
    }


}
