'use strict';
/* غلاف ويندوز لكتاب «دلوني على السوق»: نافذة واحدة تفتح الكتاب من ملف محلي، دون اتصال. */
const { app, BrowserWindow, Menu, session, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200, height: 900, minWidth: 420, minHeight: 600,
    backgroundColor: '#FBF7EE', title: 'دلوني على السوق', autoHideMenuBar: true,
    icon: path.join(__dirname, 'app', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  // لا تنقّل خارج الكتاب، وأي رابط خارجي يُفتح في المتصفح
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) e.preventDefault(); });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  // الإذن الوحيد الممنوح: الميكروفون للتسجيل
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb, details) => {
    const audioOnly = !details || !details.mediaTypes || details.mediaTypes.every(t => t === 'audio');
    cb(permission === 'media' && audioOnly);
  });
  session.defaultSession.setPermissionCheckHandler((wc, permission) => permission === 'media');
  createWindow();
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => app.quit());
