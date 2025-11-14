import { auth } from './auth/auth.js';
import { router } from './utils/router.js';
import { api } from './utils/api.js';

class TaskTrackerApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check authentication status
        await this.checkAuth();
        
        // Initialize router
        router.init();
        
        // Load initial view
        this.loadView();
    }

    async checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                this.currentUser = await auth.getCurrentUser();
            } catch (error) {
                localStorage.removeItem('token');
                this.currentUser = null;
            }
        }
    }

    loadView() {
        const path = window.location.hash.slice(1) || '/dashboard';
        router.navigate(path);
    }
}

export const initApp = () => {
    window.app = new TaskTrackerApp();
};