const { BrowserWindow, ipcMain, TouchBarSlider } = require('electron')
const { model } = require('mongoose')
const Task = require('./models/Task')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'app/assets/img/logo.png',
        autoHideMenuBar: true
    })

    win.loadFile('app/index.html')
}

//Crear nueva tarea
ipcMain.on('new-task', async (e, args) => {
    const newTask = new Task(args);
    const taskSaved = await newTask.save();
    e.reply('new-task-created', JSON.stringify(taskSaved));
});


//Obtener todas las tareas
ipcMain.on('get-tasks', async (e, args) => {
    const tasks = await Task.find();
    e.reply('reply-get-tasks', JSON.stringify(tasks));
});


//Eliminar una tarea
ipcMain.on('delete-task', async (e, args) => {
    const taskDeleted = await Task.findByIdAndDelete(args);
    e.reply('reply-delete-task', JSON.stringify(taskDeleted));
});


//Alterar una tarea
ipcMain.on('update-task', async (e, args) => {
    const updatedTask = await Task.findByIdAndUpdate(args.idTaskToUpdate, {
            name: args.name,
            description: args.description
        }, {new: true});
        e.reply('reply-update-task', JSON.stringify(updatedTask));
});

module.exports = { createWindow }