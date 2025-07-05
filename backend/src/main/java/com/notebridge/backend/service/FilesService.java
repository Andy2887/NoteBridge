package com.notebridge.backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.common.collect.Lists;
import com.notebridge.backend.entity.Lesson;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.repository.LessonsRepo;
import com.notebridge.backend.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FilesService {

    private Storage storage;
    private UsersRepo userRepository;
    private LessonsRepo lessonRepository;
    
    @Value("${firebase.storage-bucket}")
    private String bucketName;

    @Autowired
    public FilesService(UsersRepo userRepository, LessonsRepo lessonRepository) throws IOException {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;

        InputStream serviceAccount = getServiceAccountStream();

        GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount)
                .createScoped(Lists.newArrayList("https://www.googleapis.com/auth/cloud-platform"));

        this.storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
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




    @Transactional
    @CacheEvict(value = "users", key = "#userId")
    public String uploadProfilePicture(MultipartFile file, Long userId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty. Please upload a valid file.");
        }

        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        String uniqueID = UUID.randomUUID().toString();
        String objectName = "profile_pictures/" + uniqueID + "_" + file.getOriginalFilename();
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        try {
            // Upload to Firebase
            storage.create(blobInfo, file.getBytes());

            // Make the file publicly readable
            String url = makeFilePublicAndGetUrl(blobId, objectName);

            // Save url to MySQL User (field: profileUrl)
            user.setProfileUrl(url);
            userRepository.save(user);

            return url;
        } catch (Exception e) {
            cleanupAfterFailedUserUpload(uniqueID, blobId, e, user);
            throw e; // Re-throw the original exception
        }
    }

    @Transactional
    public String uploadLessonPicture(MultipartFile file, Long lessonId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty. Please upload a valid file.");
        }

        // Find the lesson
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));

        String uniqueID = UUID.randomUUID().toString();
        String objectName = "lesson_pictures/" + uniqueID + "_" + file.getOriginalFilename();
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        try {
            // Upload to Firebase
            storage.create(blobInfo, file.getBytes());

            // Make the file publicly readable
            String url = makeFilePublicAndGetUrl(blobId, objectName);

            // Save url to MySQL Lesson (field: imageUrl)
            lesson.setImageUrl(url);
            lessonRepository.save(lesson);

            return url;
        } catch (Exception e) {
            cleanupAfterFailedLessonUpload(uniqueID, blobId, e, lesson);
            throw e; // Re-throw the original exception
        }
    }

    private void cleanupAfterFailedUserUpload(String uniqueID, BlobId blobId, Exception e, User user) {
        System.err.println("User upload failed: " + e.getMessage() + "\ntrying to clean up db and firebase");
        try {
            // Delete from Firebase Storage
            storage.delete(blobId);
            
            // Reset user profile URL to null
            user.setProfileUrl(null);
            userRepository.save(user);
            
            System.out.println("Successfully cleaned up after failed user upload");

        } catch (Exception ex) {
            System.err.println("Failed to clean up resources after user upload failure: " + ex.getMessage());
        }
    }

    private void cleanupAfterFailedLessonUpload(String uniqueID, BlobId blobId, Exception e, Lesson lesson) {
        System.err.println("Lesson upload failed: " + e.getMessage() + "\ntrying to clean up db and firebase");
        try {
            // Delete from Firebase Storage
            storage.delete(blobId);
            
            // Reset lesson image URL to null
            lesson.setImageUrl(null);
            lessonRepository.save(lesson);
            
            System.out.println("Successfully cleaned up after failed lesson upload");

        } catch (Exception ex) {
            System.err.println("Failed to clean up resources after lesson upload failure: " + ex.getMessage());
        }
    }

    private String makeFilePublicAndGetUrl(BlobId blobId, String objectName) {
        // Make the file publicly readable
        Blob blob = storage.get(blobId);
        if (blob == null || !blob.exists()) {
            throw new IllegalArgumentException("File not found in storage after upload");
        }
        blob.createAcl(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER));

        // Generate and print public URL
        String url = String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
        System.out.println("Publicly available url: " + url);
        return url;
    }

    // public FilesReqRes retrieveFile(String fileId) {
    //     FilesReqRes response = new FilesReqRes();
        
    //     try {
    //         FileMetaData fileMetadata = repo.findByUniqueId(fileId);

    //         if (fileMetadata == null) {
    //             response.setStatusCode(404);
    //             response.setMessage("No file found with the given ID: " + fileId);
    //             return response;
    //         }

    //         String objectName = fileMetadata.getObjectName();
    //         BlobId blobId = BlobId.of(bucketName, objectName);
    //         Blob blob = storage.get(blobId);

    //         if (blob == null || !blob.exists()) {
    //             response.setStatusCode(404);
    //             response.setMessage("File not found in storage with ID: " + fileId);
    //             return response;
    //         }

    //         response.setFileName(objectName);
    //         response.setFileContent(blob.getContent());
    //         response.setStatusCode(200);
    //         response.setMessage("File retrieved successfully");
    //         return response;
    //     } catch (Exception e) {
    //         response.setStatusCode(500);
    //         response.setMessage("Internal Server Error");
    //         response.setError(e.getMessage());
    //         return response;
    //     }
    // }
}
