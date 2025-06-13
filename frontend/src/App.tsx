import { useState } from 'react';
import { useLessons } from './hooks/useLessons';
import { userService } from './services/userService';
import type { User } from './types/api';
import './App.css';

function App() {
  const { data: lessons, loading: lessonsLoading, error: lessonsError } = useLessons();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Example: Fetch users manually
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Register a new user
  const handleRegister = async () => {
    try {
      const newUser = {
        username: 'test_student',
        email: 'test@u.northwestern.edu',
        password: 'password123',
        role: 'STUDENT' as const,
        firstName: 'Test',
        lastName: 'Student',
        instrument: 'Piano',
      };

      const result = await userService.register(newUser);
      console.log('Registration successful:', result);
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="App">
      <h1>NoteBridge - Music Lesson Platform</h1>
      
      {/* Lessons Section */}
      <section>
        <h2>Available Lessons</h2>
        {lessonsLoading && <p>Loading lessons...</p>}
        {lessonsError && <p style={{ color: 'red' }}>Error: {lessonsError}</p>}
        {lessons && (
          <div>
            <p>Found {lessons.length} lessons</p>
            {lessons.map(lesson => (
              <div key={lesson.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                <h3>{lesson.description}</h3>
                <p>Teacher: {lesson.teacher.username}</p>
                <p>Location: {lesson.location}</p>
                <p>Start: {new Date(lesson.startTime).toLocaleString()}</p>
                <p>End: {new Date(lesson.endTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Users'}
        </button>
        <button onClick={handleRegister}>Register Test User</button>
        
        {users.length > 0 && (
          <div>
            <p>Found {users.length} users</p>
            {users.map(user => (
              <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                <h4>{user.username} ({user.role})</h4>
                <p>Email: {user.email}</p>
                {user.instrument && <p>Instrument: {user.instrument}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;