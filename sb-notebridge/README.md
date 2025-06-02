# NoteBridge

## Overview
NoteBridge is a comprehensive platform for managing music lessons, enabling communication between teachers and students, and file storage. This Spring Boot application provides a REST API for frontend applications to interact with.

## API Documentation

### Base URL
All API endpoints are prefixed with: `http://localhost:8080/api`

### Authentication
The application uses Spring Security for authentication. Most endpoints require authentication via session-based login.

---

## User Management API

### 1. Get All Users
- **URL**: `GET /api/users`
- **Description**: Retrieve all users
- **Authentication**: Required
- **Request**: No body required
- **Response**: 
  ```json
  [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "instrument": "Piano",
      "bio": "Passionate about classical piano"
    }
  ]
  ```

### 2. Get User by ID
- **URL**: `GET /api/users/{id}`
- **Description**: Retrieve a specific user by ID
- **Authentication**: Required
- **Path Parameters**: `id` (Long) - User ID
- **Response**: User object or 404 Not Found

### 3. Create User
- **URL**: `POST /api/users`
- **Description**: Create a new user
- **Authentication**: Not required (for registration)
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "securepassword123",
    "email": "john@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "instrument": "Piano",
    "bio": "Passionate about classical piano"
  }
  ```
- **Response**: 
  - Success (201): `"User created successfully with ID: 1"`
  - Error (400): `"Username already exists"` or `"Email already exists"`

### 4. Register User
- **URL**: `POST /api/users/register`
- **Description**: Alternative registration endpoint (same as create user)
- **Authentication**: Not required
- **Request/Response**: Same as Create User

---

## Lesson Management API

### 1. Get All Active Lessons
- **URL**: `GET /api/lessons`
- **Description**: Get all non-cancelled lessons
- **Authentication**: Required
- **Response**:
  ```json
  [
    {
      "id": 1,
      "teacher": {
        "id": 2,
        "username": "teacher_jane",
        "role": "TEACHER"
      },
      "description": "Beginner Piano Lesson",
      "location": "ONLINE",
      "startTime": "2025-05-26T10:00:00",
      "endTime": "2025-05-26T11:00:00",
      "meetingLink": "https://zoom.us/j/123456789",
      "physicalAddress": null,
      "cancelled": false
    }
  ]
  ```

### 2. Get Lesson by ID
- **URL**: `GET /api/lessons/{id}`
- **Description**: Get a specific lesson by ID
- **Authentication**: Required
- **Path Parameters**: `id` (Long) - Lesson ID
- **Response**: Lesson object or 404 Not Found

### 3. Get Lessons by Teacher
- **URL**: `GET /api/lessons/teacher/{teacherId}`
- **Description**: Get all lessons for a specific teacher
- **Authentication**: Required
- **Path Parameters**: `teacherId` (Long) - Teacher's user ID
- **Response**: Array of lesson objects

### 4. Get Upcoming Lessons
- **URL**: `GET /api/lessons/upcoming`
- **Description**: Get all lessons starting after current time
- **Authentication**: Required
- **Response**: Array of lesson objects

### 5. Create Lesson
- **URL**: `POST /api/lessons`
- **Description**: Create a new lesson
- **Authentication**: Required (TEACHER or ADMIN roles)
- **Request Body**:
  ```json
  {
    "description": "Advanced Piano Techniques",
    "location": "ONLINE",
    "startTime": "2025-05-26T14:00:00",
    "endTime": "2025-05-26T15:00:00",
    "meetingLink": "https://zoom.us/j/987654321",
    "teacher": {
      "id": 2
    }
  }
  ```
- **Response**: 
  - Success (201): `"Lesson created successfully with ID: 1"`
  - Error (400): Various validation errors

### 6. Update Lesson
- **URL**: `PUT /api/lessons/{id}`
- **Description**: Update an existing lesson
- **Authentication**: Required (Lesson owner or ADMIN)
- **Path Parameters**: `id` (Long) - Lesson ID
- **Request Body**: Partial lesson object with fields to update
- **Response**: `"Lesson updated successfully"`

### 7. Cancel Lesson
- **URL**: `PUT /api/lessons/{id}/cancel`
- **Description**: Cancel a lesson (soft delete)
- **Authentication**: Required (Lesson owner or ADMIN)
- **Path Parameters**: `id` (Long) - Lesson ID
- **Response**: `"Lesson cancelled successfully"`

### 8. Reactivate Lesson
- **URL**: `PUT /api/lessons/{id}/reactivate`
- **Description**: Reactivate a cancelled lesson
- **Authentication**: Required (Lesson owner or ADMIN)
- **Path Parameters**: `id` (Long) - Lesson ID
- **Response**: `"Lesson reactivated successfully"`

### 9. Get My Lessons
- **URL**: `GET /api/lessons/my-lessons`
- **Description**: Get current user's lessons (teachers see their own, admins see all)
- **Authentication**: Required (TEACHER or ADMIN roles)
- **Response**: Array of lesson objects

### 10. Get All Lessons (Admin Only)
- **URL**: `GET /api/lessons/admin/all`
- **Description**: Get all lessons including cancelled ones
- **Authentication**: Required (ADMIN role only)
- **Response**: Array of lesson objects

### 11. Delete Lesson Permanently
- **URL**: `DELETE /api/lessons/{id}`
- **Description**: Permanently delete a lesson
- **Authentication**: Required (ADMIN role only)
- **Path Parameters**: `id` (Long) - Lesson ID
- **Response**: `"Lesson deleted permanently"`

---

## Chat Management API

### 1. Create or Get Chat
- **URL**: `POST /api/chats`
- **Description**: Create a new chat or get existing chat between teacher and student
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "teacherId": 2,
    "studentId": 1,
    "subject": "Piano Lesson Questions"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "teacher": {
      "id": 2,
      "username": "teacher_jane"
    },
    "student": {
      "id": 1,
      "username": "john_doe"
    },
    "subject": "Piano Lesson Questions",
    "createdAt": "2025-05-25T09:00:00",
    "lastMessageAt": "2025-05-25T09:00:00",
    "active": true
  }
  ```

### 2. Get My Chats
- **URL**: `GET /api/chats`
- **Description**: Get all chats for the current user
- **Authentication**: Required
- **Response**: Array of chat objects

### 3. Send Message
- **URL**: `POST /api/chats/{chatId}/messages`
- **Description**: Send a message to a chat
- **Authentication**: Required
- **Path Parameters**: `chatId` (Long) - Chat ID
- **Request Body**:
  ```json
  {
    "content": "When is our next lesson scheduled?"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "chat": {
      "id": 1
    },
    "sender": {
      "id": 1,
      "username": "john_doe"
    },
    "content": "When is our next lesson scheduled?",
    "sentAt": "2025-05-25T10:30:00",
    "read": false
  }
  ```

### 4. Get Chat Messages
- **URL**: `GET /api/chats/{chatId}/messages`
- **Description**: Get paginated messages for a chat
- **Authentication**: Required
- **Path Parameters**: `chatId` (Long) - Chat ID
- **Query Parameters**: 
  - `page` (int, default: 0) - Page number
  - `size` (int, default: 20) - Page size
- **Response**: Paginated message objects

### 5. Mark Messages as Read
- **URL**: `PUT /api/chats/{chatId}/read`
- **Description**: Mark all messages in a chat as read for current user
- **Authentication**: Required
- **Path Parameters**: `chatId` (Long) - Chat ID
- **Response**: `"Messages marked as read"`

### 6. Get Unread Message Count
- **URL**: `GET /api/chats/unread-count`
- **Description**: Get total unread message count for current user
- **Authentication**: Required
- **Response**:
  ```json
  {
    "unreadCount": 5
  }
  ```

---

## File Storage API

### 1. Upload Profile Picture
- **URL**: `POST /api/files/upload/profile/{userId}`
- **Description**: Upload a profile picture for a user
- **Authentication**: Required
- **Path Parameters**: `userId` (Long) - User ID
- **Request**: Multipart form data with `file` parameter
- **Content-Type**: `multipart/form-data`
- **Response**: File ID string

### 2. Upload Lesson Picture
- **URL**: `POST /api/files/upload/lesson_pic/{lessonId}`
- **Description**: Upload a picture for a lesson
- **Authentication**: Required
- **Path Parameters**: `lessonId` (Long) - Lesson ID
- **Request**: Multipart form data with `file` parameter
- **Content-Type**: `multipart/form-data`
- **Response**: File ID string

### 3. Retrieve File
- **URL**: `GET /api/files/retrieve/{fileId}`
- **Description**: Retrieve a file by its ID
- **Authentication**: Required
- **Path Parameters**: `fileId` (String) - File ID
- **Response**:
  ```json
  {
    "fileName": "profile.jpg",
    "fileContent": "base64_encoded_file_content"
  }
  ```

---

## Data Models

### User Roles
- `STUDENT`: Basic user who can view lessons and participate in chats
- `TEACHER`: Can create/manage lessons, participate in chats
- `ADMIN`: Full access to all resources

### Location Types (for Lessons)
- `ONLINE`: Virtual lesson with meeting link
- `IN_PERSON`: Physical lesson with address
- `HYBRID`: Combination of online and in-person

### Error Responses
Most endpoints return error messages in the following format:
- **400 Bad Request**: `"Error message describing what went wrong"`
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: `"You don't have permission to access this resource"`
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: `"Error message describing server error"`

---

## Frontend Development Notes

1. **Authentication**: Implement session-based authentication with login/logout functionality
2. **Role-based UI**: Show/hide features based on user roles
3. **Real-time Updates**: Consider implementing WebSocket for real-time chat functionality
4. **File Upload**: Use FormData for file uploads with proper progress indicators
5. **Error Handling**: Implement comprehensive error handling for all API responses
6. **Pagination**: Handle paginated responses for chat messages
7. **Date/Time**: All timestamps are in ISO 8601 format (LocalDateTime)
