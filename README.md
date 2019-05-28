# V2RayC

![](https://github.com/Chlience/V2RayC/blob/master/img/head.png?raw=true)

> 一个基于 Electron 的 V2Ray 图形客户端

当前版本：v1.0.5

> 由于某些原因，暂时停止更新，请使用其他软件

## 截图

[![](https://i.loli.net/2018/10/15/5bc438085ff11.png)](https://i.loli.net/2018/10/15/5bc438085ff11.png)

## 主要用途

* 配置 `config.json`
* 方便的开启/关闭 `V2Ray` 服务
* 方便的开启/关闭 代理

## 安装

在 `Releases` 中下载最新的自己系统对应的安装包

解压到你喜欢的位置即可

现阶段支持

* Windows 64

## 如何使用

### Windows
双击文件夹中 `V2RayC.exe`

在弹出窗口中填好配置文件

选择 `开始摇滚吧`

接下来窗口会自动隐藏

紧接着请找到系统托盘处图标

右键，选择 `操作` / `连接`

这时，代理成功开启

如需关闭：右键，选择 `操作` / `断开`，将会断开代理，但不会关闭应用程序

或者直接：右键，选择 `退出`，将会断开代理，并关闭应用程序

**新功能：**

选择 **系统代理** （前提：使用 http 协议 ，即可直接代理浏览器）

自动开启 PAC ，可手动关闭（通过 V2Ray-core 内置路由功能实现）

请不要在开启代理的时候写入配置，这将不会生效，请关闭代理后修改配置

## 进阶配置
如果你想要代理所有软件或者自己配置 PAC 的话

1. 下载 `SwitchyOmega` 来控制代理，做到墙内直连，墙外代理

2. 转到 [Proxifier 使用教程](https://chlience.com/archives/634) 以进行应用分别代理配置

## 鸣谢
感谢 [konnyakuxzy](https://github.com/konnyakuxzy) 对本应用的出现做出的巨大贡献

感谢 [V2Ray 团队](https://github.com/v2ray) 为我们构建出了如此优秀的工具

感谢 [Noisyfox](https://github.com/Noisyfox) 所编写的 `sysproxy` 以及提供的支持

没有他们，就没有 V2RayC 的诞生

### 打赏
如果你觉得这个应用不错， Star 一下就是对作者最大的鼓励

谢谢~
