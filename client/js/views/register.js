import { auth } from '../auth/auth.js';
import { dom } from '../utils/dom.js';

export const register = {
    async render() {
        const content = document.getElementById('content');
        dom.clearElement(content);

        const html = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600">
                            Or <a href="#/login" class="font-medium text-blue-600 hover:text-blue-500">sign in to existing account</a>
                        </p>
                    </div>
                    <form class="mt-8 space-y-6" id="registerForm">
                        <div>
                            <label for="name" class="sr-only">Full name</label>
                            <input id="name" name="name" type="text" autocomplete="name" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Full name">
                        </div>
                        <div>
                            <label for="email" class="sr-only">Email address</label>
                            <input id="email" name="email" type="email" autocomplete="email" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address">
                        </div>
                        <div>
                            <label for="password" class="sr-only">Password</label>
                            <input id="password" name="password" type="password" autocomplete="new-password" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password">
                        </div>
                        <div>
                            <label for="confirmPassword" class="sr-only">Confirm Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" required 
                                class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password">
                        </div>

                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Create account
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
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', this.handleRegister.bind(this));
    },

    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Basic validation
        if (userData.password !== userData.confirmPassword) {
            dom.showNotification('Passwords do not match', 'error');
            return;
        }

        if (userData.password.length < 6) {
            dom.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;

            await auth.register(userData);
            dom.showNotification('Registration successful!', 'success');
            window.location.hash = '/dashboard';
        } catch (error) {
            dom.showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
};