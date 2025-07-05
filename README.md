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
- **Redis**: In-memory caching for improved performance
- **Firebase Storage**: File storage solution
- **JWT**: Token-based authentication

### Key Components
- User management with role-based access control
- File upload system with organized storage (profile_pictures/, lesson_pictures/)
- RESTful API endpoints
- Database entities for Users, Lessons, Messages, Chats, and File metadata
- Redis caching implementation for optimized data retrieval

## Project Structure

```
NoteBridge/
├── backend/                 # Spring Boot backend application
│   ├── src/main/java/com/notebridge/backend/
│   │   ├── config/          # Configuration classes (CORS, Firebase, JWT, Security, Redis)
│   │   ├── controller/      # REST controllers for API endpoints
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities (User, Lesson, Message, Chat, etc.)
│   │   ├── repository/     # Data repositories with Redis caching
│   │   └── service/        # Business logic services
│   ├── src/main/resources/
│   │   ├── application.properties    # Configuration properties
│   │   └── serviceAccountKey.json   # Firebase service account key (excluded from git)
│   ├── Dockerfile          # Docker configuration for deployment
│   ├── pom.xml            # Maven dependencies and build configuration
│   └── .env               # Environment variables (excluded from git)
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── service/       # API service functions
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Java 17 or higher
- MySQL database
- Redis server (version 6.0+ recommended)
- Firebase project with Storage enabled
- Maven

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NoteBridge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the backend directory
   - Add the following environment variables:
     ```properties
     # JWT Configuration
     JWT_SECRET=your-jwt-secret-key
     
     # Database Configuration
     DB_URL=jdbc:mysql://localhost:3306/notebridge?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
     DB_USERNAME=your-db-username
     DB_PASSWORD=your-db-password
     
     # Firebase Configuration
     FIREBASE_PROJECT_ID=your-firebase-project-id
     FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     
     # Redis Configuration
     REDIS_URL=redis://localhost:6379
     ```

4. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firebase Storage
   - Go to Project Settings → Service Accounts
   - Generate a new private key and download the JSON file
   - Place the JSON file as `serviceAccountKey.json` in `backend/src/main/resources/`
   - **Important**: This file is excluded from git for security

5. **Setup Database**
   - Install MySQL locally or use a cloud provider
   - Create a database named `notebridge` (or update DB_URL accordingly)
   - The application will automatically create tables on startup

6. **Setup Redis**
   - **Local Development**: Install Redis locally and start the server
     ```bash
     # macOS with Homebrew
     brew install redis
     redis-server
     
     # Ubuntu
     sudo apt-get install redis-server
     redis-server
     ```
   - **Production**: Use Redis Cloud or another cloud Redis provider
   - Update the `REDIS_URL` in your `.env` file

7. **Install Dependencies and Run Backend**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

8. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

### Deployment

**Backend (Render)**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Add Firebase service account key as a Secret File at `/etc/secrets/serviceAccountKey.json`
5. Deploy using the included Dockerfile

**Frontend (Vercel/Netlify)**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

## API Endpoints

For detailed explanation, please see `backend/README.md`.

### Authentication
- `POST /auth/register` - Register new user account
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### User Management
- `GET /user/get-profile` - Get current user profile
- `PUT /user/update/{userId}` - Update user profile
- `DELETE /user/deleteUser/{userId}` - Delete user account

### Admin Endpoints
- `GET /admin/get-all-users` - Get all users (Admin only)
- `GET /admin/get-user/{userId}` - Get user by ID (Admin only)

### Lesson Management
- `GET /lesson` - Get all active lessons
- `GET /lesson/{lesson_id}` - Get lesson by ID
- `GET /lesson/teacher/{teacher_id}` - Get lessons by teacher
- `POST /lesson/create/{teacher_id}` - Create new lesson
- `PUT /lesson/update/{lesson_id}/{teacher_id}` - Update lesson
- `PUT /lesson/cancel/{lesson_id}/{teacher_id}` - Cancel lesson
- `PUT /lesson/reactivate/{lesson_id}/{teacher_id}` - Reactivate lesson

### Admin Lesson Management
- `POST /admin/lesson/create` - Create lesson for any teacher
- `PUT /admin/lesson/update/{lesson_id}` - Update any lesson
- `PUT /admin/lesson/cancel/{lesson_id}` - Cancel any lesson
- `PUT /admin/lesson/reactivate/{lesson_id}` - Reactivate any lesson
- `GET /admin/lesson/all` - Get all lessons including cancelled
- `DELETE /admin/lesson/delete/{lesson_id}` - Delete lesson permanently

### File Management
- `POST /file/upload/profile_pic/{userId}` - Upload profile picture
- `POST /file/upload/lesson_pic/{lessonId}` - Upload lesson picture
- `GET /file/retrieve/{fileUniqueId}` - Retrieve uploaded file

### Chat Management
- `POST /chat/create/{teacher_id}/{student_id}` - Create or get chat
- `POST /chat/create` - Create or get chat (request body)
- `GET /chat/user/{user_id}` - Get user's chats
- `GET /chat/{chat_id}/user/{user_id}` - Get chat by ID
- `PUT /chat/{chat_id}/subject/{user_id}` - Update chat subject
- `PUT /chat/{chat_id}/subject/user/{user_id}` - Update chat subject (request body)

### Message Management
- `POST /message/send/user/{sender_id}` - Send message to chat
- `GET /message/chat/{chat_id}/user/{user_id}` - Get chat messages (paginated)
- `GET /message/chat/{chat_id}/recent/user/{user_id}` - Get recent messages
- `PUT /message/chat/{chat_id}/mark-read/user/{user_id}` - Mark messages as read
- `GET /message/chat/{chat_id}/unread-count/user/{user_id}` - Get unread count for chat
- `GET /message/unread-count/user/{user_id}` - Get total unread count

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

3. **Spring Boot Caching with Redis**: [Optimizing Spring Boot Applications with Redis Caching](https://medium.com/@tharindudulshanfdo/optimizing-spring-boot-applications-with-redis-caching-35eabadae012)
   - Implementation of Redis caching in Spring Boot
   - Cache annotations and configuration
   - Performance optimization strategies

4. **Deployment Guide**: [Free Hosting Bliss: Deploying Your Spring Boot App on Render](https://medium.com/spring-boot/free-hosting-bliss-deploying-your-spring-boot-app-on-render-d0ebd9713b9d)
   - Tutorial for deploying Spring Boot applications on Render
   - Free hosting solution for Spring Boot apps
   - Deployment configuration and setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
