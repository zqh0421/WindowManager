// 在主进程中.
const { BrowserWindow } = require('electron')
const path = require('path')

const win = new BrowserWindow({ width: 800, height: 600 })

// Load a remote URL
win.loadURL('http://localhost:8000/')

// Or load a local HTML file
win.loadFile(path.resolve(__dirname, '../../../build/index.html'))