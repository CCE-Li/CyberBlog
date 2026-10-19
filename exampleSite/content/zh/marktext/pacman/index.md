---
title: "pacman 与 AUR：Arch Linux 包管理"
date: 2026-06-30
lastmod: 2026-07-22
description: "Syu、Rns、Qi、Ss 这些参数到底在做什么，以及如何区分官方仓库与 AUR 来源。"
group: "开发工具"
weight: 20
tags: ["Arch Linux", "pacman", "AUR"]
categories: ["Linux"]
isNote: true
---

Linux 上的软件包通常都由包管理器统一管理，Arch Linux 使用的是 `pacman`。

## 更新软件包

```bash
sudo pacman -Syu
```

- `S`：同步
- `y`：同步缓存
- `u`：更新软件包

长时间未更新、担心系统滚挂时，可以用 `sudo pacman -Syyu` 强制刷新数据库后再升级。

AUR 助手（如 yay）的更新命令：

```bash
yay -Sua
```

## 安装软件包

官方仓库：

```bash
sudo pacman -S <包名>
```

AUR（Arch Wiki 推荐的手动流程）：
1. 下载 `PKGBUILD`，本质是一份打包用的 shell 脚本。
2. 编译：
   ```bash
   makepkg
   ```
   完成后目录里会出现 `*.pkg.tar.zst`，这是 Arch 特有的归档格式。
3. 安装：
   ```bash
   sudo pacman -U *.pkg.tar.zst
   ```

## 卸载软件包

```bash
sudo pacman -Rns <包名>
```

`-Rns` 会同时删除不再需要的依赖和本地配置文件。如果只执行 `sudo pacman -R <包名>`，依赖会残留，可以用下面的方式清理：

```bash
sudo pacman -Rns $(pacman -Qdtq)
```

## 查询软件包

**本地查询**

```bash
pacman -Qi <包名>     # 查看已安装包的详细信息
pacman -Qdtq          # 列出不再被依赖的孤立包
```

**仓库查询**

```bash
pacman -Ss <包名>
```

`-s` 表示 search。查询结果较多时，推荐配合 `fzf` 做交互式筛选。

## 清理缓存

`pacman-contrib` 提供了缓存管理工具：

```bash
pacman -Q pacman-contrib archlinux-contrib
```

```bash
sudo paccache -rk3     # 每个包保留最近 3 个版本
sudo paccache -ruk0    # 删除已卸载软件的缓存
```

所有软件包缓存都存放在 `/var/cache/pacman/pkg`。

## 判断软件来源

包的来源可以从后缀区分：

```bash
pacman -Qnq            # 只列出官方仓库的包，-q 不输出完整信息，-n 表示 native
pacman -Qmq            # 只列出 AUR 或手动安装的包
```

- `-n`：来自官方仓库（native）
- `-m`：来自 AUR 或手动编译安装（foreign）

**列出所有明确安装的软件（不含依赖）**

```bash
pacman -Qenq           # 输出包名
pacman -Qenq | wc -l   # 统计数量
```

## 迁移系统

老系统上导出已安装列表：

```bash
pacman -Qenq > packages.txt
```

新系统按列表安装：

```bash
sudo pacman -S --needed - < packages.txt
```

`--needed` 会跳过已安装的包，避免重复安装时的交互确认。
