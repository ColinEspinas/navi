const { ipcMain, BrowserView, BrowserWindow } = require('electron');
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

    this.tabs.push(new Tab(this));
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
        tab.resize(width, height - 39);
      });
    });
  }

}

class Tab {

  /**
   * Tab
   * @param {TabbedWindow} window 
   */
  constructor(window) {
    this.window = window;
    this.view = new BrowserView();
    this.window.addBrowserView(this.view);
    const [width, height] = this.window.getSize();
    this.view.setBounds({ x: 0, y: 39, width: width, height: height - 39});
    this.view.webContents.loadURL('https://google.com');
    this.view.webContents.openDevTools();
  }

  resize(width, height) {
    this.view.setBounds({
      x: this.view.getBounds().x, y: this.view.getBounds().y, width, height,
    });
  }

  show() {
    this.window.addBrowserView(this.view);
  }

  hide() {
    this.window.removeBrowserView(this.view);
  }
  
}