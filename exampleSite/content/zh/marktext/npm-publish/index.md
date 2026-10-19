---
title: "npm 包发布全流程"
date: 2025-11-05
lastmod: 2026-06-29
description: "从账号登录、package.json 配置，到版本迭代、撤回限制与常见 403 报错的排查。"
group: "版本控制与 CI"
weight: 20
tags: ["npm", "Node.js", "发布"]
categories: ["开发"]
isNote: true
---

## 前置准备

安装 Node.js 后确认版本：

```bash
node -v
npm -v
```

在 [npmjs.com](https://www.npmjs.com/) 注册账号，然后登录。

密码登录：

```bash
npm login
```

依次输入用户名、密码、邮箱验证码。

Token 登录（推荐，可免除两步验证）：

```bash
npm login --auth-type=bearer --auth-token=npm_你的完整token
```

验证登录状态：

```bash
npm whoami
```

## 创建包项目

```bash
mkdir my-demo-pkg
cd my-demo-pkg
npm init -y
```

编写入口文件 `index.js`：

```js
// index.js
function hello(name) {
  return `Hello ${name}!`
}
module.exports = hello
```

关键配置 `package.json`：

```json
{
  "name": "my-demo-pkg",
  "version": "1.0.0",
  "main": "index.js",
  "description": "npm 测试包",
  "author": "你的名字",
  "license": "MIT",
  "keywords": ["demo", "tool"],
  "private": false,
  "files": ["index.js"]
}
```

重点：

- `name` 必须全局唯一，冲突会导致发布失败。
- `version` 遵循语义化版本，每次发布必须递增。
  - `1.0.0`：初次发布
  - `1.1.0`：新增功能
  - `1.0.1`：修复 bug

## 发布前本地测试

```bash
# 在包目录执行全局链接
npm link

# 新建测试项目
mkdir test
cd test
npm link my-demo-pkg
```

测试代码 `test.js`：

```js
const hello = require('my-demo-pkg')
console.log(hello('npm'))
```

检查打包内容：

```bash
npm pack
```

生成的 `.tgz` 里应该只有需要上传的文件，避免带上配置、日志和源码垃圾。

## 发布

```bash
npm publish
```

如果包名带作用域（`@xxx/包名`），默认发布为私有包（收费），需要显式声明公开：

```bash
npm publish --access public
```

## 版本迭代

```bash
npm version patch   # 1.0.0 -> 1.0.1，修复 bug
npm version minor   # 1.0.0 -> 1.1.0，新增功能
npm version major   # 1.0.0 -> 2.0.0，不兼容更新

npm publish
```

## 撤回与删除

发布 **24 小时内**可以撤回：

```bash
npm unpublish my-demo-pkg --force
```

限制规则：

- 超过 24 小时无法删除完整包。
- 已有项目依赖的版本无法删除。
- 不建议频繁删除，优先升级版本。

## 常见问题

| 报错 | 原因 | 处理 |
| --- | --- | --- |
| 403 Forbidden | 未登录，或使用了镜像源 | `npm login`；`npm config set registry https://registry.npmjs.org/` |
| 包名已存在 | `name` 重复 | 换一个更独特的名称 |
| 无法发布 | `private: true` | 改为 `false` |
| 版本号重复 | 未提升版本 | 用 `npm version` 提升后重发 |
| 上传了多余文件 | 缺少忽略规则 | 新增 `.npmignore` |

`.npmignore` 语法与 `.gitignore` 相同：

```text
# .npmignore
node_modules/
test/
.git
.gitignore
*.log
```

## 发布后验证

```bash
npm i my-demo-pkg
```

也可以在 npm 官网搜索包名，确认版本与描述已更新。

## TypeScript 包

TS 项目需要先编译出 JS 和类型声明：

1. 安装 `npm i -D typescript @types/node`。
2. `tsconfig.json` 中设置 `outDir: "./dist"`。
3. 修改 `package.json`：

```json
"main": "dist/index.js",
"types": "dist/index.d.ts",
"files": ["dist"]
```

4. 发布前先执行 `tsc`，再 `npm publish`。
