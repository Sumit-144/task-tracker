import { api } from '../utils/api.js';
import { dom } from '../utils/dom.js';

class AuthService {
    constructor() {
        this.currentUser = null;
    }

    async register(userData) {
        const response = await api.post('/auth/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password
        });

        if (response.success) {
            localStorage.setItem('token', response.data.token);
            this.currentUser = response.data.user;
            return response.data;
        }
    }

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);

        if (response.success) {
            localStorage.setItem('token', response.data.token);
            this.currentUser = response.data.user;
            return response.data;
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        window.location.hash = '/login';
    }

    async getCurrentUser() {
        if (!localStorage.getItem('token')) {
            return null;
        }

        try {
            // In a real app, you might have a /me endpoint
            // For now, we'll decode the token to get user info
            const token = localStorage.getItem('token');
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            this.currentUser = {
                id: payload.userId,
                email: payload.email,
                role: payload.role
            };
            
            return this.currentUser;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

export const auth = new AuthService();