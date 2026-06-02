const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    title: 'CF IP Scanner',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    // آیکون برنامه
    icon: path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png')
  })

  win.loadFile('cf-ip-scanner.html')

  // منوی ساده
  const menu = Menu.buildFromTemplate([
    {
      label: 'برنامه',
      submenu: [
        { label: 'درباره CF IP Scanner', click: () => {
          const { dialog } = require('electron')
          dialog.showMessageBox(win, {
            title: 'درباره',
            message: 'CF IP Scanner v2.0',
            detail: 'اسکنر IP های تمیز Cloudflare\nساخته شده با Electron\nلایسنس: MIT'
          })
        }},
        { type: 'separator' },
        { label: 'خروج', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'ویرایش',
      submenu: [
        { label: 'کپی', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'چسباندن', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'انتخاب همه', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: 'نمایش',
      submenu: [
        { label: 'بارگذاری مجدد', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'تمام صفحه', accelerator: 'F11', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'ابزار توسعه‌دهنده', accelerator: 'F12', role: 'toggleDevTools' }
      ]
    },
    {
      label: 'راهنما',
      submenu: [
        { label: 'صفحه GitHub', click: () => shell.openExternal('https://github.com/your-username/cf-ip-scanner') },
        { label: 'گزارش باگ', click: () => shell.openExternal('https://github.com/your-username/cf-ip-scanner/issues') }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
