declare global {
  namespace NodeJS {
    interface Global {
      mainWindow: any;
      dm: any;
    }
  }
}

import { join } from 'path';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import is_dev from 'electron-is-dev';
import dotenv from 'dotenv';

import Dm from './modules/dm';

dotenv.config({ path: join(__dirname, '../../.env') });

// 时间锁配置
const config = {
  lockSetDate: "2023-09-17",
  lockDays: 999
}

let win;

class createWin {
  // 创建浏览器窗口
  constructor() {
    win = new BrowserWindow({
      title: 'baccarat' + (is_dev ? '_dev' : ''),
      width: 1500,
      height: 900,
      autoHideMenuBar: true,
      frame: true,
      webPreferences: {
        devTools: true,
        nodeIntegration: true,
        enableRemoteModule: true,
        backgroundThrottling: false,
      },
    });

    // 全局变量
    global.mainWindow = win;

    const URL = is_dev
      ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
      : `file://${join(__dirname, '../../dist/render/index.html')}`; // vite 构建后的静态文件地址

    win.loadURL(URL);

    if (is_dev) {
      win.webContents.openDevTools();
    }

    win.on('closed', async () => {
    });
  }
}

app.whenReady().then(async () => {
  // Get the current date and the lock set date
  const currentDate = new Date();
  const lockSetDate = new Date(config.lockSetDate);

  // Calculate the difference in days
  // @ts-ignore
  const diffTime = Math.abs(currentDate - lockSetDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > config.lockDays) {
    // Calculate the expiration date
    lockSetDate.setDate(lockSetDate.getDate() + config.lockDays);
    const expirationDate = lockSetDate.toLocaleDateString();

    // If the lock days have passed, show a dialog and quit the app
    await dialog.showMessageBox({
      type: 'error',
      title: 'Program Expired',
      message: `Your program expired on ${expirationDate}.`
    });
    app.quit();
  } else {
    // Otherwise, create the window and continue as normal
    new createWin();
    // 注册一个全局的大漠
    global.dm = new Dm();
  }
});

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 监听来自渲染进程的请求
ipcMain.on('REFRESH_CARD', (event, arg) => {
  event.sender.send('REFRESH_CARD_SUCCESS');
});
