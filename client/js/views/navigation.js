import { auth } from '../auth/auth.js';

export const navigation = {
    render() {
        const app = document.getElementById('app');
        const existingNav = document.querySelector('nav');
        if (existingNav) {
            existingNav.remove();
        }

        const nav = document.createElement('nav');
        nav.className = 'bg-gray-800 shadow-lg';
        nav.innerHTML = this.getNavHTML();
        
        app.insertBefore(nav, app.firstChild);
        this.attachEventListeners();
    },

    getNavHTML() {
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <h1 class="text-white text-xl font-bold">Task Tracker</h1>
                        </div>
                        <div class="hidden md:ml-6 md:flex md:space-x-4">
                            <a href="#/dashboard" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                            </a>
                            <a href="#/projects" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                <i class="fas fa-project-diagram mr-2"></i>Projects
                            </a>
                            <a href="#/tasks" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                <i class="fas fa-tasks mr-2"></i>My Tasks
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div class="hidden md:flex items-center space-x-4">
                            <span class="text-gray-300 text-sm">Welcome, ${auth.currentUser?.name || 'User'}</span>
                            <a href="#/profile" class="text-gray-300 hover:text-white">
                                <i class="fas fa-user-circle text-lg"></i>
                            </a>
                            <button id="logoutBtn" class="text-gray-300 hover:text-white">
                                <i class="fas fa-sign-out-alt text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => auth.logout());
        }
    }
};