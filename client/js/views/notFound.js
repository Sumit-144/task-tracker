import { dom } from '../utils/dom.js';

export const notFound = {
    async render() {
        const content = document.getElementById('content');
        dom.clearElement(content);

        const html = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full text-center">
                    <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                    <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <button onclick="window.location.hash='#/dashboard'" 
                            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        `;

        content.innerHTML = html;
    }
};