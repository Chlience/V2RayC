const electron = require('electron');
const path = require('path');
const fs = require('fs');

const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const spawn = require('child_process').spawn;

const coreWin32 = path.join(__dirname, 'v2ray/wv2ray.exe');
const sysproxy = path.join(__dirname, 'sysproxy/sysproxy.exe');
const autoPath = path.join(__dirname, 'auto');

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
		width: 370,//宽
		height: 700,//高
		frame: false,//无框
		resizable: false,//是否可以调整窗口大小
		title: 'V2RayC',//页面标题
		icon: path.join(__dirname , 'img' , 'i64.png')//图标
	}
	win = new BrowserWindow(thewins);//新建一个窗口
	if(aut == 1) win.hide();
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
var sys = 0;
var proxy = null;

aut = parseInt(fs.readFileSync(autoPath, 'utf-8'));

const template = [
	{
		label: '操作',
		submenu: [
			{
				label: '连接',
				type: 'radio',
				checked: aut == 1 ? true : false,
				click: () => {
					if (prc == null) prc = spawn(coreWin32);
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
		label: '自动连接',
		type : 'checkbox',
		checked : aut == 1 ? true : false,
		click: () => {
			if (aut == 1) aut = 0;
			else aut = 1;
			fs.writeFile(autoPath, aut.toString(), 'utf-8', function (err){
				if (err) message('Can not write auto.conf!');
			});
		}
	},
	{
		label: '系统代理',
		type : 'checkbox',
		checked : sys == 1 ? true : false,
		click: () => {
			if(sys == 1) {
				sys = 0;
				proxy = spawn(sysproxy , ['set' , '9']);
				proxy = null;
			}
			else {
				sys = 1;
				proxy = spawn(sysproxy , ['set' , '2']);
				proxy = null;
			}
		}
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
			proxy = spawn(sysproxy , ['set' , '9']);
			proxy.on('exit' , ()=> {
				win.destroy();
				app.quit();
			})
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

if(aut == 1) prc = spawn(coreWin32);
app.once('ready', CreateTray);
app.once('ready', CreateWindow);