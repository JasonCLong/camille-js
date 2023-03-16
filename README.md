# Camille-js

基于 Frida 的 App 隐私合规检测辅助工具

> 本项目来源于 [zhengjim/camille](https://github.com/zhengjim/camille), 使用 TypeScript 重写只为了更方便二次开发和使用

## 使用

1、Android 真机接入 USB 连接电脑

2、在手机上运行 `frida-server`, 目前有两种方式：
- 需要获得 root 权限，参考 [frida Android](https://frida.re/docs/android/)，（root 设备推荐使用此方式）
- 接入 frida-gadget lib 并重新打包 app，参考[Frida Gadget](https://frida.re/docs/gadget/)

3、安装

```shell
$ pnpm i
```

4、执行测试脚本

```shell
$ pnpm test -- com.android.chrome -f test.xlsx
```

## License

根据 MIT 许可证分发。参阅 LICENSE 查看更多详细信息。

## 参考

[frida](https://frida.re)

#### Android 未获得 Root 权限 运行 fraid-server

https://fadeevab.com/frida-gadget-injection-on-android-no-root-2-methods/
https://lief-project.github.io/doc/latest/tutorials/09_frida_lief.html
https://github.com/kiks7/frida-non-root
https://jlajara.gitlab.io/mobile/2019/05/18/Frida-non-rooted.html
