const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getCustomers: () => ipcRenderer.invoke('get-customers'),
  getItems: () => ipcRenderer.invoke('get-items'),
  saveTransaction: (customerId, cart) => ipcRenderer.invoke('save-transaction', customerId, cart),
});
