const electron = require('electron');
const readline = require('readline');
const path = require('path');	//路径
const fs = require('fs');		//提供本地文件的读写能力

const ipc = electron.ipcRenderer;	//通讯（发送端）

const cfgPath = path.join(__dirname, 'config');
const v2rPath = path.join(__dirname, 'v2ray/config.json');

const rl = readline.createInterface({input: fs.createReadStream(cfgPath)});

var in_port = null;
var out_set_vnext_address = null;
var out_set_vnext_port = null;
var out_set_vnext_users_id = null;

in_port = document.getElementById('in_port');
out_set_vnext_address = document.getElementById('out_set_vnext_address');
out_set_vnext_port = document.getElementById('out_set_vnext_port');
out_set_vnext_users_id = document.getElementById('out_set_vnext_users_id');

let flag = true;
let data = null;

function msg(str) {
	ipc.send('asynchronous-message', str);
}

document.getElementById('clickbegin').addEventListener('click', function () {
	ipc.send('clickbegin');
})

var cnt = 1;
rl.on('line', (input) => {
	switch(cnt) {
		case 1 : in_port.value = input; break;
		case 2 : out_set_vnext_address.value = input; break;
		case 3 : out_set_vnext_port.value = input; break;
		case 4 : out_set_vnext_users_id.value = input; break;
	}
	cnt ++;
});

document.getElementById('save').addEventListener('click', function () {
	data = in_port.value; data += '\n'
	data += out_set_vnext_address.value; data += '\n'
	data += out_set_vnext_port.value; data += '\n'
	data += out_set_vnext_users_id.value; data += '\n'
	
	fs.writeFile(cfgPath, data, 'utf8', function(err) {
		if (err) msg('Can not write config!'), flag = false;
	});

	write();

	fs.writeFile(v2rPath, data, 'utf8', function(err) {
		if (err) msg('Can not write config!'), flag = false;
	});

	if (flag == true) msg('保存配置成功');
});

function write() {
	data = "\{\n"
	inbound(1);
	outbound(1);
	data += "\}";
}

function tab(arr) {for(var i = 1 ; i <= arr ; i ++) data += '\t';}

function inbound(arr) {
	tab(arr); data += "\"inbound\"\: \{\n";
	inPort(arr + 1);
	inProtocol(arr + 1);
	inDomainOverride(arr + 1);
	inSettings(arr + 1);
	tab(arr); data += "\}\,\n";
}

function inPort(arr) {
	tab(arr);
	data += "\"port\"\: ";
	data += in_port.value;
	data += "\,\n";
}
function inProtocol(arr) {
	tab(arr);
	data += "\"protocol\"\: ";
	data += "\"socks\"";
	data += "\,\n";
}
function inDomainOverride(arr) {
	tab(arr);
	data += "\"domainOverride\"\: ";
	data += "\[\"tls\"\,\"http\"\]";
	data += "\,\n";
}
function inSettings(arr) {
	tab(arr); data += "\"settings\"\: \{\n";
	inSetAuth(arr + 1);
	tab(arr); data += "\}\n";
}

function inSetAuth(arr) {
	tab(arr);
	data += "\"auth\"\: ";
	data += "\"" + "noauth" + "\"";
	data += "\n";
}

function outbound(arr) {
	tab(arr); data += "\"outbound\"\: \{\n";
	outProtocol(arr + 1);
	outSettings(arr + 1);
	tab(arr); data += "\}\n";
}


function outProtocol(arr) {
	tab(arr);
	data += "\"protocol\"\: ";
	data += "\"" + "vmess" + "\"";
	data += "\,\n";
}
function outSettings(arr) {
	tab(arr); data += "\"settings\"\: \{\n";
	outSetVnext(arr + 1);
	tab(arr); data += "\}\n";
}

function outSetVnext(arr) {
	tab(arr); data += "\"vnext\"\: \[\n";
	tab(arr + 1); data += "\{\n";
	outSetVneAddress(arr + 2);
	outSetVnePort(arr + 2);
	outSetVneUsers(arr + 2);
	tab(arr + 1); data += "\}\n";
	tab(arr); data += "\]\n";
}

function outSetVneAddress(arr) {
	tab(arr);
	data += "\"address\"\: ";
	data += "\"" + out_set_vnext_address.value + "\"";
	data += "\,\n";
}
function outSetVnePort(arr) {
	tab(arr);
	data += "\"port\"\: ";
	data += out_set_vnext_port.value;
	data += "\,\n";
}
function outSetVneUsers(arr) {
	tab(arr); data += "\"users\"\: \[\n";
	tab(arr + 1); data += "\{\n"
	outSetVueUsrId(arr + 2);
	outSetVueUsrAd(arr + 2);
	tab(arr + 1); data += "\}\n"
	tab(arr); data += "\]\n";
}

function outSetVueUsrId(arr) {
	tab(arr);
	data += "\"id\"\: ";
	data += "\"" + out_set_vnext_users_id.value + "\"";
	data += "\,\n";
}
function outSetVueUsrAd(arr) {
	tab(arr);
	data += "\"alterId\"\: ";
	data += "64";
	data += "\n";
}