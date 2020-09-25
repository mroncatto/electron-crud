const { BrowserWindow, ipcMain } = require('electron')
const { model } = require('mongoose')
const Task = require('./models/Task')

const task = require('./models/Task')

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

ipcMain.on('new-task', async (e, args) => {
    const newTask = new Task(args);
    const taskSaved = await newTask.save();
    console.log(taskSaved);
    e.reply('new-task-created', JSON.stringify(taskSaved));
});

ipcMain.on('get-tasks', async (e, args) => {
    const tasks = await Task.find();
    e.reply('reply-get-tasks', JSON.stringify(tasks));
});

module.exports = { createWindow }