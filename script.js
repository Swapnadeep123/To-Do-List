document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        const progressContainer = document.querySelector('.progress-container');
        const progressBar = document.querySelector('.progress-bar');
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;

        if (totalTasks > 0) {
            progressContainer.classList.remove('hidden');
        } else {
            progressContainer.classList.add('hidden');
        }

        taskList.innerHTML = '';
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn">&#10003;</button>
                    <button class="edit-btn">&#9998;</button>
                    <button class="delete-btn">&#10005;</button>
                </div>
            `;

            taskItem.querySelector('.task-text').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            taskItem.querySelector('.complete-btn').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            taskItem.querySelector('.edit-btn').addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    tasks[index].text = newText.trim();
                    saveTasks();
                    renderTasks();
                }
            });

            taskItem.querySelector('.delete-btn').addEventListener('click', () => {
                taskItem.classList.add('fade-out');
                setTimeout(() => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                }, 500);
            });

            taskItem.classList.add('slide-in');
            taskList.appendChild(taskItem);
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTaskText = taskInput.value.trim();
        if (newTaskText !== '') {
            tasks.push({ text: newTaskText, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    const allTasksBtn = document.getElementById('all-tasks-btn');
    const activeTasksBtn = document.getElementById('active-tasks-btn');
    const completedTasksBtn = document.getElementById('completed-tasks-btn');

    allTasksBtn.addEventListener('click', () => {
        currentFilter = 'all';
        allTasksBtn.classList.add('active');
        activeTasksBtn.classList.remove('active');
        completedTasksBtn.classList.remove('active');
        renderTasks();
    });

    activeTasksBtn.addEventListener('click', () => {
        currentFilter = 'active';
        allTasksBtn.classList.remove('active');
        activeTasksBtn.classList.add('active');
        completedTasksBtn.classList.remove('active');
        renderTasks();
    });

    completedTasksBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        allTasksBtn.classList.remove('active');
        activeTasksBtn.classList.remove('active');
        completedTasksBtn.classList.add('active');
        renderTasks();
    });

    renderTasks();
});