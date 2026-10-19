---
title: "服务器应急响应处置清单"
date: 2026-01-29
lastmod: 2026-01-29
description: "从黄金五分钟止损，到进程、文件、启动项、日志四层排查，再到清除与加固的完整闭环。"
group: "服务器与运维"
weight: 20
tags: ["安全", "Linux", "应急响应"]
categories: ["运维"]
isNote: true
---

## 一、紧急止损

黄金 5 分钟内优先阻断风险扩散：

1. 在云控制台安全组封禁可疑出站 IP，阻断攻击者控制端**先于**系统内排查。
2. 保留现场：不要立刻重启，必要时先对关键目录打包备份。
3. 断开不必要的服务暴露端口，仅保留运维入口。

```bash
tar -czf backup.tar.gz 目标目录
```

## 二、深度排查

### 1. 进程与端口

| 排查项 | 操作指令 | 解读 |
| --- | --- | --- |
| 所有进程（含隐藏） | `ps -auxf`、`top -c` | 关注 CPU 占用 90% 以上、无可执行程序名、路径异常（如 `/tmp/xxx`）的进程 |
| 异常端口监听 | `netstat -tulnp` 或 `ss -tulnp` | 关注陌生端口（3333、6666、18080）、境外 IP、状态为 `ESTABLISHED` 的可疑连接 |
| 进程与文件关联 | `ls -l /proc/PID/exe`、`lsof -p PID` | 若指向 `/tmp` 或文件不存在，大概率为恶意进程 |

### 2. 恶意文件与目录

| 排查路径 | 操作指令 | 重点关注 |
| --- | --- | --- |
| 临时目录（高危） | `ls -la /tmp`、`ls -la /var/tmp` | 无后缀的可执行文件、修改时间异常、仿冒系统进程名 |
| 用户目录 | `ls -la ~/`、`find /home -type f -mtime -1` | `.bashrc` / `.bash_profile` 被植入启动命令，隐藏恶意脚本 |
| 系统关键目录 | `ls -la /usr/bin`、`ls -la /etc/cron.d` | 系统命令被替换，新增可疑定时任务 |

### 3. 启动项与定时任务

| 排查类型 | 操作指令 | 处置方式 |
| --- | --- | --- |
| 用户定时任务 | `crontab -l`；遍历所有用户：`for user in $(cut -f1 -d: /etc/passwd); do crontab -u $user -l; done` | `crontab -e` 编辑删除 |
| 系统定时任务 | `ls -la /etc/cron*`、`cat /etc/cron.d/*`、`cat /etc/crontab` | 删除陌生文件，注释可疑行 |
| 开机启动项 | `systemctl list-unit-files --type=service`、`cat /etc/rc.local` | `systemctl disable 服务名`，删除恶意启动命令 |

### 4. 日志与溯源

| 日志类型 | 操作指令 | 重点查找内容 |
| --- | --- | --- |
| 登录日志 | `grep -E "Failed password\|Accepted password\|sshd" /var/log/auth.log` | 暴力破解记录、异常 IP 登录、陌生账号 |
| 进程日志 | `grep -iE "error\|warning" /var/log/syslog` | 恶意进程启动、系统服务异常退出 |
| 历史命令 | `history`、`cat ~/.bash_history` | `wget` / `curl` 下载、`chmod +x` 等可疑操作 |

## 三、彻底清除

| 清除对象 | 操作指令 | 验证方式 |
| --- | --- | --- |
| 恶意文件 | `rm -rf /tmp/可疑文件`、`find / -name "可疑关键词" -delete` | 再次查找应无结果 |
| 被篡改的系统文件 | `md5sum /bin/ls` 与正常机器比对；`apt-get install --reinstall coreutils` | 哈希与正常系统一致 |
| 恶意账号 | `userdel -r 用户名`；`visudo` 注释可疑 sudo 配置 | `grep 用户名 /etc/passwd` 无结果 |

## 四、加固防护

### 系统层面

| 加固项 | 操作 | 说明 |
| --- | --- | --- |
| 更新补丁 | `apt update && apt upgrade -y` | 修复已知漏洞 |
| 收敛端口 | `ufw allow 22/tcp`、`ufw allow 80/tcp`、`ufw enable` | 最小化暴露面 |
| 加固 SSH | `PermitRootLogin no`、`PasswordAuthentication no`、`AllowUsers 运维账号`，然后 `systemctl restart sshd` | 防止暴力破解 |

### 云平台层面

| 加固项 | 操作 | 说明 |
| --- | --- | --- |
| 安全组封禁恶意 IP | 控制台添加入站 / 出站拒绝规则 | 阻断控制端连接 |
| 开启日志审计 | 云审计、日志服务，留存 30 天以上 | 便于事后溯源 |
| 配置告警 | CPU 占用率超过 90%、异常进程启动、端口异常监听 | 及时发现新行为 |

## 五、事后复盘

1. 记录入侵时间线：从首次异常到处置完成，梳理每一步操作。
2. 分析入侵原因：弱口令、系统漏洞未修复，还是第三方应用被攻破。
3. 补充防护措施：针对原因补短板，例如给 Web 服务打补丁、启用 WAF。

## 特别提醒

- 云主机场景下，**安全组操作优先于系统防火墙**：先在控制台阻断恶意 IP，再做系统内排查。
- 若残留进程已无活跃状态，重点检查对应文件是否还在 `/tmp`，以及定时任务和 `.bashrc` 中是否有自动下载并启动它的命令。
- 有重要数据时，处置前先备份，避免误删。
