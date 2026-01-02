const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getCustomers: () => ipcRenderer.invoke("get-customers"),
  getItems: () => ipcRenderer.invoke("get-items"),
  saveTransaction: (customerId, cart, status = "paid",total) =>
    ipcRenderer.invoke("save-transaction", customerId, cart, status,total),

  getTransactions: () => ipcRenderer.invoke("get-transactions"),

});

contextBridge.exposeInMainWorld("electron", {
  onWindowFocus: (callback) =>
    ipcRenderer.on("electron-window-focused", callback),
});



// 2-1-2026
// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('api', {
//   getCustomers: () => ipcRenderer.invoke('get-customers'),
//   getItems: () => ipcRenderer.invoke('get-items'),
//   saveTransaction: (customerId, cart, status = 'paid') =>
//     ipcRenderer.invoke('save-transaction', customerId, cart, status),
// });






// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('api', {
//   getCustomers: () => ipcRenderer.invoke('get-customers'),
//   getItems: () => ipcRenderer.invoke('get-items'),
//   saveTransaction: (customerId, cart) => ipcRenderer.invoke('save-transaction', customerId, cart),
// });
