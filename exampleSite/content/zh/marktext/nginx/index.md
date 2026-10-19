---
title: "Nginx 常用配置：反向代理、静态站点与文件下载"
date: 2025-12-25
lastmod: 2026-06-13
description: "conf.d 目录结构、反向代理头、SPA 刷新 404、静态资源缓存与附件下载，一页覆盖高频场景。"
group: "服务器与运维"
weight: 10
tags: ["Nginx", "反向代理", "运维"]
categories: ["运维"]
isNote: true
---

## 基本信息

配置文件目录：`/etc/nginx/conf.d/`

```text
/etc/nginx/
├── nginx.conf          # 主配置文件（入口）
├── conf.d/             # 站点配置目录（常用，放虚拟主机）
│   ├── default.conf    # 默认站点
│   └── napcat.conf     # 域名配置，建议一个站点一个文件
├── sites-available/    # 站点可用（Debian/Ubuntu 常用）
├── sites-enabled/      # 站点启用（软链接指向 available）
├── mime.types          # 资源 MIME 类型
├── fastcgi_params      # PHP 等 FastCGI 参数
├── scgi_params
├── uwsgi_params
├── koi-utf
├── koi-win
├── win-utf
└── html/               # Nginx 默认静态页面目录
    ├── index.html
    └── 50x.html
```

基本操作：

```bash
# 检查配置语法
nginx -t

# 重载配置
nginx -s reload
```

## 反向代理静态站点首页

```nginx
server {
    listen 443 ssl;
    server_name ns.cceli.icu;

    location / {
        # 转发到本机的 1400 端口服务
        proxy_pass http://127.0.0.1:1400;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    ssl_certificate /etc/letsencrypt/live/ns.cceli.icu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ns.cceli.icu/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 1400;
    server_name ns.cceli.icu 118.195.131.38;

    root /home/lyx/nginx/www/ns-cceli;
    index index.html index.htm;

    location / {
        # 解决 Vue / React 单页应用刷新 404 的问题（非 SPA 可删除）
        try_files $uri $uri/ /index.html;
        # 允许跨域（可选）
        add_header Access-Control-Allow-Origin *;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|css|js|ico)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # 禁止访问隐藏文件（如 .git、.env）
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}

server {
    if ($host = ns.cceli.icu) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name ns.cceli.icu;
    return 404;
}
```

## 只转发端口

```nginx
server {
    listen 80;
    server_name astrbot.cceli.icu;

    location / {
        proxy_pass http://127.0.0.1:6185;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_redirect off;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 文件下载

放在 `server {}` 内部：

```nginx
location /download/ {
    alias /home/lyx/nginx/download/;
    add_header Content-Disposition "attachment";
    default_type application/octet-stream;
    try_files $uri =404;
}
```

## 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 改了配置不生效 | 没有 reload | `nginx -t && nginx -s reload` |
| SPA 刷新 404 | 缺少 `try_files` 回退 | 补 `try_files $uri $uri/ /index.html` |
| 拿不到真实 IP | 缺少 `X-Real-IP` / `X-Forwarded-For` | 在代理层补上这两个头 |
| 证书到期 | Certbot 续期失败 | 检查 80 端口是否被拦截 |
| 下载变成在线预览 | 缺少 `Content-Disposition` | 显式设置 `attachment` |
