let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const notifications = document.getElementById('notifications');

taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    const newTask = { id: Date.now(), name: taskName, dueDate, priority, completed: false };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskForm.reset();
});

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} - ${task.dueDate} - ${task.priority}`;
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editTask(task.id);
        li.appendChild(editButton);

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Desmarcar' : 'Concluir';
        completeButton.onclick = () => toggleCompletion(task.id);
        li.appendChild(completeButton);

        taskList.appendChild(li);
    });
    
    checkNotifications();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    document.getElementById('taskName').value = task.name;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;

    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function toggleCompletion(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

document.getElementById('filterStatus').addEventListener('click', () => {
    filter = filter === 'all' ? 'completed' : filter === 'completed' ? 'pending' : 'all';
    renderTasks();
});

document.getElementById('filterPriority').addEventListener('click', () => {
    tasks.sort((a, b) => {
        const priorities = { alta: 1, media: 2, baixa: 3 };
        return priorities[a.priority] - priorities[b.priority];
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

function checkNotifications() {
    const now = new Date();
    const upcomingTasks = tasks.filter(task => {
        const due = new Date(task.dueDate);
        return due - now < 24 * 60 * 60 * 1000 && !task.completed; // 24 horas
    });

    notifications.innerHTML = upcomingTasks.length ? 'Tarefas próximas do prazo!' : '';
}

// Carregar tarefas ao iniciar a página
document.addEventListener('DOMContentLoaded', renderTasks);
