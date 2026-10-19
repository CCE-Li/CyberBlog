---
title: "Quick-SSH"
date: 2026-06-16
description: "跨平台 SSH 连接管理器，提供 TUI 界面与 Docker 风格 CLI，基于 Rust 实现，无需额外运行时。"
icon: "fa-solid fa-network-wired"
accent: "cyan"
status: "active"
tags: ["rust", "ssh", "tui", "cli"]
projectUrl: "https://github.com/CCE-Li/Quick-SSH"
draft: false
---

**Quick-SSH** 是一个用 Rust 编写的跨平台 SSH 连接管理器，目标是把频繁的 SSH 连接操作压缩到几次按键之内。

它同时提供两种使用方式：

- **TUI 界面**：直接运行 `qssh`，从 `~/.ssh/config` 读取主机列表，支持搜索、标记、Ping 检测、增删改主机。
- **Docker 风格 CLI**：`qssh ps` 列出主机、`qssh mysrv` 一键连接、`qssh rm` 删除，另有 `export` / `import` 用于迁移配置。

几个比较实用的细节：

- 连接信息统一保存在标准 OpenSSH 格式的 `~/.ssh/config` 中，不影响文件里已有的其他配置。
- 需要密码登录时，可以把密码存进系统凭据库（Windows Credential Manager、macOS Keychain、Linux Secret Service / keyutils），不会明文写进配置文件。
- SSH 连接后把本地文件拖进终端窗口，就会自动开新窗口走 SFTP 上传，显示单文件与总进度。

安装可以通过 Scoop 或 AUR 直接完成，也可以从 Release 下载预编译二进制；源码构建只需要 Rust 工具链，`cargo build --release` 即可。
