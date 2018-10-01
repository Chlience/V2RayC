const electron = require('electron');
const path = require('path');

const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const spawn = require('child_process').spawn;

const coreWin32 = path.join(__dirname, 'v2ray/wv2ray.exe');

var win = null;
var tray = null;

function message(str) {
	const options = {
		type: 'info',
		title: '提示',
		message: str,
		buttons: ['好的']
	}
	dialog.showMessageBox(options);
}

ipc.on('asynchronous-message', (event, arg) => {
	message(arg);
})

function win_hide() {
	win.hide(); 
	win.setSkipTaskbar(true);
}

ipc.on('clickbegin', () => {
	win_hide();
})

function CreateWindow() {
	const thewins = {
		width: 400,//宽
		height: 700,//高
		frame: false,//无框
		resizable: false,//是否可以调整窗口大小
		title: 'V2RayC',//页面标题
		icon: path.join(__dirname , 'img' , 'i64.png')//图标
	}
	win = new BrowserWindow(thewins);//新建一个窗口
	win.loadURL('file://' + __dirname + '/index.html');
//	win.webContents.openDevTools();//调试信息
	win.on('close', (event) => { 
		win.hide();
		win.setSkipTaskbar(true);
		event.preventDefault();//禁止关闭行为，否则还是结束了
	});
	win.on('closed', () => {win = null;});//关闭了窗口则将对应渲染进程清空
}

var aut = null;
var prc = null;

const template = [
	{
		label: '操作',
		submenu: [
			{
				label: '连接',
				type: 'radio',
				checked: aut == 1 ? true : false,
				click: () => {
					if (prc == null) {
						if (process.platform == 'linux') {
							//记住要先检测是否有 v2ray
							//因为只能用 service 所以需要调用脚本
						}
						else
							prc = spawn(coreWin32);
					}
				}
			},
			{
				label: '断开',
				type: 'radio',
				checked: aut == 1 ? false : true,
				click: () => {
					if (prc != null) prc.kill();
					prc = null;
				}
			}
		]
	},
	{
		label: '配置', click: () => {
			win.show();
			win.setSkipTaskbar(false);
		}
	},
	{
		label: '隐藏', click: () => {
			win_hide();
		}
	},
	{
		label: '退出', click: () => {
			win.destroy();
			app.quit();
		}
	}
]

function CreateTray() {
	const contextMenu = Menu.buildFromTemplate(template);
	tray = new Tray(path.join(__dirname , 'img' , 'i16.png'));
	tray.setToolTip('V2RayC');
	tray.setContextMenu(contextMenu);
	
	tray.setHighlightMode('always');
	tray.on('click', () => {
		if(!win.isVisible()) {
			win.show();
			win.setSkipTaskbar(false);
		}
	})
}
//
app.once('ready', CreateWindow);
app.once('ready', CreateTray);