const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getCustomers, getItems, saveTransaction, getTransactions  } = require('./database');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    show: false, // hide until ready to prevent focus flicker
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false, // ensures smooth timers and inputs
    },
  });

  // Prevent Chromium modal dialogs from breaking focus
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  // Load your Next.js app
  win.loadURL('http://localhost:3000');

  // Show window when ready
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // Restore focus whenever window regains OS focus
  win.on('focus', () => {
    win.webContents.send('electron-window-focused');
  });
}

// IPC handlers
ipcMain.handle('get-customers', async () => getCustomers());
ipcMain.handle('get-items', async () => getItems());

// Save transaction — accepts status argument
ipcMain.handle('save-transaction', async (event, customerId, cart, status = 'paid', total) => {
  try {
    const result = saveTransaction(customerId, cart, status,total);
    return result;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
});

ipcMain.handle("get-transactions", async () => {
  return getTransactions();
});

// App ready
app.whenReady().then(() => {
  // Optional: prevent focus issues on Chromium
  app.commandLine.appendSwitch('disable-site-isolation-trials');
  app.commandLine.appendSwitch('disable-features', 'CrossSiteDocumentBlockingIfIsolating');

  createWindow();
});

// Quit when all windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Reopen window on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});





// 2-1-2026
// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');
// const { getCustomers, getItems, saveTransaction } = require('./database');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1280,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   });

//   win.loadURL('http://localhost:3000');
// }

// ipcMain.handle('get-customers', async () => getCustomers());
// ipcMain.handle('get-items', async () => getItems());

// // Save transaction — accept status argument
// ipcMain.handle('save-transaction', async (event, customerId, cart, status = 'paid') => {
//   try {
//     const result = saveTransaction(customerId, cart, status);
//     return result;
//   } catch (err) {
//     console.error(err);
//     return { error: err.message };
//   }
// });

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) createWindow();
// });




// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');
// const { getCustomers, getItems, saveTransaction } = require('./database');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1280,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     }
//   });

//   win.loadURL('http://localhost:3000'); // Next.js dev server
// }

// // IPC handlers
// ipcMain.handle('get-customers', async () => getCustomers());
// ipcMain.handle('get-items', async () => getItems());
// ipcMain.handle('save-transaction', async (event, customerId, cart) => saveTransaction(customerId, cart));

// app.whenReady().then(createWindow);
