const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.setMenu(null);
}

function saveState(state) {
  const dataPath = path.join(app.getPath('userData'), 'books.json');
  fs.writeFileSync(dataPath, JSON.stringify(state, null, 2)); // Pretty-print for readability
}

function loadState() {
  const dataPath = path.join(app.getPath('userData'), 'books.json');
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  return null;
}

app.whenReady().then(() => {
  const savedState = loadState();
  if (savedState) {
    mainWindow.webContents.executeJavaScript(`
      window.store.dispatch({ type: 'books/loadState', payload: ${JSON.stringify(savedState)} });
    `).catch(console.error);
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Save state when closing
app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      window.store.getState().then(state => {
        window.ipcRenderer.send('save-state', state);
      });
    `).catch(console.error);
  }
});

// Listen for save-state event from renderer (optional, but we'll simplify)
const { ipcMain } = require('electron');
ipcMain.on('save-state', (event, state) => {
  saveState(state);
});