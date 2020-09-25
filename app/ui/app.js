const taskform = document.getElementById("taskform")
const taskname = document.getElementById("taskname")
const taskdescription = document.getElementById("taskdescription")
const tasklist = document.getElementById("tasklist");
const saveBtn = document.getElementById("saveBtn");
const btnClear = document.getElementById("btnClear");
const footer = document.getElementById("footer");
const { ipcRenderer } = require('electron')

let tasks = [];
let updatedStatus = false;
let idTaskToUpdate = '';

//Eliminar una tarea
function deleteTask(id) {
    if(updatedStatus){
        return;
    }

    const result = confirm("Estás seguro que deseas eliminar esta tarea?")
    if (result) {
        ipcRenderer.send('delete-task', id);
    }
    return;
}


//Alterar una tarea
function editTask(id) {
    if(updatedStatus){
        return;
    }

    editMode();
    idTaskToUpdate = id;
    const task = tasks.find(task => task._id === id);
    taskname.value = task.name;
    taskdescription.value = task.description;
    taskdescription.focus();
}


//Cancelar edicion/Cadastro
function clearForm(){
    if(updatedStatus){
        regMode();
    }
    taskform.reset();
    
}



//Bloquea botones
function editMode(){
    updatedStatus = true;
    saveBtn.classList.remove('btn-positive');
    saveBtn.classList.add('btn-warning')
    saveBtn.innerText = "ALTERAR";
    btnClear.innerText = "CANCELAR"
}


//Desbloquea botos
function regMode(){
    updatedStatus = false;
    saveBtn.classList.add('btn-positive');
    saveBtn.classList.remove('btn-warning')
    saveBtn.innerText = "SALVAR";
    btnClear.innerText = "LIMPIAR"
}

//Renderiza el listado de tareas
function renderTasks(tasks) {
    tasklist.innerHTML = '';
    footer.innerText = `Total de tareas: ${tasks.length}`;
    tasks.map(t => {
        tasklist.innerHTML += `
        <li class="list-group-item" id="${t._id}">
            <img class="img-circle media-object pull-left" src="./assets/img/task-icon.png" width="32" height="32">
            <div class="media-body">
                 <strong>${t.name}</strong>
                 <p>${t.description}</p>
            </div>
            <div class="media-footer">
                    <button onclick="editTask('${t._id}')" class="btn btn-warning">
                    Editar <span class="icon icon-pencil text-white"></span>
                    </button>
                    <button onclick="deleteTask('${t._id}')" class="btn btn-negative pull-right">
                    Eliminar <span class="icon icon-trash text-white"></span>
                    </button>
            </div>
        </li>
        `;
    })
}

//Captura el submit del formulario y registra o altera una tarea
taskform.addEventListener('submit', e => {
    e.preventDefault();

    //Validaciones simples
    if(taskname.value == ''){
        alert("El campo 'Nombre' es obligatorio!");
        taskname.focus();
        return;
    }

    if(taskdescription.value == ''){
        alert("El campo 'Descripción' es obligaroio!");
        taskdescription.focus();
        return;
    }


    const task = {
        name: taskname.value,
        description: taskdescription.value
    }

    if (!updatedStatus) {
        ipcRenderer.send('new-task', task);
    }else{
        ipcRenderer.send('update-task', {...task, idTaskToUpdate});
    }

    taskform.reset();
});


//Obtiene la respuesta de la tarea creada
ipcRenderer.on('new-task-created', (e, args) => {
    const newTask = (JSON.parse(args));
    tasks.push(newTask);
    renderTasks(tasks);
});

//Lanza el request para obtener todas las tareas
ipcRenderer.send('get-tasks');

//Obtiene la respuesta de la petición con todas las tareas
ipcRenderer.on('reply-get-tasks', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;
    renderTasks(tasks);
});


//Obtiene la respuesta de una tarea eliminada
ipcRenderer.on('reply-delete-task', (e, args) => {
    const taskDeleted = JSON.parse(args);
    tasks = tasks.filter(t => {
        return t._id != taskDeleted._id;
    });
    renderTasks(tasks);
});


//Obtiene la respuesta de una tarea alterada
ipcRenderer.on('reply-update-task', (e, args) => {
    regMode();
    const updatedTask = JSON.parse(args);
    tasks = tasks.map(t => {
        if(t._id === updatedTask._id){
            t.name = updatedTask.name;
            t.description = updatedTask.description;
        }
        return t;
    });
    renderTasks(tasks);
});