// Non-module version for quick testing
class SimpleApp {
    constructor() {
        this.init();
    }

    init() {
        this.showLogin();
        this.setupNavigation();
    }

    showLogin() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to Task Tracker
                        </h2>
                    </div>
                    <form class="mt-8 space-y-6" onsubmit="return app.handleLogin(event)">
                        <div>
                            <label for="email" class="sr-only">Email address</label>
                            <input id="email" name="email" type="email" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Email address" value="demo@example.com">
                        </div>
                        <div>
                            <label for="password" class="sr-only">Password</label>
                            <input id="password" name="password" type="password" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Password" value="password">
                        </div>
                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                Sign in (Demo)
                            </button>
                        </div>
                    </form>
                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            This is a demo. Make sure the backend server is running on port 3000.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    async handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                this.showDashboard();
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            alert('Login error: ' + error.message);
            console.error('Login error:', error);
        }
    }

    showDashboard() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <nav class="bg-gray-800 shadow-lg">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <h1 class="text-white text-xl font-bold">Task Tracker</h1>
                        </div>
                        <div class="flex items-center">
                            <button onclick="app.logout()" class="text-gray-300 hover:text-white">
                                <i class="fas fa-sign-out-alt mr-2"></i>Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="max-w-7xl mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold mb-4">Welcome!</h3>
                        <p class="text-gray-600">Task Tracker is running successfully.</p>
                        <p class="text-gray-600 mt-2">Backend: ${localStorage.getItem('token') ? 'Connected' : 'Not connected'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    logout() {
        localStorage.removeItem('token');
        this.showLogin();
    }

    setupNavigation() {
        // Simple hash-based routing
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash === 'dashboard' && localStorage.getItem('token')) {
                this.showDashboard();
            } else {
                this.showLogin();
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SimpleApp();
});