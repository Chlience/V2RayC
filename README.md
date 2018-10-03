# V2RayC
![](https://github.com/Chlience/V2RayC/blob/master/img/head.png?raw=true)

> 一个基于 Electron 的 V2Ray 图形客户端

## 主要用途

* 配置 `config.json`
* 方便的开启/关闭 `V2Ray` 服务

## 安装

在 `Releases` 中下载最新的自己系统对应的安装包

解压到你喜欢的位置即可

现阶段支持

* Windows 64位
* Linux 64位（假的）

## 如何使用

### Windows
双击文件夹中 `V2RayC.exe`

在弹出窗口中填好配置文件

选择 `保存配置`

选择 `开始摇滚吧`

接下来窗口会自动隐藏

紧接着请找到系统托盘处图标

右键，选择 `操作` / `连接`

这时，代理成功开启

如需关闭：右键，选择 `操作` / `断开`，将会断开代理，但不会关闭应用程序

或者直接：右键，选择 `退出`，将会断开代理，并关闭应用程序

请不要在开启代理的时候写入配置，这将不会生效，请关闭代理后修改配置

### Linux
你都用 Linux 了还用图形化客户端？

想多了，自己写去

## 代理配置
发现在配置完一切之后，貌似还是上不了谷歌？
那是因为虽然开启了 Socks5代理 但是你的浏览器并没有走 Socks5通道

有两种方案解决

1. 下载 Chrome 浏览器（别的不保证能用），右键桌面快捷方式，在 `目标` 文本框中最后面加入 一个 `空格` ，然后加上 `--proxy-server="socks5://127.0.0.1:1080"`。重新从快捷启动 Chrome 就可以啦
这个时候可以下载一个 `SwitchyOmega` 来控制代理，请自行 谷歌

2. 转到 [Proxifier 使用教程](https://chlience.com/archives/634)

## 鸣谢
感谢 [konnyakuxzy](https://github.com/konnyakuxzy) 对本应用的出现做出的巨大贡献

感谢 [V2Ray 团队](https://github.com/v2ray) 为我们构建出了如此优秀的工具

没有他们，就没有 V2RayC 的诞生

### 打赏
微信：寻找作者微信中（未找到）

支付宝：没有

如果你觉得这个应用不错， Star 一下就是对作者最大的鼓励

谢谢~