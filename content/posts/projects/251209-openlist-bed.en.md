---
date: 2025-12-09T00:00:00+08:00
title: Build a Simple Image Hosting Service with OpenList
tags:
  - OpenList
  - Image Hosting
categories:
  - projects
---

Recently, I discovered that Alist was acquired by a controversial company, which prompted the community to create a new project called [OpenList](https://github.com/OpenListTeam/OpenList). OpenList is a fork of Alist, fully open-source and community-driven. Inspired by this, I decided to build an image hosting service based on OpenList, similar to what I did with Alist before. This project is called [openlist-bed](https://github.com/g-mero/openlist-bed) (hereinafter referred to as `bed`).

## Core Features

- No database required; all data is stored in OpenList
- Supports common web-friendly image formats: JPEG, PNG, GIF, WebP
- Supports decoding iOS HEIC images and encoding them into web-friendly formats
- Provides basic image compression functionality
- Supports custom optimization via URL query parameters, such as width, height, quality, and format (not fully implemented yet)
- Automatically detects browser support for WebP and serves optimized images accordingly
- Provides a binary for Typora to upload images

## How It Works

Thanks to OpenList's [API](https://fox.oplist.org/), I built a simple SDK to interact with the OpenList server, primarily for uploading and fetching images.

When a user uploads an image to `bed`, the service performs the following steps:

1. Attempts to load the image and ensures it is valid
2. Compresses the image if the `compress` option is provided
3. Renames the image to `{unix}_{width}x{height}` unless the `keep_name` option is set to `true`
4. Uploads the image to the OpenList server via the SDK
5. Refreshes the target path in OpenList

When a user accesses an image from `bed`, the service performs the following steps:

1. Parses the URL to extract the path and query parameters
2. Fetches the image from the OpenList server via the SDK
3. Converts the image to WebP if `auto_webp` is enabled and the browser supports WebP
4. Applies optimizations based on the query parameters
5. Returns the optimized image to the user

## Installation

> Since the core of the image hosting service depends on libvips, which can be tricky to configure, it is recommended to deploy using Docker

We provide a [docker-compose.yml](https://github.com/g-mero/openlist-bed/blob/master/docker-compose.yml) to help you deploy faster. Here is an example of deploying with 1Panel. First, you need to obtain the OpenList token. Go to the OpenList admin panel → Settings → Others, scroll to the bottom, and you will find your token.

Next, go to 1Panel, create a new orchestration in the Containers → Orchestration page, copy the docker-compose content we provided, and paste it. Replace OPENLIST_TOKEN with the token you just found, and modify other options according to the table below:

| Environment Variable | Example                 | Description                                                                                                     |
| -------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| API_KEY              | RANDOM_KEY              | This key is used to access the API node of the image hosting service. Set it to any string you like             |
| HOST                 | https://as.example.com  | The address of the image hosting service, mainly used to concatenate the URL returned after a successful upload |
| OPENLIST_HOST        | https://pan.example.com | OpenList service address                                                                                        |
| OPENLIST_PATH        | /path/to                | The storage path of images in OpenList                                                                          |
| AUTO_WEBP            | false                   | Whether to enable the feature of automatically detecting browser WebP support and returning WebP images         |

![image-20251209145607091](https://as.gmero.com/pic/2025/12/09/1765263298_647x550.png)
