package com.notebridge.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Objects;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JWTUtils {
    private SecretKey key;
    private static final Long EXPIRATION_TIME = 86400000L;


    public JWTUtils(@Value("${jwt.secret}") String secretString){

        // decode string into binary format
        byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
        // Create a SecretKey object from the byte array
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(UserDetails userDetails){
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(this.key)
                .compact();
                
    }

    public String generateRefreshToken(HashMap<String, Objects> claims, UserDetails userDetails){
        // Map<String, Objects> claims
        // Purpose: Allows adding custom data (claims) to the token.
        return Jwts.builder()
                // Claims are custom key-value pairs added to the refresh token to store additional data like roles or permissions.
                // These are included to provide extra information about the user/session without querying the database.
                .claims(claims) 
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(this.key)
                .compact();
    }

    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        // Function<Claims, T> claimsTFunction:
        // This represents the specific logic for extracting a claim.
        // Example: If you want the username, you provide a function to get the subject (Claims::getSubject).
        return claimsTFunction.apply(
            Jwts.parser()
                    .verifyWith(this.key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
        );
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }
}
