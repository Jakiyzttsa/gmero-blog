---
title: 一次修复 CMake 编译器错误的经历
date: 2026-02-05
tags:
    - CMake
    - C ABI Failed
    - C Compiler Broken
    - 编译错误
---

记录一次困扰了我接近5个小时, 尝试了各种办法——AI, Bing, Stack Overflow 都没有解决，最后发现是工具没卸载干净导致的，我会把关联的可能修复也贴出来，因为我们所遇到的问题不一定完全一样

## 错误详情

![error](https://as.gmero.com/pic/2026/1770282202964_1020x551.png)

报错的关键字：

- Detecting C compiler ABI info - failed
- Check for working C compiler: ... - broken
- C:\Windows\system32\cmd.exe /C ... 系统找不到指定的路径。

如果你同时符合以上三条信息，那么大概率就跟我是同样的问题

你如果只符合前面两条可以尝试：

-  [重装 mingw64 ](https://blog.csdn.net/qq_63771247/article/details/124151219)
- 检查 toolchain 配置

## 解决办法

> 一句话：检查注册表 `HKEY_LOCAL_MACHINE\Software\Microsoft\Command Processor` 和 `HKEY_CURRENT_USER\Software\Microsoft\Command Processor` 是不是有执行无效文件的 AutoRun 项，有就删掉

我是因为之前安装过 `clink` 又卸载了，但是卸载会有注册表残留需要手动清理，这里之所以会困扰我这么长时间，一方面是因为 ai 的误导，另一方面是因为我命令行一直用的 powershell 然后独立运行 gcc 都没有问题，所以就一直没往这方面想。直到凌晨12点，突然感觉这里的 `系统找不到指定的路径` 似曾相识，感觉之前运行其他命令的时候也会突然冒出一句这个，然后孤立测试 `C:\Windows\system32\cmd.exe /C "echo 1"` 发现固定会有这个报错，经过搜索就发现了问题所在

