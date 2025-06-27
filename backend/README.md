# NoteBridge Backend API Documentation

## Overview
This document provides comprehensive API documentation for the NoteBridge backend service. The API supports authentication, user management, lesson management, file uploads, and chat functionality.

## Authentication
If document says "Auth Required", include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
- **Path:** `POST /auth/register`
- **Content-Type:** `application/json`
- **Auth Required:** No
- **Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT", // or "TEACHER" or "ADMIN"
  "firstName": "John", // optional
  "lastName": "Doe", // optional
  "bio": "Description about the user", // optional
  "phoneNumber": "+1234567890" // optional
}
```

### Login
- **Path:** `POST /auth/login`
- **Content-Type:** `application/json`
- **Auth Required:** No
- **Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
- **Path:** `POST /auth/refresh`
- **Content-Type:** `application/json`
- **Auth Required:** No
- **Description:** Refresh JWT token

**Request Body:**
```json
{
  "token": "your-refresh-token"
}
```

---

## 👤 User Management Endpoints

### Get User Profile
- **Path:** `GET /user/get-profile`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get current user's profile information

### Update User Profile
- **Path:** `PUT /user/update/{userId}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Update user profile information

**Request Body:**
```json
{
  "firstName": "Updated Name", // optional
  "lastName": "Updated Surname", // optional
  "instrument": "Guitar", // optional
  "bio": "Updated bio", // optional
  "phoneNumber": "+9876543210" // optional
}
```

### Delete User
- **Path:** `DELETE /user/deleteUser/{userId}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Delete user account

---

## 👑 Admin Endpoints

### Get All Users
- **Path:** `GET /admin/get-all-users`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Get list of all users (Admin only)

### Get User by ID
- **Path:** `GET /admin/get-user/{userId}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Get specific user by ID (Admin only)

---

## 📚 Lesson Management Endpoints

### Get All Lessons
- **Path:** `GET /lesson`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get all active lessons (non-cancelled)

### Get Lesson by ID
- **Path:** `GET /lesson/{lesson_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get specific lesson by ID

### Get Lessons by Teacher
- **Path:** `GET /lesson/teacher/{teacher_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get all lessons for a specific teacher

### Create Lesson (Teacher)
- **Path:** `POST /lesson/create/{teacher_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Teacher JWT Token)
- **Description:** Create a new lesson

**Request Body:**
```json
{
  "title": "Piano Fundamentals",
  "instrument": "Piano",
  "description": "Piano lesson for beginners",
  "location": "ONLINE", // or "IN_PERSON" or "HYBRID"
  "startTime": "2024-02-01T10:00:00",
  "endTime": "2024-02-01T11:00:00",
  "startDate": "2024-02-01T00:00:00",
  "endDate": "2024-02-01T23:59:59",
  "meetingLink": "https://zoom.us/j/123456789", // optional
  "physicalAddress": "123 Main St, City, State" // optional
}
```

### Update Lesson (Teacher)
- **Path:** `PUT /lesson/update/{lesson_id}/{teacher_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Teacher JWT Token)
- **Description:** Update lesson (only by lesson owner)

**Request Body:**
```json
{
  "description": "Updated lesson description", // optional
  "location": "IN_PERSON", // optional
  "startTime": "2024-02-01T14:00:00", // optional
  "endTime": "2024-02-01T15:00:00", // optional
  "startDate": "2024-02-01T00:00:00", // optional
  "endDate": "2024-02-01T23:59:59", // optional
  "meetingLink": "https://zoom.us/j/987654321", // optional
  "physicalAddress": "456 Updated St, City, State" // optional
}
```

### Cancel Lesson (Teacher)
- **Path:** `PUT /lesson/cancel/{lesson_id}/{teacher_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Teacher JWT Token)
- **Description:** Cancel lesson (only by lesson owner)

### Reactivate Lesson (Teacher)
- **Path:** `PUT /lesson/reactivate/{lesson_id}/{teacher_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Teacher JWT Token)
- **Description:** Reactivate cancelled lesson (only by lesson owner)

---

## 👑 Admin Lesson Management

### Create Lesson (Admin)
- **Path:** `POST /admin/lesson/create`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Create lesson for any teacher (Admin only)

**Request Body:**
```json
{
  "teacher": {
    "id": 1
  },
  "description": "Admin created lesson",
  "location": "ONLINE",
  "startTime": "2024-02-01T10:00:00",
  "endTime": "2024-02-01T11:00:00",
  "startDate": "2024-02-01T00:00:00",
  "endDate": "2024-02-01T23:59:59",
  "meetingLink": "https://zoom.us/j/123456789", // optional
  "physicalAddress": "123 Main St, City, State" // optional
}
```

### Update Lesson (Admin)
- **Path:** `PUT /admin/lesson/update/{lesson_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Update any lesson (Admin only)

### Cancel Lesson (Admin)
- **Path:** `PUT /admin/lesson/cancel/{lesson_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Cancel any lesson (Admin only)

### Reactivate Lesson (Admin)
- **Path:** `PUT /admin/lesson/reactivate/{lesson_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Reactivate any lesson (Admin only)

### Get All Lessons Including Cancelled (Admin)
- **Path:** `GET /admin/lesson/all`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Get all lessons including cancelled ones (Admin only)

### Delete Lesson Permanently (Admin)
- **Path:** `DELETE /admin/lesson/delete/{lesson_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (Admin JWT Token)
- **Description:** Permanently delete lesson (Admin only)

---

## 📁 File Management Endpoints

### Upload Profile Picture
- **Path:** `POST /file/upload/profile_pic/{userId}`
- **Content-Type:** `multipart/form-data`
- **Auth Required:** Yes (JWT Token)
- **Description:** Upload user profile picture

**Request Body:**
```
Form Data:
file: [image file] (JPEG, JPG, PNG only)
```

### Upload Lesson Picture
- **Path:** `POST /file/upload/lesson_pic/{lessonId}`
- **Content-Type:** `multipart/form-data`
- **Auth Required:** Yes (JWT Token)
- **Description:** Upload lesson image

**Request Body:**
```
Form Data:
file: [image file] (JPEG, JPG, PNG only)
```

### Retrieve File
- **Path:** `GET /file/retrieve/{fileUniqueId}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Retrieve uploaded file by unique ID

---

## 💬 Chat Management Endpoints

### Create or Get Chat
- **Path:** `POST /chat/create/{teacher_id}/{student_id}?subject=...`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Create new chat or get existing chat between teacher and student

### Create or Get Chat (Request Body)
- **Path:** `POST /chat/create`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Create new chat using request body

**Request Body:**
```json
{
  "teacher": {
    "id": 1
  },
  "student": {
    "id": 2
  },
  "subject": "Piano Lessons" // optional
}
```

### Get User's Chats
- **Path:** `GET /chat/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get all chats for current user

### Get Chat by ID
- **Path:** `GET /chat/{chat_id}/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get specific chat by ID

### Update Chat Subject
- **Path:** `PUT /chat/{chat_id}/subject/{user_id}?subject=...`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Update chat subject using query parameter

### Update Chat Subject (Request Body)
- **Path:** `PUT /chat/{chat_id}/subject/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Update chat subject using request body

**Request Body:**
```json
{
  "subject": "Updated Subject"
}
```

---

## 📤 Message Management Endpoints

### Send Message
- **Path:** `POST /message/send/user/{sender_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Send message to chat

**Request Body:**
```json
{
  "chatId": 1,
  "content": "Hello, when is our next lesson?"
}
```

### Get Chat Messages (Paginated)
- **Path:** `GET /message/chat/{chat_id}/user/{user_id}?page=0&size=20`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get chat messages with pagination

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

### Get Recent Messages
- **Path:** `GET /message/chat/{chat_id}/recent/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get recent messages (last 50)

### Mark Messages as Read
- **Path:** `PUT /message/chat/{chat_id}/mark-read/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Mark all unread messages as read

### Get Unread Message Count (Chat)
- **Path:** `GET /message/chat/{chat_id}/unread-count/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get unread message count for specific chat

### Get Total Unread Message Count
- **Path:** `GET /message/unread-count/user/{user_id}`
- **Content-Type:** `application/json`
- **Auth Required:** Yes (JWT Token)
- **Description:** Get total unread message count across all chats

---

## 🔍 Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

*Last Updated: December 2024*
