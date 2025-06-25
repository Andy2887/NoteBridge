# NoteBridge

A comprehensive note-taking and lesson management application built with Spring Boot backend and modern web technologies.

## Features

- **User Authentication & Authorization**: Role-based security system with JWT tokens
- **File Management**: Upload and manage profile pictures and lesson images with Firebase Storage
- **Lesson Management**: Create and organize educational content
- **Chat System**: Interactive messaging functionality
- **Database Integration**: MySQL database with JPA/Hibernate

## Technology Stack

### Backend
- **Spring Boot**: Main application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database operations
- **MySQL**: Primary database
- **Firebase Storage**: File storage solution
- **JWT**: Token-based authentication

### Key Components
- User management with role-based access control
- File upload system with organized storage (profile_pictures/, lesson_pictures/)
- RESTful API endpoints
- Database entities for Users, Lessons, Messages, Chats, and File metadata

## Project Structure

```
backend/
├── src/main/java/com/notebridge/backend/
│   ├── config/          # Configuration classes (CORS, Firebase, JWT, Security)
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── repository/     # Data repositories
│   └── service/        # Business logic services
└── src/main/resources/
    ├── application.properties
    └── serviceAccountKey.json  # Firebase service account key
```

## Getting Started

### Prerequisites
- Java 17 or higher
- MySQL database
- Firebase project with Storage enabled
- Maven

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NoteBridge
   ```

2. **Configure Database**
   - Create a MySQL database
   - Update `application.properties` with your database credentials

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Firebase Storage
   - Download the service account key and place it as `serviceAccountKey.json` in `src/main/resources/`
   - Update the storage bucket name in `application.properties`

4. **Run the application**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### File Management
- `POST /files/upload` - General file upload
- `POST /files/upload-profile-picture/{userId}` - Upload profile picture
- `POST /files/upload-lesson-picture/{lessonId}` - Upload lesson picture
- `GET /files/{fileId}` - Retrieve file

## References

This project was built using knowledge from the following tutorials:

1. **Firebase Storage Integration**: [Spring Boot meets Firebase: My Journey of Building a File Upload System](https://dev.to/priya01/spring-boot-meets-firebase-my-journey-of-building-a-file-upload-system-4m3i)
   - Comprehensive guide on integrating Firebase Storage with Spring Boot
   - File upload and retrieval implementation
   - Error handling and cleanup strategies

2. **Spring Security Implementation**: [Spring Security React Project](https://medium.com/@kalanamalshan98/list/spring-security-react-project-3f3969e2181e)
   - Role-based authentication and authorization
   - JWT token implementation
   - Security configuration best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
