// Global variables
let tasks = [];
let taskIdCounter = 0;
let currentFilter = 'all';
let currentSort = 'none';

// Level 1 Bug 1: Missing initialization function call
// The app should initialize on page load but doesn't

// Level 1 Bug 2: Enter key doesn't work for adding tasks
function addTask() {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date');
    const dueTimeInput = document.getElementById('due-time');
    
    const taskText = taskInput.value.trim();
    
    if (!taskText) {
        alert('Please enter a task!');
        return;
    }
    
    // Level 2 Bug 1: Task ID collision possible
    // taskIdCounter might reset or duplicate IDs can occur
    const newTask = {
        id: taskIdCounter++, // Bug: No check for existing IDs
        text: taskText,
        completed: false,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        dueTime: dueTimeInput.value,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    // Clear inputs
    taskInput.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';
    
    renderTasks();
    updateCounts();
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    // Level 2 Bug 2: Filter logic is flawed
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    // Bug: 'all' filter doesn't properly show all tasks in some cases
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`;
    
    // Level 3 Bug 1: Priority colors not applied correctly
    let priorityColor = 'gray'; // Bug: Should change based on task.priority but doesn't
    
    // Level 3 Bug 2: Date formatting issues with invalid dates
    let dueDateText = '';
    if (task.dueDate) {
        const date = new Date(task.dueDate + 'T' + task.dueTime);
        dueDateText = date.toLocaleDateString(); // Bug: Doesn't handle invalid dates
    }
    
    taskDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})" 
                       class="w-5 h-5 text-indigo-600">
                <div class="flex-1">
                    <div class="${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} font-medium">
                        ${task.text}
                    </div>
                    <div class="text-sm text-${priorityColor}-600">
                        Priority: ${task.priority} ${dueDateText ? '| Due: ' + dueDateText : ''}
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editTask(${task.id})" class="text-blue-500 hover:text-blue-700 text-sm">
                    Edit
                </button>
                <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700 text-sm">
                    Delete
                </button>
            </div>
        </div>
    `;
    
    return taskDiv;
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateCounts();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
            task.text = newText.trim();
            renderTasks();
        }
    }
}

function deleteTask(id) {
    // Level 4 Bug 1: Delete confirmation always shows even when cancelled
    const confirmed = confirm('Are you sure you want to delete this task?');
    tasks = tasks.filter(t => t.id !== id); // Bug: Deletes even if not confirmed
    renderTasks();
    updateCounts();
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Level 4 Bug 2: Filter buttons don't update active state properly
    // Bug: Active class management is broken
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    renderTasks();
}

function sortTasks(sortBy) {
    currentSort = sortBy;
    
    if (sortBy === 'priority') {
        // Level 5 Bug 1: Priority sorting logic is incorrect
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 }; // Bug: Wrong order, high should be first
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'date') {
        tasks.sort((a, b) => {
            const dateA = new Date(a.dueDate || '9999-12-31');
            const dateB = new Date(b.dueDate || '9999-12-31');
            return dateA - dateB;
        });
    }
    
    renderTasks();
}

function updateCounts() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('count-all').textContent = totalTasks;
    document.getElementById('count-pending').textContent = pendingTasks;
    document.getElementById('count-completed').textContent = completedTasks;
}

function markAllComplete() {
    tasks.forEach(task => {
        task.completed = true;
    });
    renderTasks();
    updateCounts();
}

function deleteCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    updateCounts();
}

function clearAllTasks() {
    function clearAllTasks() {
    // Ask for confirmation before wiping all tasks
    const confirmed = confirm("Are you sure you want to clear ALL tasks? This cannot be undone.");
    if (!confirmed) return;

    tasks = [];
    renderTasks();
    updateCounts();
}

}

// Missing initialization call - Level 1 Bug 1
// Should call updateCounts() on page load
// window.onload = function() {
//     updateCounts();
//     renderTasks();
// };
