import { router } from './utils/router.js';
import { navigation } from './views/navigation.js';
import { dashboard } from './views/dashboard.js';
import { login } from './views/login.js';
import { register } from './views/register.js';
import { projects } from './views/projects.js';
import { projectDetails } from './views/projectDetails.js';
import { notFound } from './views/notFound.js';
import { auth } from './auth/auth.js';



// Register routes
router.addRoute('/login', login);
router.addRoute('/register', register);
router.addRoute('/dashboard', dashboard);
router.addRoute('/projects', projects);
router.addRoute('/projects/:id', projectDetails);
router.addRoute('/tasks', dashboard); // Using dashboard for tasks for now
router.addRoute('/404', notFound);

// Add navigation to protected routes
const protectedRoutes = ['/dashboard', '/projects', '/tasks'];
router.addRoute('*', {
    async render() {
        const path = window.location.hash.slice(1) || '/dashboard';
        
        if (protectedRoutes.some(route => path.startsWith(route))) {
            navigation.render();
        }
        
        const component = router.routes[path] || router.routes['/404'];
        if (component) {
            await component.render();
        }
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await auth.getCurrentUser();
    router.init();
});

 class TaskTrackerApp {
            constructor() {
                this.currentUser = null;
                this.token = localStorage.getItem('token');
                this.init();
            }

            init() {
                console.log('Task Tracker App Initializing...');
                this.showLoading();
                
                // Check if we have a token and try to validate it
                if (this.token) {
                    this.validateToken().then(valid => {
                        if (valid) {
                            this.showDashboard();
                        } else {
                            this.showLogin();
                        }
                    }).catch(() => {
                        this.showLogin();
                    });
                } else {
                    this.showLogin();
                }
            }

            async validateToken() {
                try {
                    const response = await fetch('http://localhost:3000/api/projects', {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                    return response.ok;
                } catch (error) {
                    console.error('Token validation error:', error);
                    return false;
                }
            }

            showLoading() {
                const content = document.getElementById('content');
                content.innerHTML = `
                    <div class="min-h-screen flex items-center justify-center bg-gray-50">
                        <div class="text-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p class="mt-4 text-gray-600">Loading Task Tracker...</p>
                        </div>
                    </div>
                `;
            }

            showLogin() {
                console.log('Showing login screen');
                const content = document.getElementById('content');
                content.innerHTML = `
                    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div class="max-w-md w-full space-y-8">
                            <div>
                                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                    Sign in to Task Tracker
                                </h2>
                                <p class="mt-2 text-center text-sm text-gray-600">
                                    Demo: demo@example.com / password
                                </p>
                            </div>
                            <form class="mt-8 space-y-6" id="loginForm">
                                <div class="space-y-4">
                                    <div>
                                        <label for="email" class="sr-only">Email address</label>
                                        <input id="email" name="email" type="email" required 
                                            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Email address" value="demo@example.com">
                                    </div>
                                    <div>
                                        <label for="password" class="sr-only">Password</label>
                                        <input id="password" name="password" type="password" required 
                                            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Password" value="password">
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" 
                                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Sign in
                                    </button>
                                </div>
                                
                                <div class="text-center">
                                    <p class="text-sm text-gray-600">
                                        Don't have an account? 
                                        <a href="#" onclick="app.showRegister()" class="font-medium text-blue-600 hover:text-blue-500">
                                            Register here
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                // Add form submission handler
                const form = document.getElementById('loginForm');
                form.addEventListener('submit', (e) => this.handleLogin(e));
            }

            showRegister() {
                const content = document.getElementById('content');
                content.innerHTML = `
                    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div class="max-w-md w-full space-y-8">
                            <div>
                                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                    Create Account
                                </h2>
                            </div>
                            <form class="mt-8 space-y-6" id="registerForm">
                                <div class="space-y-4">
                                    <div>
                                        <label for="name" class="sr-only">Full Name</label>
                                        <input id="name" name="name" type="text" required 
                                            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Full Name">
                                    </div>
                                    <div>
                                        <label for="email" class="sr-only">Email address</label>
                                        <input id="email" name="email" type="email" required 
                                            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Email address">
                                    </div>
                                    <div>
                                        <label for="password" class="sr-only">Password</label>
                                        <input id="password" name="password" type="password" required 
                                            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Password">
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" 
                                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Create Account
                                    </button>
                                </div>
                                
                                <div class="text-center">
                                    <p class="text-sm text-gray-600">
                                        Already have an account? 
                                        <a href="#" onclick="app.showLogin()" class="font-medium text-blue-600 hover:text-blue-500">
                                            Sign in here
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

                const form = document.getElementById('registerForm');
                form.addEventListener('submit', (e) => this.handleRegister(e));
            }

            async handleLogin(event) {
                event.preventDefault();
                console.log('Handling login...');
                
                const formData = new FormData(event.target);
                const credentials = {
                    email: formData.get('email'),
                    password: formData.get('password')
                };

                const submitBtn = event.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                try {
                    submitBtn.textContent = 'Signing in...';
                    submitBtn.disabled = true;

                    console.log('Sending login request...', credentials);
                    const response = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(credentials)
                    });

                    const data = await response.json();
                    console.log('Login response:', data);

                    if (data.success) {
                        this.token = data.data.token;
                        localStorage.setItem('token', this.token);
                        this.currentUser = data.data.user;
                        this.showNotification('Login successful!', 'success');
                        this.showDashboard();
                    } else {
                        throw new Error(data.message || 'Login failed');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    this.showNotification(error.message, 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }

            async handleRegister(event) {
                event.preventDefault();
                
                const formData = new FormData(event.target);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                };

                const submitBtn = event.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                try {
                    submitBtn.textContent = 'Creating account...';
                    submitBtn.disabled = true;

                    const response = await fetch('http://localhost:3000/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData)
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.token = data.data.token;
                        localStorage.setItem('token', this.token);
                        this.currentUser = data.data.user;
                        this.showNotification('Registration successful!', 'success');
                        this.showDashboard();
                    } else {
                        throw new Error(data.message || 'Registration failed');
                    }
                } catch (error) {
                    this.showNotification(error.message, 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }

            showDashboard() {
                const content = document.getElementById('content');
                content.innerHTML = `
                    <nav class="bg-gray-800 shadow-lg">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div class="flex justify-between h-16">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <h1 class="text-white text-xl font-bold">Task Tracker</h1>
                                    </div>
                                    <div class="hidden md:ml-6 md:flex md:space-x-4">
                                        <a href="#" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                                            <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                                        </a>
                                        <a href="#" onclick="app.showProjects()" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            <i class="fas fa-project-diagram mr-2"></i>Projects
                                        </a>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div class="hidden md:flex items-center space-x-4">
                                        <span class="text-gray-300 text-sm">Welcome, ${this.currentUser?.name || 'User'}</span>
                                        <button onclick="app.logout()" class="text-gray-300 hover:text-white">
                                            <i class="fas fa-sign-out-alt text-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p class="text-gray-600">Welcome to your Task Tracker!</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div class="bg-white rounded-lg shadow p-6">
                                <div class="flex items-center">
                                    <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <i class="fas fa-project-diagram"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-semibold text-gray-900" id="totalProjects">0</h3>
                                        <p class="text-gray-600">Total Projects</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white rounded-lg shadow p-6">
                                <div class="flex items-center">
                                    <div class="p-3 rounded-full bg-green-100 text-green-600">
                                        <i class="fas fa-tasks"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-semibold text-gray-900" id="totalTasks">0</h3>
                                        <p class="text-gray-600">Total Tasks</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white rounded-lg shadow p-6">
                                <div class="flex items-center">
                                    <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg font-semibold text-gray-900" id="pendingTasks">0</h3>
                                        <p class="text-gray-600">Pending Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div class="flex space-x-4">
                                <button onclick="app.showCreateProject()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    <i class="fas fa-plus mr-2"></i>Create Project
                                </button>
                                <button onclick="app.showProjects()" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                                    <i class="fas fa-list mr-2"></i>View All Projects
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                this.loadDashboardData();
            }

            async loadDashboardData() {
                try {
                    const response = await fetch('http://localhost:3000/api/projects', {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        // Update dashboard stats
                        document.getElementById('totalProjects').textContent = data.data.pagination?.total || 0;
                    }
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                }
            }

            showProjects() {
                this.showNotification('Projects feature coming soon!', 'info');
            }

            showCreateProject() {
                // this.showNotification('Create project feature coming soon!', 'info');
                projects.render();
            }

            logout() {
                localStorage.removeItem('token');
                this.token = null;
                this.currentUser = null;
                this.showNotification('Logged out successfully', 'success');
                this.showLogin();
            }

            showNotification(message, type = 'info') {
                // Remove existing notifications
                document.querySelectorAll('.notification').forEach(notification => {
                    notification.remove();
                });

                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        }

        // Initialize the app when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.app = new TaskTrackerApp();
        });

        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });