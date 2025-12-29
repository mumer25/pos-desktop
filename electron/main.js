const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getCustomers, getItems, saveTransaction } = require('./database');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadURL('http://localhost:3000'); // Next.js dev server
}

// IPC handlers
ipcMain.handle('get-customers', async () => getCustomers());
ipcMain.handle('get-items', async () => getItems());
ipcMain.handle('save-transaction', async (event, customerId, cart) => saveTransaction(customerId, cart));

app.whenReady().then(createWindow);
