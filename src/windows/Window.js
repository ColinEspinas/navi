const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

module.exports = class Window extends BrowserWindow {

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
   * Window
   * @param {WindowOptions} [options]
   */
  constructor(options) {
    super({
      height: options.height || 600,
      minHeight: options.minHeight || 0,
      maxHeight: options.maxHeight,
      width: options.width || 800,
      minWidth: options.minWidth || 0,
      maxWidth: options.maxWidth,
      frame: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload.js'),
        ...options.webPreferences,
      },
    });

    // Removing menu if not already removed.
    this.removeMenu();

    // Initialize window's DOM.
    this.__init(options);
    
    // Initialize window common events
    this.__events();
  }

  __init(options) {
    this.loadFile(path.join(__dirname, options.viewFile || '../../static/index.html'));
    if (options.openDevToolsOnInit) this.webContents.openDevTools();
  }

  __events() {
    this.once('ready-to-show', () => {
      this.show();
    });

    // On window close
    ipcMain.on('window:close', (event) => {
      if (event.sender.id === this.webContents.id) {
        this.close();
      }
    });

    ipcMain.on('window:maximize', (event) => {
      if (event.sender.id === this.webContents.id) {
        if (this.isMaximized()) this.unmaximize();
        else this.maximize();
      }
    });

    ipcMain.on('window:minimize', (event) => {
      if (event.sender.id === this.webContents.id) {
        this.minimize();
      }
    });
  }

}