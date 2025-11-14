import { api } from '../utils/api.js';
import { dom } from '../utils/dom.js';

export const projectDetails = {
    async render() {
        const projectId = window.location.hash.split('/')[2];
        if (!projectId) {
            window.location.hash = '/projects';
            return;
        }

        const content = document.getElementById('content');
        dom.clearElement(content);

        const html = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="mb-6">
                    <button onclick="window.location.hash='#/projects'" 
                            class="text-blue-600 hover:text-blue-800 mb-4">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Projects
                    </button>
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 id="projectName" class="text-3xl font-bold text-gray-900">Loading...</h1>
                            <p id="projectDescription" class="text-gray-600"></p>
                        </div>
                        <button id="createTaskBtn" 
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <i class="fas fa-plus mr-2"></i>New Task
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow">
                            <div class="px-6 py-4 border-b border-gray-200">
                                <h2 class="text-xl font-semibold text-gray-900">Tasks</h2>
                            </div>
                            <div class="p-6" id="tasksList">
                                <div class="text-center py-8">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="bg-white rounded-lg shadow p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Stats</h3>
                            <div class="space-y-3" id="projectStats">
                                <!-- Stats will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Create Task Modal -->
            <div id="createTaskModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
                        <form id="createTaskForm">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                <input type="text" name="title" required 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea name="description" rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                <select name="status" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-3">
                                <button type="button" id="cancelCreateTask" 
                                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
        await this.loadProjectDetails(projectId);
        this.attachEventListeners(projectId);
    },

    async loadProjectDetails(projectId) {
        try {
            const [projectResponse, tasksResponse] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/tasks/project/${projectId}`)
            ]);

            this.renderProjectInfo(projectResponse.data);
            this.renderTasks(tasksResponse.data.tasks);
            this.renderProjectStats(projectResponse.data, tasksResponse.data.tasks);
        } catch (error) {
            dom.showNotification('Failed to load project details', 'error');
        }
    },

    renderProjectInfo(project) {
        document.getElementById('projectName').textContent = project.name;
        document.getElementById('projectDescription').textContent = project.description || 'No description';
    },

    renderTasks(tasks) {
        const container = document.getElementById('tasksList');
        
        if (!tasks || tasks.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-tasks text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No tasks found for this project</p>
                    <button id="createFirstTask" 
                            class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Create your first task
                    </button>
                </div>
            `;
            return;
        }

        const tasksHtml = tasks.map(task => `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${task.title}</h3>
                        <p class="text-gray-600">${task.description || 'No description'}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }">
                        ${task.status}
                    </span>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>Assignee: ${task.assignee?.name || 'Unassigned'}</span>
                    <span>Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="mt-3 flex space-x-2">
                    <button onclick="projectDetails.updateTaskStatus('${task.id}', 'IN_PROGRESS')" 
                            class="text-yellow-600 hover:text-yellow-800 text-sm">
                        <i class="fas fa-play mr-1"></i>Start
                    </button>
                    <button onclick="projectDetails.updateTaskStatus('${task.id}', 'COMPLETED')" 
                            class="text-green-600 hover:text-green-800 text-sm">
                        <i class="fas fa-check mr-1"></i>Complete
                    </button>
                    <button onclick="projectDetails.editTask('${task.id}')" 
                            class="text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="projectDetails.deleteTask('${task.id}')" 
                            class="text-red-600 hover:text-red-800 text-sm">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = tasksHtml;
    },

    renderProjectStats(project, tasks) {
        const statsContainer = document.getElementById('projectStats');
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
        const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
        const pendingTasks = tasks.filter(task => task.status === 'PENDING').length;

        const statsHtml = `
            <div class="flex justify-between">
                <span>Total Tasks:</span>
                <span class="font-semibold">${totalTasks}</span>
            </div>
            <div class="flex justify-between">
                <span>Completed:</span>
                <span class="font-semibold text-green-600">${completedTasks}</span>
            </div>
            <div class="flex justify-between">
                <span>In Progress:</span>
                <span class="font-semibold text-yellow-600">${inProgressTasks}</span>
            </div>
            <div class="flex justify-between">
                <span>Pending:</span>
                <span class="font-semibold text-gray-600">${pendingTasks}</span>
            </div>
            <div class="pt-3 border-t">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" 
                         style="width: ${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%"></div>
                </div>
                <div class="text-xs text-gray-500 mt-1 text-center">
                    ${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}% Complete
                </div>
            </div>
        `;

        statsContainer.innerHTML = statsHtml;
    },

    attachEventListeners(projectId) {
        // Create task modal
        const createBtn = document.getElementById('createTaskBtn');
        const modal = document.getElementById('createTaskModal');
        const cancelBtn = document.getElementById('cancelCreateTask');
        const form = document.getElementById('createTaskForm');

        createBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

        form.addEventListener('submit', (e) => this.handleCreateTask(e, projectId));

        // Create first task button
        const createFirstBtn = document.getElementById('createFirstTask');
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        }
    },

    async handleCreateTask(event, projectId) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            status: formData.get('status')
        };

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;

            await api.post(`/tasks/project/${projectId}`, taskData);
            dom.showNotification('Task created successfully!', 'success');
            
            document.getElementById('createTaskModal').classList.add('hidden');
            event.target.reset();
            await this.loadProjectDetails(projectId);
        } catch (error) {
            dom.showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    async updateTaskStatus(taskId, status) {
        try {
            await api.put(`/tasks/${taskId}`, { status });
            dom.showNotification('Task status updated!', 'success');
            
            const projectId = window.location.hash.split('/')[2];
            await this.loadProjectDetails(projectId);
        } catch (error) {
            dom.showNotification(error.message, 'error');
        }
    },

    async editTask(taskId) {
        dom.showNotification('Edit functionality coming soon!', 'info');
    },

    async deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                dom.showNotification('Task deleted successfully!', 'success');
                
                const projectId = window.location.hash.split('/')[2];
                await this.loadProjectDetails(projectId);
            } catch (error) {
                dom.showNotification(error.message, 'error');
            }
        }
    }
};