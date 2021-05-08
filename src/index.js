const { app, BrowserWindow, BrowserView } = require('electron');
const path = require('path');

const { TabbedWindow } = require('./windows');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {

  // Create the browser window.
  const win = new TabbedWindow({
    width: 800,
    height: 600,
    openDevToolsOnInit: true,
  });

  // const win = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  // });

  // const view = new BrowserView();
  // win.setBrowserView(view);
  // const [width, height] = win.getContentSize();
  // view.setBounds({ x: 0, y: 0, width: width, height: height});
  // view.setAutoResize({ width: true, height: true });

  // const [width, height] = this.window.getSize()
  // this.view.setBounds({ x: 0, y: toolbarHeight, width: width, height: height - toolbarHeight })
  // this.view.setAutoResize({ width: true, height: true })

  // view.webContents.loadURL('https://electronjs.org');

  // and load the index.html of the app.
  // win.loadFile(path.join(__dirname, '../static/index.html'));

  // view.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
