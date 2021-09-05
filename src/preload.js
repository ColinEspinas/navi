const { ipcRenderer, contextBridge, remote } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  actions: {
    minimize: () => {
      ipcRenderer.send('window:minimize');
    },
    maximize: () => {
      ipcRenderer.send('window:maximize');
    },
    close: () => {
      ipcRenderer.send('window:close');
    },
    addTab: async (url) => {
      return ipcRenderer.invoke('tabs:add', { url });
    },
    switchTab: async (index) => {
      return ipcRenderer.invoke('tabs:switch', { index });
    },
    closeTab: async (index) => {
      return ipcRenderer.invoke('tabs:close', { index });
    },
    tabGoBack: async () => {
      return ipcRenderer.invoke('tabs:back');
    },
    tabGoForward: async () => {
      return ipcRenderer.invoke('tabs:forward');
    },
    reloadTab: async () => {
      return ipcRenderer.invoke('tabs:reload');
    }
  },
  getters: {
    tabs: async () => {
      return ipcRenderer.invoke('tabs:get');
    },
    activeTab: async () => {
      return ipcRenderer.invoke('tabs:active');
    },
  },
  listeners: {
    tabUpdate: (callback) => {
      ipcRenderer.on('tabs:update', callback);
    },
  },
});