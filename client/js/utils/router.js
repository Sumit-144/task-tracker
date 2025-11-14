class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        this.handleRouteChange();
    }

    addRoute(path, component) {
        this.routes[path] = component;
    }

    async handleRouteChange() {
        const path = window.location.hash.slice(1) || '/dashboard';
        await this.navigate(path);
    }

    async navigate(path) {
        const token = localStorage.getItem('token');
        
        // Redirect to login if not authenticated and trying to access protected routes
        if (!token && !['/login', '/register'].includes(path)) {
            window.location.hash = '/login';
            return;
        }

        // Redirect to dashboard if authenticated and trying to access auth pages
        if (token && ['/login', '/register'].includes(path)) {
            window.location.hash = '/dashboard';
            return;
        }

        const component = this.routes[path] || this.routes['/404'];
        
        if (component) {
            this.currentRoute = path;
            await component.render();
            this.updateNavigation();
        }
    }

    updateNavigation() {
        // Update active navigation links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('bg-gray-900', 'text-white');
            if (link.getAttribute('href') === `#${this.currentRoute}`) {
                link.classList.add('bg-gray-900', 'text-white');
            }
        });
    }
}

export const router = new Router();