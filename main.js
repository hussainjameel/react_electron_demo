const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

let mainWindow;

// process.env.DEBUG = '*';
function createWindow() {
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  if (isDev) {
    // Development: Load from React dev server
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    mainWindow.webContents.openDevTools();
    
    // Start your Express server
    require('./server'); 
  } else {
    // Production: Load built files
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    
    // Start your Express server in production
    require(path.join(process.resourcesPath, 'server.js'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});