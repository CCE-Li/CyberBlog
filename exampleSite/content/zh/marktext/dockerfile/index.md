---
title: "Dockerfile 编写：常用指令速查"
date: 2026-02-26
lastmod: 2026-02-26
description: "镜像、容器与 Dockerfile 的关系，以及构建、网络、存储、元数据四类核心指令的用法。"
group: "开发工具"
weight: 10
tags: ["Docker", "Dockerfile", "容器"]
categories: ["开发"]
isNote: true
---

## 基本概念

- Docker 最早是 dotcloud 公司出品的容器管理工具，后来公司也改名为 Docker。
- Dockerfile 是 Docker 镜像的描述文件，可以理解成火箭发射的 A、B、C、D 步骤清单。
- Docker 镜像通过 Dockerfile 构建，包含操作系统基础文件和软件运行环境，采用分层存储。
- 容器是运行起来的镜像：**镜像相当于程序，容器相当于进程**。

## 核心构建指令

| 指令 | 说明 | 示例 |
| --- | --- | --- |
| `FROM` | 指定基础镜像，必须是第一条指令 | `FROM ubuntu:20.04` |
| `WORKDIR` | 设置工作目录，后续操作在此进行 | `WORKDIR /app` |
| `COPY` | 复制文件或目录到镜像中 | `COPY . /app` |
| `ADD` | 复制文件、URL 或压缩包，压缩包会自动解压 | `ADD app.tar.gz /app` |
| `RUN` | 在构建阶段执行命令 | `RUN apt-get update` |
| `CMD` | 容器启动时的默认命令，可被覆盖 | `CMD ["python", "app.py"]` |
| `ENTRYPOINT` | 容器入口点，不会被 `docker run` 的参数覆盖 | `ENTRYPOINT ["python", "app.py"]` |

## 网络和存储指令

| 指令 | 说明 | 示例 |
| --- | --- | --- |
| `EXPOSE` | 声明容器监听的端口 | `EXPOSE 8080` |
| `VOLUME` | 创建挂载点 | `VOLUME ["/data"]` |

## 环境配置指令

| 指令 | 说明 | 示例 |
| --- | --- | --- |
| `ENV` | 设置环境变量，构建与运行时都可见 | `ENV NODE_ENV=production` |
| `ARG` | 定义构建时变量，构建结束后失效 | `ARG VERSION=1.0` |

## 元数据与高级指令

| 指令 | 说明 | 示例 |
| --- | --- | --- |
| `LABEL` | 添加镜像元数据 | `LABEL version="1.0"` |
| `ONBUILD` | 当镜像作为基础镜像时触发的指令 | `ONBUILD COPY . /app` |
| `HEALTHCHECK` | 定义容器健康检查 | `HEALTHCHECK CMD curl -f http://localhost/ \|\| exit 1` |
| `SHELL` | 指定默认 Shell | `SHELL ["/bin/bash", "-c"]` |

## CMD 与 ENTRYPOINT 的区别

- `CMD` 提供默认参数，`docker run` 后面追加的命令会**替换**它。
- `ENTRYPOINT` 定义固定入口，`docker run` 后面的参数会作为**参数追加**给它。
- 两者常配合使用：`ENTRYPOINT` 指定可执行文件，`CMD` 提供默认参数。

## 一个多阶段构建示例

```dockerfile
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

多阶段构建能把编译工具链留在构建阶段，最终镜像只保留运行时产物，体积通常能缩小一个数量级。
