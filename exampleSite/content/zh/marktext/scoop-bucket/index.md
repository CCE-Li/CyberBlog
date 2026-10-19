---
title: "Scoop Bucket：从创建到自动发布"
date: 2026-07-06
lastmod: 2026-07-06
description: "Manifest 字段逐项拆解，404、Hash 不匹配、找不到 exe 这些坑的成因与修复方式。"
group: "版本控制与 CI"
weight: 10
tags: ["Scoop", "Windows", "打包发布"]
categories: ["开发"]
isNote: true
---

## 什么是 Scoop Bucket

Scoop 用 **Bucket（软件仓库）** 管理软件，它本质上就是一个 Git 仓库。

| 包管理器 | 软件仓库 |
| --- | --- |
| apt | 软件源 |
| pacman | Repository |
| cargo | crates.io |
| npm | npm Registry |
| **Scoop** | **Bucket** |

用户的安装流程：

```powershell
scoop bucket add cceli https://github.com/CCE-Li/scoop-bucket
scoop install quick-ssh
```

## 创建自己的 Bucket

仓库结构：

```text
scoop-bucket
│
├── bucket
│     └── quick-ssh.json
│
├── README.md
└── LICENSE
```

`bucket/` 目录必须存在，Scoop 只在该目录下查找 manifest。

## Manifest 结构

每个软件对应一个 JSON 文件，例如 `bucket/quick-ssh.json`：

```json
{
    "version": "2.0.1",
    "description": "Quick-SSH - Docker-style SSH connection manager with TUI",
    "homepage": "https://github.com/CCE-Li/Quick-SSH",
    "license": "MIT",
    "architecture": {
        "64bit": {
            "url": "https://github.com/CCE-Li/Quick-SSH/releases/download/v2.0.1/qssh-x86_64-windows.zip",
            "hash": "sha256:5a8c94366097215c425153f1f6268d8b33f337d1577fc1881b3c5fb47143f043"
        }
    },
    "bin": [
        "qssh.exe",
        "qssh-uploader.exe"
    ]
}
```

## 字段说明

| 字段 | 作用 | 说明 |
| --- | --- | --- |
| `version` | 软件版本 | 与 Release 的 tag 保持一致 |
| `homepage` | 项目主页 | 通常填 GitHub 地址 |
| `description` | 软件简介 | 一行说明即可 |
| `architecture` | 分平台下载地址 | 按 `64bit` / `32bit` / `arm64` 组织 |
| `url` | Release 下载地址 | **固定版本号，不要用 latest** |
| `hash` | 文件 SHA256 | 由 `Get-FileHash` 生成 |
| `bin` | 加入 PATH 的程序 | 安装完成后可直接在终端调用 |

计算哈希：

```powershell
Get-FileHash qssh-x86_64-windows.zip
```

把输出填入 `"hash": "sha256:..."` 即可。

## 自动检查更新

```json
"checkver": {
    "github": "CCE-Li/Quick-SSH"
}
```

Scoop 会读取该 GitHub 仓库的最新 Release 版本。

## 自动更新

```json
"autoupdate": {
    "architecture": {
        "64bit": {
            "url": "https://github.com/CCE-Li/Quick-SSH/releases/download/v$version/qssh-x86_64-windows.zip",
            "hash": {
                "url": "https://github.com/CCE-Li/Quick-SSH/releases/download/v$version/qssh-x86_64-windows.zip.sha256"
            }
        }
    }
}
```

配置之后，发布新版本只需改动 `version` 字段，URL 和哈希会自动生成。

## 常见错误

**404 Not Found**

Scoop 不使用 `$version` 以外的占位方式，URL 里写死的版本号必须与 Release 的 tag 完全一致。

**Release 文件名不一致**

Manifest 里的文件名必须与 Release 附件名逐字符匹配，例如 `qssh` 与 `quick-ssh` 的差异就会导致 404。

**找不到 exe**

如果压缩包内还有一层目录：

```text
qssh-x86_64-windows/
    qssh.exe
```

需要补充：

```json
"extract_dir": "qssh-x86_64-windows"
```

**Hash 不匹配**

`Hash check failed` 说明文件已更新而哈希未同步，重新计算并更新 manifest。

## 本地测试

```powershell
scoop bucket add cceli https://github.com/CCE-Li/scoop-bucket
scoop bucket list
scoop install quick-ssh
scoop update quick-ssh
scoop uninstall quick-ssh
```

重装时建议先清缓存：

```powershell
scoop uninstall quick-ssh
scoop cache rm quick-ssh
scoop install quick-ssh
```

## 自动发布流程

```text
git tag v2.0.2
        │
        ▼
GitHub Action
        │
        ├── 编译
        ├── 上传 Release
        ├── 生成 .sha256
        ├── 更新 quick-ssh.json
        ├── Commit 到 scoop-bucket
        └── 发布 Release
```

之后发布只需：

```bash
git tag v2.0.2
git push origin v2.0.2
```

## 最佳实践

- 使用 GitHub Release 分发二进制文件。
- Release 文件名保持固定格式，例如 `qssh-x86_64-windows.zip`。
- 同时上传压缩包与 `.sha256` 校验文件。
- Manifest 使用固定下载地址，不使用 `latest`。
- 用 `checkver` 检测版本，用 `autoupdate` 生成链接。
- 结合 GitHub Actions 自动更新 Bucket，实现一键发布。
