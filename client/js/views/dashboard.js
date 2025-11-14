import { api } from '../utils/api.js';
import { dom } from '../utils/dom.js';

export const dashboard = {
    async render() {
        const content = document.getElementById('content');
        dom.clearElement(content);

        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-gray-600">Welcome back! Here's an overview of your projects and tasks.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-lg shadow">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h2 class="text-xl font-semibold text-gray-900">Recent Projects</h2>
                        </div>
                        <div class="p-6" id="recentProjects">
                            <div class="text-center py-8">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h2 class="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                        </div>
                        <div class="p-6" id="recentTasks">
                            <div class="text-center py-8">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
        await this.loadData();
    },

    async loadData() {
        try {
            const [projectsData, tasksData] = await Promise.all([
                api.get('/projects?limit=5'),
                api.get('/tasks?limit=10')
            ]);

            this.updateDashboardStats(projectsData, tasksData);
            this.renderRecentProjects(projectsData.data.projects);
            this.renderRecentTasks(tasksData.data.tasks);
        } catch (error) {
            dom.showNotification('Failed to load dashboard data', 'error');
        }
    },

    updateDashboardStats(projectsData, tasksData) {
        document.getElementById('totalProjects').textContent = projectsData.data.pagination?.total || 0;
        document.getElementById('totalTasks').textContent = tasksData.data.pagination?.total || 0;
        
        const pendingTasks = tasksData.data.tasks?.filter(task => task.status === 'PENDING').length || 0;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    },

    renderRecentProjects(projects) {
        const container = document.getElementById('recentProjects');
        
        if (!projects || projects.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No projects found</p>';
            return;
        }

        const projectsHtml = projects.map(project => `
            <div class="border-b border-gray-200 last:border-b-0 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold text-gray-900">${project.name}</h3>
                        <p class="text-sm text-gray-600">${project.description || 'No description'}</p>
                    </div>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        ${project._count?.tasks || 0} tasks
                    </span>
                </div>
                <div class="mt-2 flex justify-between items-center text-sm text-gray-500">
                    <span>Created: ${new Date(project.createdAt).toLocaleDateString()}</span>
                    <button onclick="window.location.hash='#/projects/${project.id}'" 
                            class="text-blue-600 hover:text-blue-800">
                        View Project
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = projectsHtml;
    },

    renderRecentTasks(tasks) {
        const container = document.getElementById('recentTasks');
        
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No tasks found</p>';
            return;
        }

        const tasksHtml = tasks.map(task => `
            <div class="border-b border-gray-200 last:border-b-0 py-3">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-gray-900">${task.title}</h3>
                    <span class="px-2 py-1 text-xs rounded-full ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }">
                        ${task.status}
                    </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">${task.description || 'No description'}</p>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>Project: ${task.project?.name || 'N/A'}</span>
                    <span>${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = tasksHtml;
    }
};