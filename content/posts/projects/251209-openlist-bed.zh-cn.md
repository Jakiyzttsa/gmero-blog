---
date: 2025-12-09T00:00:00+08:00
draft: true
title: 用 OpenList 搭建一个简单的图床
tags:
  - OpenList
  - 图床
categories:
  - projects
---

最近，我发现 Alist 被一家有争议的公司收购，这促使社区创建了一个名为 [OpenList](https://github.com/OpenListTeam/OpenList) 的新项目。OpenList 是 Alist 的一个分支，完全开源并由社区驱动。受此启发，我决定基于 OpenList 构建一个图床服务，类似于我之前用 Alist 做的项目。这个项目被称为 [openlist-bed](https://github.com/g-mero/openlist-bed)（以下简称 `bed`）。

## 核心功能

- 无需数据库；所有数据存储在 OpenList 中
- 支持常见的网络友好型图片格式：JPEG、PNG、GIF、WebP
- 支持解码 iOS 的 HEIC 图片，并将其编码为网络友好型格式
- 提供基本的图片压缩功能
- 通过 URL 查询参数支持自定义优化，例如宽度、高度、质量和格式（还没有完成）
- 自动检测浏览器对 WebP 的支持，并相应地提供优化后的图片
- 提供二进制用于 Typora 上传图片

## 工作原理

得益于 OpenList 的 [API](https://fox.oplist.org/)，我构建了一个简单的 SDK 来与 OpenList 服务器交互，主要用于上传和获取图片。

当用户将图片上传到 `bed` 时，服务会执行以下步骤：

1. 尝试加载图片，确保其有效
2. 如果提供了 `compress` 选项，则对图片进行压缩
3. 将图片重命名为 `{unix}_{width}x{height}`，除非设置了 `keep_name` 选项为 `true`
4. 通过 SDK 将图片上传到 OpenList 服务器
5. 刷新 OpenList 中的目标路径

当用户从 `bed` 访问图片时，服务会执行以下步骤：

1. 解析 URL 以提取路径和查询参数
2. 通过 SDK 从 OpenList 服务器获取图片
3. 如果启用了 `auto_webp` 且浏览器支持 WebP，则将图片转换为 WebP
4. 根据查询参数应用优化
5. 将优化后的图片返回给用户

## 如何安装

> 由于图床服务核心依赖 libvips，其环境配置比较麻烦，所以这里只推荐使用 Docker 来部署

我们提供了 [docker-compose.yml](https://github.com/g-mero/openlist-bed/blob/master/docker-compose.yml) 来帮助你更快的部署，这里以在 1Panel 部署为例，首先你需要获取 OpenList 的令牌，进入 OpenList 管理后台 → 设置 → 其他，拉到最底下，你就能看到你的令牌了

接下来我们进入 1Panel，在容器 → 编排页面创建编排，复制我们提供的 docker-compose 内容粘贴进去，然后将 OPENLIST_TOKEN 替换为你刚找到的令牌，按照下表修改其他选项

| 环境变量名    | 示例                    | 描述                                                           |
| ------------- | ----------------------- | -------------------------------------------------------------- |
| API_KEY       | RANDOM_KEY              | 这个 KEY 使用来访问图床服务的 API 节点的，设置为你想要的字符串 |
| HOST          | https://as.example.com  | 图床服务的地址，主要是用于拼接上传成功后返回的 url             |
| OPENLIST_HOST | https://pan.example.com | OpenList 服务地址                                              |
| OPENLIST_PATH | /path/to                | 图片在 OpenList 中的存储路径                                   |
| AUTO_WEBP     | false                   | 是否启用自动检测浏览器 webp 支持返回 webp 图片功能             |

![image-20251209145607091](https://as.gmero.com/pic/2025/12/09/1765263298_647x550.png)

## 图片展示

![animate](https://as.gmero.com/pic/2025/12/09/1765262552_426x480.gif "animate")

![sunset](https://as.gmero.com/pic/2025/12/09/1765262587_1920x1280.jpg "sunset")
