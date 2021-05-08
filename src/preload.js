const { ipcRenderer, contextBridge, remote } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  action: {
    minimize: () => {
      ipcRenderer.send('window:minimize');
    },
    maximize: () => {
      ipcRenderer.send('window:maximize');
    },
    close: () => {
      ipcRenderer.send('window:close');
    }
  }
});