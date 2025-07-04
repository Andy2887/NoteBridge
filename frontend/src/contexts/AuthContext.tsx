import React, { createContext, useState, ReactNode, useEffect } from 'react';
import UserService from '../service/AuthService';

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  profileUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    firstName?: string;
    lastName?: string;
    bio?: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  refreshAuthState: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [loading, setLoading] = useState(true);

    const refreshAuthState = () => {
        const authenticated = UserService.isAuthenticated();
        const admin = UserService.isAdmin();
        const student = UserService.isStudent();
        const teacher = UserService.isTeacher();
        const currentUser = UserService.getCurrentUser();

        setIsAuthenticated(authenticated);
        setIsAdmin(admin);
        setIsStudent(student);
        setIsTeacher(teacher);
        setUser(currentUser);
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            const response = await UserService.login(email, password);
            
            // Check if login was successful based on status code and token
            if (response.statusCode === 200 && response.token) {
                // Create a user object from the response data
                const user = {
                    id: 0, // Will be updated when we fetch profile
                    email: email,
                    role: response.role || 'STUDENT',
                    firstName: response.firstName,
                    lastName: response.lastName,
                    bio: response.bio,
                    phoneNumber: response.phoneNumber,
                    profileUrl: response.profileUrl
                };

                UserService.setTokens(
                    response.token,
                    response.refreshToken,
                    response.role,
                    user
                );
                refreshAuthState();
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: {
        email: string;
        password: string;
        role: 'STUDENT' | 'TEACHER' | 'ADMIN';
        firstName?: string;
        lastName?: string;
        bio?: string;
        phoneNumber?: string;
    }): Promise<void> => {
        try {
            setLoading(true);
            const response = await UserService.register(userData);
            
            // Check if registration was successful
            if (response.statusCode === 200 && response.user) {
                // After successful registration, automatically log in the user
                await login(userData.email, userData.password);
            } else {
                throw new Error(response.message || response.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        UserService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsStudent(false);
        setIsTeacher(false);
    };

    useEffect(() => {
        refreshAuthState();
        setLoading(false);
    }, []);

    const contextValue: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isStudent,
        isTeacher,
        refreshAuthState,
        loading
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
