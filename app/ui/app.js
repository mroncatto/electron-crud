const taskform = document.getElementById("taskform")
const taskname = document.getElementById("taskname")
const taskdescription = document.getElementById("taskdescription")
const tasklist = document.getElementById("tasklist");
const { ipcRenderer } = require('electron')

let tasks = [];

function deleteTask(id){
    console.log(id);
}

function renderTasks(tasks) {
    tasklist.innerHTML = '';
    tasks.map(t => {
        tasklist.innerHTML += `
        <li class="list-group-item" id="${t._id}">
            <img class="img-circle media-object pull-left" src="./assets/img/task-icon.png" width="32" height="32">
            <div class="media-body">
                 <strong>${t.name}</strong>
                 <p>${t.description}</p>
            </div>
            <div class="media-footer">
                <div class="btn-group pull-right">
                    <button class="btn btn-default">
                    <span class="icon icon-pencil"></span>
                    </button>
                    <button onclick="deleteTask('${t._id}')" class="btn btn-default">
                    <span class="icon icon-trash"></span>
                    </button>
                </div>
            </div>
        </li>
        `;
    })
}

taskform.addEventListener('submit', e => {
    e.preventDefault();
    const task = {
        name: taskname.value,
        description: taskdescription.value
    }

    ipcRenderer.send('new-task', task);
    taskform.reset();
});

ipcRenderer.on('new-task-created', (e, args) => {
    const newTask = (JSON.parse(args));
    tasks.push(newTask);
    renderTasks(tasks);
    alert("Tarea creada!");
})

ipcRenderer.send('get-tasks');

ipcRenderer.on('reply-get-tasks', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;
    renderTasks(tasks);
});