export const dom = {
    createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    },

    clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    showNotification(message, type = 'info') {
        const notification = this.createElement('div', 
            `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                type === 'error' ? 'bg-red-500' : 
                type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            } text-white`
        );
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};