package com.notebridge.backend.service;

import com.notebridge.backend.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// This service allows Spring Security to verify:

// Whether the user exists in your system.
// The user’s credentials (username and password, here we are using email instead of username).
// The user’s roles for authorization.

@Service
public class OurUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepo usersRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usersRepo.findByEmail(email).orElseThrow();
    }
}
