import { api } from '../utils/api.js';
import { dom } from '../utils/dom.js';

export const projects = {
    async render() {
        const content = document.getElementById('content');
        dom.clearElement(content);

        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
                        <p class="text-gray-600">Manage your projects and tasks</p>
                    </div>
                    <button id="createProjectBtn" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <i class="fas fa-plus mr-2"></i>New Project
                    </button>
                </div>

                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-semibold text-gray-900">My Projects</h2>
                            <div class="relative">
                                <input type="text" id="projectSearch" 
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search projects...">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                    <div class="p-6" id="projectsList">
                        <div class="text-center py-8">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Create Project Modal -->
            <div id="createProjectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
                        <form id="createProjectForm">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
                                <input type="text" name="name" required 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea name="description" rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div class="flex justify-end space-x-3">
                                <button type="button" id="cancelCreateProject" 
                                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
        await this.loadProjects();
        this.attachEventListeners();
    },

    async loadProjects(search = '') {
        try {
            const response = await api.get(`/projects?search=${encodeURIComponent(search)}`);
            this.renderProjects(response.data.projects);
        } catch (error) {
            dom.showNotification('Failed to load projects', 'error');
        }
    },

    renderProjects(projects) {
        const container = document.getElementById('projectsList');
        
        if (!projects || projects.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No projects found</p>
                    <button id="createFirstProject" 
                            class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Create your first project
                    </button>
                </div>
            `;
            return;
        }

        const projectsHtml = projects.map(project => `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${project.name}</h3>
                        <p class="text-gray-600">${project.description || 'No description'}</p>
                    </div>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        ${project._count?.tasks || 0} tasks
                    </span>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>Created: ${new Date(project.createdAt).toLocaleDateString()}</span>
                    <div class="space-x-2">
                        <button onclick="window.location.hash='#/projects/${project.id}'" 
                                class="text-blue-600 hover:text-blue-800">
                            View Details
                        </button>
                        <button onclick="projects.editProject('${project.id}')" 
                                class="text-green-600 hover:text-green-800">
                            Edit
                        </button>
                        <button onclick="projects.deleteProject('${project.id}')" 
                                class="text-red-600 hover:text-red-800">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = projectsHtml;
    },

    attachEventListeners() {
        // Create project modal
        const createBtn = document.getElementById('createProjectBtn');
        const modal = document.getElementById('createProjectModal');
        const cancelBtn = document.getElementById('cancelCreateProject');
        const form = document.getElementById('createProjectForm');

        createBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

        form.addEventListener('submit', this.handleCreateProject.bind(this));

        // Search functionality
        const searchInput = document.getElementById('projectSearch');
        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.loadProjects(e.target.value);
            }, 300);
        });

        // Create first project button
        const createFirstBtn = document.getElementById('createFirstProject');
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        }
    },

    async handleCreateProject(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const projectData = {
            name: formData.get('name'),
            description: formData.get('description')
        };

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;

            await api.post('/projects', projectData);
            dom.showNotification('Project created successfully!', 'success');
            
            document.getElementById('createProjectModal').classList.add('hidden');
            event.target.reset();
            await this.loadProjects();
        } catch (error) {
            dom.showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    async editProject(projectId) {
        // Implementation for editing project
        dom.showNotification('Edit functionality coming soon!', 'info');
    },

    async deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project? All tasks will also be deleted.')) {
            try {
                await api.delete(`/projects/${projectId}`);
                dom.showNotification('Project deleted successfully!', 'success');
                await this.loadProjects();
            } catch (error) {
                dom.showNotification(error.message, 'error');
            }
        }
    }
};