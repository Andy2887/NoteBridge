package com.notebridge.backend.controller;

import com.notebridge.backend.dto.FilesReqRes;
import com.notebridge.backend.service.FilesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
public class FilesController {

    @Autowired
    private FilesService fileStorageService;

    @PostMapping("/upload/profile_pic/{userId}")
    public ResponseEntity<FilesReqRes> uploadProfilePicture(
            @RequestParam MultipartFile file,
            @PathVariable Long userId) {
        try {
            if (!isValidImageFormat(file)) {
                return createFailureResponse(400, "Invalid file format", "Only JPEG, JPG, and PNG image formats are allowed");
            }
            String uniqueId = fileStorageService.uploadProfilePicture(file, userId);
            return createSuccessResponse(200, "Profile picture uploaded successfully", uniqueId);
        } catch (Exception e) {
            return createFailureResponse(500, "Internal Server Error", e.getMessage());
        }
    }

    @PostMapping("/upload/lesson_pic/{lessonId}")
    public ResponseEntity<FilesReqRes> uploadLessonPicture(
            @RequestParam MultipartFile file,
            @PathVariable Long lessonId) {
        try {
            if (!isValidImageFormat(file)) {
                return createFailureResponse(400, "Invalid file format", "Only JPEG, JPG, and PNG image formats are allowed");
            }
            String uniqueId = fileStorageService.uploadLessonPicture(file, lessonId);
            return createSuccessResponse(200, "Lesson picture uploaded successfully", uniqueId);
        } catch (Exception e) {
            return createFailureResponse(500, "Internal Server Error", e.getMessage());
        }
    }

    @GetMapping("/retrieve/{fileUniqueId}")
    public ResponseEntity<FilesReqRes> retrieveFile(@PathVariable String fileUniqueId) {
        return ResponseEntity.ok(fileStorageService.retrieveFile(fileUniqueId));
    }

    private ResponseEntity<FilesReqRes> createSuccessResponse(int statusCode, String message, String fileName) {
        FilesReqRes response = new FilesReqRes();
        response.setStatusCode(statusCode);
        response.setMessage(message);
        response.setFileName(fileName);
        return ResponseEntity.status(statusCode).body(response);
    }

    private ResponseEntity<FilesReqRes> createFailureResponse(int statusCode, String error, String message) {
        FilesReqRes response = new FilesReqRes();
        response.setStatusCode(statusCode);
        response.setError(error);
        response.setMessage(message);
        return ResponseEntity.status(statusCode).body(response);
    }

    private boolean isValidImageFormat(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
            contentType.equals("image/jpeg") ||
            contentType.equals("image/jpg") ||
            contentType.equals("image/png")
        );
    }
}
