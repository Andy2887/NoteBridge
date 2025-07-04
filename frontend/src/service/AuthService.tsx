import axios from "axios";

// Type definitions matching backend AuthReqRes DTO
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

interface AuthReqRes {
  // Response fields
  statusCode?: number;
  error?: string;
  message?: string;
  
  // Authentication response fields
  token?: string;
  refreshToken?: string;
  expirationTime?: string;
  
  // User fields for registration/login requests and responses
  email?: string;
  password?: string;
  role?: string; // STUDENT, ADMIN, TEACHER
  bio?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileUrl?: string;
  
  // User object for responses
  user?: User;
  usersList?: User[];
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  profileUrl?: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

class UserService {
    static BASE_URL = import.meta.env.VITE_API_BASE_URL;

    static async login(email: string, password: string): Promise<AuthReqRes> {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {
                email,
                password
            } as LoginRequest);
            return response.data;
        } catch (err) {
            console.log("Error during login: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async register(userData: RegisterRequest): Promise<AuthReqRes> {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (err) {
            console.log("Error during register: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async refreshToken(refreshToken: string): Promise<AuthReqRes> {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/refresh`, {
                refreshToken
            } as RefreshTokenRequest);
            return response.data;
        } catch (err) {
            console.log("Error during refreshToken: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async getAllUsers(token: string): Promise<AuthReqRes> {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.log("Error during getAllUsers: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async getProfile(token: string): Promise<AuthReqRes> {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/user/get-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.log("Error during getProfile: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async getUserById(userId: number, token: string): Promise<AuthReqRes> {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.log("Error during getUserById: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async deleteUser(userId: number, token: string): Promise<AuthReqRes> {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/user/deleteUser/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.log("Error during deleteUser: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    static async updateUser(userId: number, userData: Partial<RegisterRequest>, token: string): Promise<AuthReqRes> {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/user/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.log("Error during updateUser: ", err instanceof Error ? err.message : String(err))
            throw err;
        }
    }

    /**Authentication Checker */
    static logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    }

    static isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug log
        return !!token; // Convert token to a boolean and return it
    }

    static isAdmin(): boolean {
        const role = localStorage.getItem('role');
        console.log('Role from localStorage:', role); // Debug log
        return role?.toUpperCase() === 'ADMIN';
    }

    static isUser(): boolean {
        const role = localStorage.getItem('role');
        return role?.toUpperCase() === 'USER';
    }

    static isStudent(): boolean {
        const role = localStorage.getItem('role');
        return role?.toUpperCase() === 'STUDENT';
    }

    static isTeacher(): boolean {
        const role = localStorage.getItem('role');
        return role?.toUpperCase() === 'TEACHER';
    }

    static adminOnly(): boolean {
        const authenticated = this.isAuthenticated();
        const isAdmin = this.isAdmin();
        console.log('Is authenticated:', authenticated, 'Is admin:', isAdmin); // Debug log
        return authenticated && isAdmin;
    }

    static getToken(): string | null {
        return localStorage.getItem('token');
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    static setTokens(token: string, refreshToken?: string, role?: string, user?: User): void {
        localStorage.setItem('token', token);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        if (role) {
            localStorage.setItem('role', role);
        }
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    static getCurrentRole(): string | null {
        return localStorage.getItem('role');
    }

    static getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    static setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export default UserService;