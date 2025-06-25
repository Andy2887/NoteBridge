package com.notebridge.backend.config;

import com.notebridge.backend.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private OurUserDetailsService ourUserDetailsService;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable) // Turn off CSRF (not needed for API)
                .cors(Customizer.withDefaults()) // Enable CORS (to allow requests from other domains)
                // Secure different parts of the app
                .authorizeHttpRequests(request -> 
                    request.requestMatchers(
                            "/auth/**",
                            "/public/**"
                        ).permitAll() // Public paths

                        .requestMatchers(
                            "/admin/**"
                        ).hasAnyAuthority("ADMIN") // Admin-only paths
                        
                        .requestMatchers(
                            "/user/**", 
                            "/file/**"
                        ).hasAnyAuthority("STUDENT", "TEACHER", "ADMIN") // Student, Teacher and Admin paths
                        
                        .anyRequest().authenticated()) // All other paths need login
                        
                // Don't store the sessions on the server (stateless)
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Use a Custom authentication provider
                .authenticationProvider(authenticationProvider())
                // Adds the JWTAuthFilter to validate tokens before the UsernamePasswordAuthenticationFilter processes authentication.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();

    }

    // Purpose: verifies user credentials and loads user details from database
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(); // Create a new DaoAuthenticationProvider
        daoAuthenticationProvider.setUserDetailsService(ourUserDetailsService); // Links the custom userDetailsService
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder()); // Set the passwordEncoder for secure password verification
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager (AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
