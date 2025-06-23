package com.notebridge.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.notebridge.backend.entity.User;

import java.util.Optional;

// JpaRepository: Provides CRUD operations out of the box
// existsByEmail: Checks if a user with a specific email exists
// findByEmail: Fetches a user by email
public interface UsersRepo extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
