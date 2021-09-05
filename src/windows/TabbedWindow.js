const { ipcMain, ipcRenderer, BrowserView, BrowserWindow } = require('electron');
const path = require('path');

const Window = require('./Window');

module.exports = class TabbedWindow extends Window {

  /**
   * An object passed to the Window class constructor to define its options.
   * @typedef {Object} WindowOptions
   * @property {number} height - Window's height in pixels. Default is `600`.
   * @property {number} minHeight - Window's minimum height. Default is `0`.
   * @property {number} maxHeight - Window's maximum height. Default is no limit.
   * @property {number} width - Window's width in pixels. Default is `800`.
   * @property {number} minWidth - Window's minimum width. Default is `0`.
   * @property {number} maxWidth - Window's maximum width. Default is no limit.
   * @property {Electron.WebPreferences} webPreferences - Settings of web page's features.
   * 
   * @property {boolean} topBar - Wether the window has a top-bar. Default is `true`.
   */

  /**
   * TabbedWindow
   * @param {WindowOptions} [options]
   */
  constructor(options) {
    super(options);

    this.tabs = [];
    this.activeTab = 0;

    this.titleBarHeight = 49;

    // this.addTab();
  }

  __init(options) {
    this.loadFile(path.join(__dirname, '../../static/tabbed-window.html'));
    if (options.openDevToolsOnInit) this.webContents.openDevTools();
  }

  __events() {
    super.__events();

    this.on('resize', () => {
      const [width, height] = this.getContentSize();
      this.tabs.map(tab => {
        tab.resize(width, height);
      });
    });

    ipcMain.handle('tabs:add', async (event, { url }) => {
      if (event.sender.id === this.webContents.id) {
        await this.addTab(url);
        this.indexTabs();
      }
    });

    ipcMain.handle('tabs:switch', async (event, { index }) => {
      if (event.sender.id === this.webContents.id) {
        this.setActiveTab(index);
      }
    });

    ipcMain.handle('tabs:close', async (event, { index }) => {
      if (event.sender.id === this.webContents.id) {
        this.tabs[index].hide();
        this.tabs[index].view.webContents.destroy();
        this.tabs.splice(index, 1);
        if (this.activeTab === index && index < this.tabs.length) this.setActiveTab(index + 1);
        else if (this.activeTab === index) this.setActiveTab(this.tabs.length - 1);
        this.indexTabs();
        if (index < this.activeTab) this.setActiveTab(this.activeTab - 1);
      }
    });

    ipcMain.handle('tabs:get', async (event) => {
      if (event.sender.id === this.webContents.id) {
        return this.tabs.map((tab) => ({ 
          title: tab.view.webContents.getTitle(),
          url: tab.view.webContents.getURL(),
        }));
      }
    });

    ipcMain.handle('tabs:active', async (event) => {
      if (event.sender.id === this.webContents.id) {
        return this.activeTab;
      }
    });

    ipcMain.handle('tabs:back', async (event) => {
      if (event.sender.id === this.webContents.id) {
        this.tabs[this.activeTab]?.view.webContents.goBack();
      }
    });

    ipcMain.handle('tabs:forward', async (event) => {
      if (event.sender.id === this.webContents.id) {
        this.tabs[this.activeTab]?.view.webContents.goForward();
      }
    });

    ipcMain.handle('tabs:reload', async (event) => {
      if (event.sender.id === this.webContents.id) {
        this.tabs[this.activeTab]?.view.webContents.reload();
      }
    });
  }

  async addTab(url) {
    let tab = new Tab(this, this.tabs.length);
    
    let newLength = this.tabs.push(tab);
    this.setActiveTab(newLength - 1);

    if (url) await tab.navigate(url);
    else await tab.navigate('file://../../static/new-tab.html');
  }

  setActiveTab(index) {
    this.tabs[this.activeTab]?.hide();
    this.activeTab = index;
    this.tabs[this.activeTab]?.show();
  }

  indexTabs() {
    for(const [index, tab] of this.tabs.entries()) {
      tab.index = index;
    }
  }

}

class Tab {

  /**
   * Tab
   * @param {TabbedWindow} window 
   */
  constructor(window, index, url) {
    this.window = window;
    this.index = index;
    this.view = new BrowserView();
    this.show();
    const [width, height] = this.window.getContentSize();
    this.view.setBounds({ x: 0, y: this.window.titleBarHeight, width: width, height: height - this.window.titleBarHeight});

    this.__events();
    // Tab information
    // this.title = this.view.webContents.getTitle();
    // this.url = this.view.webContents.getURL();

    // this.view.webContents.loadURL('https://google.com');
    // this.view.webContents.openDevTools();
  }

  __events() {
    this.view.webContents.on('did-navigate', (event, url, response, status)=> {
      this.window.webContents.send('tabs:update', {
        type: 'navigation-done',
        index: this.index,
        data: {
          title: this.view.webContents.getTitle(),
          url,
          response,
          status,
          agent: this.view.webContents.getUserAgent(),
        }
      });
    });
    this.view.webContents.on('did-navigate-in-page', (event, url)=> {
      this.window.webContents.send('tabs:update', {
        type: 'in-page-navigation-done',
        index: this.index,
        data: {
          title: this.view.webContents.getTitle(),
          url,
          agent: this.view.webContents.getUserAgent(),
        }
      });
    });
    this.view.webContents.on('page-title-updated', (event, title) => {
      this.window.webContents.send('tabs:update', {
        type: 'title-update',
        index: this.index,
        data: {
          title
        }
      });
    });
    this.view.webContents.on('page-favicon-updated', (event, favicons) => {
      this.window.webContents.send('tabs:update', {
        type: 'favicon-update',
        index: this.index,
        data: {
          favicons
        }
      });
    });
  }

  resize(width, height) {
    this.view.setBounds({
      x: this.view.getBounds().x, 
      y: this.view.getBounds().y, 
      width, 
      height: height - this.window.titleBarHeight,
    });
  }

  show() {
    this.window.setBrowserView(this.view);
    this.view.webContents.focus();
  }

  hide() {
    this.window.removeBrowserView(this.view);
  }
  
  /**
   * Navigate to URL
   * @param {String} url 
   */
  async navigate(url) {
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return await this.view.webContents.loadURL(url);
      }
      else if (url.startsWith('file://')) {
        return await this.view.webContents.loadFile(path.join(__dirname, url.replace('file://', '')));
      }
    }
  }

}