import { auth } from '../auth/auth.js';
import { dom } from '../utils/dom.js';

export const login = {
    async render() {
        const content = document.getElementById('content');
        dom.clearElement(content);

        const html = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600">
                            Or <a href="#/register" class="font-medium text-blue-600 hover:text-blue-500">create a new account</a>
                        </p>
                    </div>
                    <form class="mt-8 space-y-6" id="loginForm">
                        <div>
                            <label for="email" class="sr-only">Email address</label>
                            <input id="email" name="email" type="email" autocomplete="email" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address">
                        </div>
                        <div>
                            <label for="password" class="sr-only">Password</label>
                            <input id="password" name="password" type="password" autocomplete="current-password" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password">
                        </div>

                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        content.innerHTML = html;
        this.attachEventListeners();
    },

    attachEventListeners() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', this.handleLogin.bind(this));
    },

    async handleLogin(event) {
        event.preventDefault();
        
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

            await auth.login(credentials);
            dom.showNotification('Login successful!', 'success');
            window.location.hash = '/dashboard';
        } catch (error) {
            dom.showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
};