package com.notebridge.backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.common.collect.Lists;
import com.notebridge.backend.dto.FilesReqRes;
import com.notebridge.backend.entity.FileMetaData;
import com.notebridge.backend.entity.Lesson;
import com.notebridge.backend.entity.User;
import com.notebridge.backend.repository.FilesRepo;
import com.notebridge.backend.repository.LessonsRepo;
import com.notebridge.backend.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FilesService {

    private Storage storage;
    private FilesRepo repo;
    private UsersRepo userRepository;
    private LessonsRepo lessonRepository;
    
    @Value("${firebase.storage-bucket}")
    private String bucketName;

    @Autowired
    public FilesService(FilesRepo repo, UsersRepo userRepository,
                              LessonsRepo lessonRepository) throws IOException {
        this.repo = repo;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;

        ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
        InputStream serviceAccount = resource.getInputStream();

        GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount)
                .createScoped(Lists.newArrayList("https://www.googleapis.com/auth/cloud-platform"));

        this.storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty. Please upload a valid file.");
        }

        String uniqueID = UUID.randomUUID().toString();
        String objectName = uniqueID + "_" + file.getOriginalFilename();
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        try {
            // Upload to Firebase
            storage.create(blobInfo, file.getBytes());

            // Save metadata to MySQL
            FileMetaData metaData = new FileMetaData();
            metaData.setUniqueId(uniqueID);
            metaData.setObjectName(objectName);
            metaData.setUploadDate(LocalDateTime.now());
            repo.save(metaData);

            return uniqueID;
        } catch (Exception e) {
            System.err.println("Data saved failed: " + e.getMessage() +"\ntrying to clean up db and firebase");
            try {
                storage.delete(blobId);
                int deleted = repo.deleteByUniqueId(uniqueID);
                if (deleted == 0) {
                    System.err.println("Warning: No records were deleted from the database for uniqueId: " + uniqueID);
                } else {
                    System.out.println("Successfully deleted " + deleted + " record(s) from database");
                }
            } catch (Exception ex) {
                System.err.println("Failed to clean up resources after upload failure: " + ex.getMessage());
            }
            throw e; // Re-throw the original exception
        }
    }
    @Transactional
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
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        try {
            // Upload to Firebase
            storage.create(blobInfo, file.getBytes());

            // Save metadata to MySQL with user association
            FileMetaData metaData = new FileMetaData();
            metaData.setUniqueId(uniqueID);
            metaData.setObjectName(objectName);
            metaData.setUploadDate(LocalDateTime.now());
            metaData.setUser(user);
            repo.save(metaData);

            return uniqueID;
        } catch (Exception e) {
            cleanupAfterFailedUpload(uniqueID, blobId, e);
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
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        try {
            // Upload to Firebase
            storage.create(blobInfo, file.getBytes());

            // Save metadata to MySQL with lesson association
            FileMetaData metaData = new FileMetaData();
            metaData.setUniqueId(uniqueID);
            metaData.setObjectName(objectName);
            metaData.setUploadDate(LocalDateTime.now());
            metaData.setLesson(lesson);
            repo.save(metaData);

            return uniqueID;
        } catch (Exception e) {
            cleanupAfterFailedUpload(uniqueID, blobId, e);
            throw e; // Re-throw the original exception
        }
    }

    private void cleanupAfterFailedUpload(String uniqueID, BlobId blobId, Exception e) {
        System.err.println("Data saved failed: " + e.getMessage() + "\ntrying to clean up db and firebase");
        try {
            storage.delete(blobId);
            int deleted = repo.deleteByUniqueId(uniqueID);
            if (deleted == 0) {
                System.err.println("Warning: No records were deleted from the database for uniqueId: " + uniqueID);
            } else {
                System.out.println("Successfully deleted " + deleted + " record(s) from database");
            }
        } catch (Exception ex) {
            System.err.println("Failed to clean up resources after upload failure: " + ex.getMessage());
        }
    }

    public FilesReqRes retrieveFile(String fileId) {
        FilesReqRes response = new FilesReqRes();
        
        try {
            FileMetaData fileMetadata = repo.findByUniqueId(fileId);

            if (fileMetadata == null) {
                response.setStatusCode(404);
                response.setMessage("No file found with the given ID: " + fileId);
                return response;
            }

            String objectName = fileMetadata.getObjectName();
            BlobId blobId = BlobId.of(bucketName, objectName);
            Blob blob = storage.get(blobId);

            if (blob == null || !blob.exists()) {
                response.setStatusCode(404);
                response.setMessage("File not found in storage with ID: " + fileId);
                return response;
            }

            response.setFileName(objectName);
            response.setFileContent(blob.getContent());
            response.setStatusCode(200);
            response.setMessage("File retrieved successfully");
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
            response.setError(e.getMessage());
            return response;
        }
    }
}
