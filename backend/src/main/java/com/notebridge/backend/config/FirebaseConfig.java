package com.notebridge.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.storage-bucket}")
    private String storageBucket;

    @Bean
    FirebaseApp firebaseApp() throws IOException {
        InputStream serviceAccount = getServiceAccountStream();

        FirebaseOptions options = FirebaseOptions.builder()
                .setProjectId(projectId)
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket(storageBucket)
                .build();

        return FirebaseApp.initializeApp(options);
    }

    private InputStream getServiceAccountStream() throws IOException {
        // Try Render secrets file first (production)
        Path secretsPath = Paths.get("/etc/secrets/serviceAccountKey.json");
        if (Files.exists(secretsPath)) {
            return new FileSystemResource(secretsPath.toFile()).getInputStream();
        }
        
        // Fall back to classpath (development)
        ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
        return resource.getInputStream();
    }
}