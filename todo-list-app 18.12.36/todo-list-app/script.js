/* 
    BUG NOTES (for demonstration):
    1) "historyList" is declared without let/const, making it a global variable.
    2) Off-by-one bug in toggleImportantTask with "index - 1".
    3) Add important task does nothing if the input is empty, 
       but does not alert or show any error (inconsistent with regular tasks).
    4) Potential concurrency issue if save and retrieve are called simultaneously.
*/

// These are arrays for tasks
let taskList = [];
let importantTaskList = [];
let historyList = []; // Fixed: it is now declared with let


// Task Functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();

    if (task === '') {
        alert('Please enter a task.');
        return;
    }

    taskList.push({ text: task, completed: false });
    
    // Only update UI if we're in a browser environment
    if (typeof document !== 'undefined' && document.getElementById('taskList')) {
        taskInput.value = '';
        renderTasks();
        saveTasksToLocalStorage();
    }
}

function toggleTask(index) {
    // Check if the index is valid or not
    if (index < 0 || index >= taskList.length) {
        console.warn("Cannot toggle task: Invalid index", index);
        return; 
    }
    
    taskList[index].completed = !taskList[index].completed;
    
    // Only update UI if we're in a browser environment (not tests)
    if (typeof document !== 'undefined' && document.getElementById('taskList')) {
        renderTasks();
        saveTasksToLocalStorage();
    }
}

function deleteTask(index) {
    taskList.splice(index, 1);
    
    // Only update UI if we're in a browser environment
    if (typeof document !== 'undefined' && document.getElementById('taskList')) {
        renderTasks();
        saveTasksToLocalStorage();
    }
}

/**
 * Archive completed tasks
 */
function archiveCompleted() {
    const completedTasks = taskList.filter(task => task.completed);

    // Mutate historyList in place
    historyList.push(...completedTasks);

    // Remove completed tasks from current list (mutate in place)
    for (let i = taskList.length - 1; i >= 0; i--) {
        if (taskList[i].completed) {
            taskList.splice(i, 1);
        }
    }

    renderTasks();
    renderArchive();
    saveTasksToLocalStorage();
}

// Renders the current tasks in the "Regular Tasks" section
function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    taskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <button class="delete" onclick="deleteTask(${index})">Delete</button>
        `;
        taskListElement.appendChild(li);
    });
}

// -----------------------------
// Important Task Functions
// -----------------------------
function addImportantTask() {
    const taskInput = document.getElementById('importantTaskInput');
    const task = taskInput.value.trim();

    if (task === '') {
        alert('Please enter an important task.'); // Now consistent with addTask()
        return;
    }

    importantTaskList.push({ text: task, completed: false });
    
    // Only update UI if we're in a browser environment
    if (typeof document !== 'undefined' && document.getElementById('importantTaskList')) {
        taskInput.value = '';
        renderImportantTasks();
        saveTasksToLocalStorage();
    }
}

function toggleImportantTask(index) {
    // Check if the index is valid
    if (index < 0 || index >= importantTaskList.length) {
        console.warn("Cannot toggle important task: Invalid index", index);
        return;
    }
    
    importantTaskList[index].completed = !importantTaskList[index].completed;
    
    // Only update UI if we're in a browser environment
    if (typeof document !== 'undefined' && document.getElementById('importantTaskList')) {
        renderImportantTasks();
        saveTasksToLocalStorage();
    }
}

function deleteImportantTask(index) {
    importantTaskList.splice(index, 1);
    renderImportantTasks();
    saveTasksToLocalStorage();
}

function renderImportantTasks() {
    const listElement = document.getElementById('importantTaskList');
    listElement.innerHTML = '';

    importantTaskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <span onclick="toggleImportantTask(${index})">${task.text}</span>
            <button class="delete" onclick="deleteImportantTask(${index})">Delete</button>
        `;
        listElement.appendChild(li);
    });
}

// -----------------------------
// Archive / History
// -----------------------------
function renderArchive() {
    const archiveListElement = document.getElementById('archiveList');
    archiveListElement.innerHTML = '';

    historyList.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.textContent = task.text;
        archiveListElement.appendChild(li);
    });
}

// -----------------------------
// Local Storage (JSON) Functions
// -----------------------------
function saveTasksToLocalStorage() {
    // Potential concurrency bug if called multiple times simultaneously
    const data = {
        tasks: taskList,
        important: importantTaskList,
        history: historyList
    };
    localStorage.setItem('todoData', JSON.stringify(data));
}

function retrieveTasksFromLocalStorage() {
    const savedData = localStorage.getItem('todoData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);

            // Mutate arrays in place to preserve references
            taskList.length = 0;
            importantTaskList.length = 0;
            historyList.length = 0;

            if (Array.isArray(parsed.tasks)) taskList.push(...parsed.tasks);
            if (Array.isArray(parsed.important)) importantTaskList.push(...parsed.important);
            if (Array.isArray(parsed.history)) historyList.push(...parsed.history);

        } catch (e) {
            // If JSON is corrupted, do nothing or handle error
            console.warn('Data in localStorage is invalid JSON');
        }
    }
}

// -----------------------------
// Window Load
// -----------------------------
window.onload = function() {
    // Load tasks from localStorage on page load
    retrieveTasksFromLocalStorage();
    renderTasks();
    renderImportantTasks();
    renderArchive();
};

// -----------------------------
// Exports for Testing
// -----------------------------
if (typeof module !== "undefined") {
    module.exports = {
        addTask,
        archiveCompleted,
        taskList,
        historyList,
        deleteTask,
        toggleTask,
        addImportantTask,
        toggleImportantTask,
        deleteImportantTask,
        importantTaskList
    };
}
