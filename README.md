# NoteBridge 🌉🎵

> **Status: 🚧 Work in Progress** - This project is currently under active development

A specialized platform for Northwestern University music students to advertise music lessons and connect with peers who want to learn. Whether you're a talented violinist looking to teach or a beginner seeking piano lessons, NoteBridge helps Northwestern's music community come together.

## 📖 Overview

NoteBridge is a full-stack web application designed specifically for Northwestern University's music students. The platform enables experienced musicians to advertise their teaching services while helping fellow students find the perfect instructor for their musical journey. Features include lesson advertising, peer-to-peer messaging, scheduling, and a secure environment tailored to the Northwestern community.

## 🏗️ Architecture

### Frontend
- **Framework**: Vite + React 19 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Features**: 
  - Modern, responsive design optimized for mobile and desktop
  - Music lesson browsing and search functionality
  - Real-time messaging between students and instructors
  - User profiles showcasing musical experience and instruments
  - Lesson posting and management for instructors
  - Northwestern University student authentication

### Backend
- **Framework**: Spring Boot 3.4.5
- **Language**: Java 21
- **Database**: MySQL with JPA/Hibernate
- **Caching**: Redis for improved performance
- **File Storage**: Firebase Storage for profile photos and lesson materials
- **Features**:
  - RESTful API endpoints for lesson management
  - Northwestern student verification system
  - Secure peer-to-peer messaging
  - Lesson scheduling and booking system
  - Instructor rating and review system
  - Payment processing integration (planned)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Java** 21
- **Maven** 3.6+
- **MySQL** 8.0+
- **Redis** 6.0+
- **Firebase** account (for file storage)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NoteBridge
   ```

2. **Backend Configuration**
   
   Create environment variables for the Spring Boot application:
   ```bash
   # Database
   export DB_USERNAME=your_mysql_username
   export DB_PASSWORD=your_mysql_password
   
   # Redis
   export REDIS_HOST=localhost
   export REDIS_PORT=6379
   
   # Firebase
   export FIREBASE_PROJECT_ID=your-firebase-project-id
   export FIREBASE_STORAGE_BUCKET=your-firebase-bucket-name
   ```

3. **Firebase Setup**
   - Create a Firebase project
   - Generate a service account key
   - Place the JSON file as `serviceAccountKey.json` in `sb-notebridge/src/main/resources/`

### Running the Application

#### Backend (Spring Boot)
```bash
cd sb-notebridge
./mvnw spring-boot:run
```
The backend will be available at `http://localhost:8080`

#### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

#### Using Docker (Alternative)
```bash
cd sb-notebridge
docker-compose up
```

## 📁 Project Structure

```
NoteBridge/
├── frontend/                 # Vite + React frontend application
│   ├── src/                 # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── stores/         # State management
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Vite entry point
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies and scripts
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── index.html          # HTML entry point
├── sb-notebridge/          # Spring Boot backend
│   ├── src/main/java/com/notebridge/project/
│   │   ├── controller/     # REST API endpoints
│   │   ├── model/         # Data models/entities
│   │   ├── repository/    # Data access layer
│   │   ├── service/       # Business logic
│   │   └── config/        # Configuration classes
│   └── src/main/resources/ # Application properties & static files
└── README.md
```

## 🔧 API Endpoints

### User Management
- `POST /api/users/register` - Northwestern student registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile (instruments, experience, etc.)
- `GET /api/users/{id}/reviews` - Get instructor reviews and ratings

### Lessons
- `GET /api/lessons` - Browse available music lessons
- `POST /api/lessons` - Create new lesson advertisement
- `GET /api/lessons/{id}` - Get detailed lesson information
- `PUT /api/lessons/{id}` - Update lesson details (instructor only)
- `DELETE /api/lessons/{id}` - Remove lesson advertisement
- `GET /api/lessons/search` - Search lessons by instrument, price, location
- `POST /api/lessons/{id}/book` - Book a lesson with an instructor

### Chat & Messaging
- `GET /api/chats` - Get user conversations
- `POST /api/chats` - Start conversation with instructor/student
- `POST /api/chats/{id}/messages` - Send message
- `GET /api/chats/{id}/messages` - Get conversation history

### File Storage
- `POST /api/files/upload` - Upload profile photos, lesson materials
- `GET /api/files/{id}` - Download/view uploaded files
- `DELETE /api/files/{id}` - Remove uploaded files

### Reviews & Ratings
- `POST /api/reviews` - Leave review for instructor
- `GET /api/reviews/instructor/{id}` - Get instructor reviews
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

## 🎼 Key Use Cases

### For Music Students (Instructors)
- **Advertise Your Skills**: Create detailed lesson listings showcasing your musical expertise
- **Set Your Rates**: Flexible pricing options for different lesson types and durations
- **Manage Your Schedule**: Control your availability and lesson bookings
- **Build Your Reputation**: Receive reviews and ratings from satisfied students
- **Earn Income**: Monetize your musical talents while helping fellow Wildcats

### For Learning Students
- **Find Perfect Instructors**: Browse lessons by instrument, experience level, and price
- **Connect Safely**: Northwestern-verified student community ensures security
- **Flexible Learning**: Choose from various lesson formats and scheduling options
- **Read Reviews**: Make informed decisions based on instructor ratings and feedback
- **Stay on Campus**: Many lessons available on or near Northwestern campus

## 🎵 Supported Instruments & Specialties

The platform supports instruction for all musical instruments and specialties, including:
- **Strings**: Violin, Viola, Cello, Double Bass, Guitar, Bass Guitar
- **Woodwinds**: Flute, Clarinet, Oboe, Bassoon, Saxophone
- **Brass**: Trumpet, Horn, Trombone, Tuba
- **Percussion**: Drums, Timpani, Mallet Instruments
- **Keyboard**: Piano, Organ, Harpsichord
- **Voice**: Classical, Jazz, Musical Theater, Contemporary
- **Specialized**: Music Theory, Composition, Music Production, Conducting

## 🏫 Northwestern University Integration

- **Student Verification**: Registration limited to Northwestern email addresses (@u.northwestern.edu)
- **Campus-Friendly**: Location tags for on-campus practice rooms and nearby venues
- **Academic Calendar**: Integration with Northwestern's academic schedule
- **Community Focus**: Built specifically for the Northwestern music community

### Current Features
- ✅ Northwestern student registration and authentication
- ✅ Modern, responsive UI optimized for music lesson browsing
- ✅ RESTful API with Spring Boot backend
- ✅ MySQL database for storing user profiles and lesson data
- ✅ Redis caching for improved performance
- ✅ Firebase file storage for photos and materials
- ✅ Basic lesson advertisement system
- ✅ Peer-to-peer messaging foundation

### Planned Features
- 🔄 Advanced lesson search and filtering (by instrument, price, location, availability)
- 🔄 Northwestern student verification via university email
- 🔄 Instructor rating and review system
- 🔄 Lesson scheduling and calendar integration
- 🔄 Payment processing for lesson bookings
- 🔄 Push notifications for new messages and lesson requests
- 🔄 Mobile app for iOS and Android
- 🔄 Video lesson capability integration
- 🔄 Music theory resource sharing
- 🔄 Practice room booking integration (Northwestern facilities)

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite, React 19, TypeScript, Tailwind CSS |
| UI Components | Radix UI, Lucide React |
| Backend | Spring Boot 3.4.5, Java 21 |
| Database | MySQL 8.0, JPA/Hibernate |
| Caching | Redis |
| File Storage | Firebase Storage |
| Build Tools | Maven, npm |
| Development | Vite Dev Server, Hot Reload |

## 🤝 Contributing

This project is currently in development. Contribution guidelines will be added as the project matures.

## 📝 License

This project is currently private and not yet licensed for public use.

## 📞 Support

For questions or support during development, please contact the development team.

---

**Note**: This project is actively being developed. Features and documentation are subject to change as development progresses.
