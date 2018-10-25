const electron = require('electron');
const readline = require('readline');
const path = require('path');	//路径
const fs = require('fs');		//提供本地文件的读写能力

const ipc = electron.ipcRenderer;	//通讯（发送端）

const cfgPath = path.join(__dirname, 'config');
const v2rPath = path.join(__dirname, 'v2ray/config.json');
const sysConfig = path.join(__dirname, 'sysproxy/config');

const rl = readline.createInterface({input: fs.createReadStream(cfgPath)});

var in_port = null;
var in_protocol = null;
var out_set_vnext_address = null;
var out_set_vnext_port = null;
var out_set_vnext_users_id = null;
var pac = null;

in_port = document.getElementById('in_port');
in_protocol = document.getElementById('protocol_socks');
out_set_vnext_address = document.getElementById('out_set_vnext_address');
out_set_vnext_port = document.getElementById('out_set_vnext_port');
out_set_vnext_users_id = document.getElementById('out_set_vnext_users_id');
pac = document.getElementById('pac');

let flag = true;
let data = null;

function msg(str) {
	ipc.send('asynchronous-message', str);
}

var cnt = 1;
rl.on('line', (input) => {
	switch(cnt) {
		case 1 : in_port.value = input; break;
		case 2 : out_set_vnext_address.value = input; break;
		case 3 : out_set_vnext_port.value = input; break;
		case 4 : out_set_vnext_users_id.value = input; break;
		case 5 : {
			if(input == "true") in_protocol.checked = true;
			else in_protocol.checked = false;
			break;
		}
		case 6 : {
			if(input == "true") pac.checked = true;
			else pac.checked = false;
			break;
		}
	}
	cnt ++;
});

document.getElementById('save').addEventListener('click', function () {
	data = in_port.value;
	
	fs.writeFile(sysConfig , data , 'utf8', function(err) {
		if (err) msg('Can not write config!'), flag = false;
	});

	data += '\n'; data += out_set_vnext_address.value;
	data += '\n'; data += out_set_vnext_port.value;
	data += '\n'; data += out_set_vnext_users_id.value;
	data += '\n'; data += in_protocol.checked;
	data += '\n'; data += pac.checked;
	
	fs.writeFile(cfgPath, data, 'utf8', function(err) {
		if (err) msg('Can not write config!'), flag = false;
	});

	write();

	fs.writeFile(v2rPath, data, 'utf8', function(err) {
		if (err) msg('Can not write config!'), flag = false;
	});
	if (flag == true) ipc.send('clickbegin');
});

function write() {
	data = "\{\n"
	inbound(1);
	outbound(1);
	if(pac.checked == true) {
		outboundDetour(1);
		routing(1);
	}
	data += "\}";
}

function tab(arr) {for(var i = 1 ; i <= arr ; i ++) data += '\t';}

function inbound(arr) {
	tab(arr); data += "\"" + "inbound" + "\"\: \{\n";
	inPort(arr + 1);
	if(in_protocol.checked == 1) {
		inProtocolSocks(arr + 1);
		inDomainOverride(arr + 1);
	}
	else {
		inProtocolhttp(arr + 1);
	}
	inSettings(arr + 1);
	tab(arr); data += "\}\,\n";
}

function inPort(arr) {
	tab(arr);
	data += "\"" + "port" + "\"\: ";
	data += in_port.value;
	data += "\,\n";
}
function inProtocolSocks(arr) {
	tab(arr);
	data += "\"" + "protocol" + "\"\: ";
	data += "\"" + "socks" + "\"";
	data += "\,\n";
}
function inProtocolhttp(arr) {
	tab(arr);
	data += "\"" + "protocol" + "\"\: ";
	data += "\"" + "http" + "\"";
	data += "\,\n";
}
function inDomainOverride(arr) {
	tab(arr);
	data += "\"" + "domainOverride" + "\"\: ";
	data += "\[\"" + "tls" + "\"\,\"" + "http" + "\"\]";
	data += "\,\n";
}
function inSettings(arr) {
	tab(arr); data += "\"" + "settings" + "\"\: \{\n";
	inSetAuth(arr + 1);
	tab(arr); data += "\}\n";
}

function inSetAuth(arr) {
	tab(arr);
	data += "\"" + "auth" + "\"\: ";
	data += "\"" + "noauth" + "\"";
	data += "\n";
}

function outbound(arr) {
	tab(arr); data += "\"" + "outbound" + "\"\: \{\n";
	outProtocol(arr + 1);
	outSettings(arr + 1);
	tab(arr); 
	if(pac.checked == false) data += "\}\n";
	else data += "\}\,\n"
}

function outProtocol(arr) {
	tab(arr);
	data += "\"" + "protocol" + "\"\: ";
	data += "\"" + "vmess" + "\"";
	data += "\,\n";
}
function outSettings(arr) {
	tab(arr); data += "\"" + "settings" + "\"\: \{\n";
	outSetVnext(arr + 1);
	tab(arr); data += "\}\n";
}

function outSetVnext(arr) {
	tab(arr); data += "\"" + "vnext" + "\"\: \[\n";
	tab(arr + 1); data += "\{\n";
	outSetVneAddress(arr + 2);
	outSetVnePort(arr + 2);
	outSetVneUsers(arr + 2);
	tab(arr + 1); data += "\}\n";
	tab(arr); data += "\]\n";
}

function outSetVneAddress(arr) {
	tab(arr);
	data += "\"" + "address" + "\"\: ";
	data += "\"" + out_set_vnext_address.value + "\"";
	data += "\,\n";
}
function outSetVnePort(arr) {
	tab(arr);
	data += "\"" + "port" + "\"\: ";
	data += out_set_vnext_port.value;
	data += "\,\n";
}
function outSetVneUsers(arr) {
	tab(arr); data += "\"" + "users" + "\"\: \[\n";
	tab(arr + 1); data += "\{\n"
	outSetVueUsrId(arr + 2);
	outSetVueUsrAd(arr + 2);
	outSetVueUsrSecurity(arr + 2);
	tab(arr + 1); data += "\}\n"
	tab(arr); data += "\]\n";
}

function outSetVueUsrId(arr) {
	tab(arr);
	data += "\"" + "id" + "\"\: ";
	data += "\"" + out_set_vnext_users_id.value + "\"";
	data += "\,\n";
}
function outSetVueUsrAd(arr) {
	newFunction(arr);
}
function newFunction(arr) {
	tab(arr);
	data += "\"" + "alterId" + "\"\: ";
	data += "64";
	data += "\,\n";
}

function outSetVueUsrSecurity(arr) {
	tab(arr);
	data += "\"" + "security" + "\"\: ";
	data += "\"" + "auto" + "\"";
	data += "\n";
}

function outboundDetour(arr) {
	tab(arr); data += "\"" + "outboundDetour" + "\"\: \[\n";
	tab(arr + 1); data += "\{\n";
	outDetProtocol(arr + 2);
	outDetSettings(arr + 2);
	outDetTag(arr + 2);
	tab(arr + 1); data += "\}\n";
	tab(arr); data += "\]\,\n";
}

function outDetProtocol(arr) {
	tab(arr);
	data += "\"" + "protocol" + "\"\: ";
	data += "\"" + "freedom" + "\"";
	data += "\,\n";
}
function outDetSettings(arr) {
	tab(arr);
	data += "\"settings\"\: ";
	data += "\{\}";
	data += "\,\n";
}
function outDetTag(arr) {
	tab(arr);
	data += "\"" + "tag" + "\"\: ";
	data += "\"" + "direct" + "\"";
	data += "\n";
}

function routing(arr) {
	tab(arr); data += "\"" + "routing" + "\"\: \{\n";
	routStrategy(arr + 1);
	routSettings(arr + 1);
	tab(arr); data += "\}\n";
}

function routStrategy(arr) {
	tab(arr);
	data += "\"" + "strategy" + "\"\: ";
	data += "\"" + "rules" + "\"";
	data += "\,\n";
}

function routSettings(arr) {
	tab(arr); data += "\"" + "settings" + "\"\: \{\n";
	routSetDomainstrategy(arr + 1);
	routSetRules(arr + 1);
	tab(arr); data += "\}\n";
}

function routSetDomainstrategy(arr) {
	tab(arr);
	data += "\"" + "domainStrategy" + "\"\: ";
	data += "\"" + "IPOnDemand" + "\"";
	data += "\,\n";
}

function routSetRules(arr) {
	tab(arr); data += "\"" + "rules" + "\"\: \[\n";
	tab(arr + 1); data += "\{\n";
	routSetRulesField(arr + 2);
	tab(arr + 1); data += "\}\,\n";
	tab(arr + 1); data += "\{\n";
	routSetRulesChinaip(arr + 2);
	tab(arr + 1); data += "\}\n";
	tab(arr); data += "\]\n";
}

function routSetRulesField(arr) {
	tab(arr);
	data += "\"" + "type" + "\"\: ";
	data += "\"" + "field" + "\"";
	data += "\,\n";
	tab(arr);
	data += "\"" + "outboundTag" + "\"\: ";
	data += "\"" + "direct" + "\"";
	data += "\,\n";
	tab(arr);
	data += "\"" + "domain" + "\"\: ";
	data += "\[\"" + "geosite\:cn" + "\"\]";
	data += "\n";
}

function routSetRulesChinaip(arr) {
	tab(arr);
	data += "\"" + "type" + "\"\: ";
	data += "\"" + "chinaip" + "\"";
	data += "\,\n";
	tab(arr);
	data += "\"" + "outboundTag" + "\"\: ";
	data += "\"" + "direct" + "\"";
	data += "\,\n";
	tab(arr);
	data += "\"" + "ip" + "\"\: ";
	data += "\[\"" + "geoip\:cn" + "\"\]";
	data += "\n";
}