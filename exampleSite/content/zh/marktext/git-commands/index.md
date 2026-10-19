---
title: "Git 常用指令与三个区域"
date: 2026-02-24
lastmod: 2026-04-27
description: "把命令按「初始化、查看、提交、分支、撤销」归类，并理清工作区、暂存区与本地仓库的关系。"
group: "版本控制与 CI"
weight: 30
tags: ["Git", "版本控制", "命令行"]
categories: ["开发"]
isNote: true
---

## 初始化与克隆

```bash
git init                  # 在当前目录初始化仓库
git clone 仓库地址          # 下载远程仓库
```

## 查看状态与历史

```bash
git status                # 当前修改状态
git log                   # 完整提交历史
git log --oneline         # 简洁提交历史
git diff                  # 工作区与暂存区的差异
git diff --cached         # 暂存区与最近一次提交的差异
```

## 提交代码

标准流程：

```bash
git add .
git commit -m "描述本次修改"
git push
```

| 命令 | 作用 |
| --- | --- |
| `git add 文件名` | 将指定文件加入暂存区 |
| `git add .` | 将当前目录下所有改动加入暂存区 |
| `git commit -m "说明"` | 提交到本地仓库 |
| `git push` | 推送到远程仓库 |

## 拉取远程更新

```bash
git pull      # 拉取并合并
git fetch     # 只获取远程更新，不自动合并
```

## 分支操作

```bash
git branch              # 查看本地分支
git branch 分支名        # 创建分支
git checkout 分支名      # 切换分支（旧写法）
git checkout -b 分支名   # 创建并切换（旧写法）
git switch 分支名        # 切换分支（新写法）
git switch -c 分支名     # 创建并切换（新写法）
```

示例：

```bash
git switch -c feature/login
```

## 合并分支

```bash
git switch main
git merge feature/login
```

## 远程仓库

```bash
git remote -v                        # 查看远程地址
git remote add origin 仓库地址        # 添加远程仓库
```

## 撤销修改

```bash
git restore 文件名              # 撤销工作区修改
git restore --staged 文件名      # 取消暂存
git checkout -- 文件名           # 旧写法，作用类似撤销工作区修改
```

## 删除与重命名

```bash
git rm 文件名                    # 删除并记录到 Git
git mv 原文件名 新文件名            # 重命名
```

## 临时保存修改

```bash
git stash        # 临时保存当前未提交的修改
git stash pop    # 恢复最近一次临时保存
```

## 四个高频场景

**提交自己的修改**

```bash
git status
git add .
git commit -m "完成登录页面"
git push
```

**先更新再写代码**

```bash
git pull
```

**新功能单独开分支**

```bash
git switch -c feature/pay
```

**改乱了想撤回**

```bash
git restore 文件名
```

## 三个区域

理解 Git 的关键是分清三个区域：

- **工作区**：正在修改的文件。
- **暂存区**：准备提交的文件。
- **本地仓库**：已经 `commit` 的历史记录。

```text
改文件 -> git add -> git commit -> git push
```

## 优先记住的十条命令

```bash
git init
git clone
git status
git add
git commit -m
git log --oneline
git pull
git push
git switch -c
git restore
```

## 一句话记忆

- 拉代码：`git pull`
- 看状态：`git status`
- 提代码：`git add .` → `git commit -m "说明"` → `git push`
- 开分支：`git switch -c 分支名`
- 撤修改：`git restore 文件名`
