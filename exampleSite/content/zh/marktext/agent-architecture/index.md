---
title: "Agent 的实现结构：权限、工具与执行循环"
date: 2026-01-12
lastmod: 2026-01-12
description: "把「LLM 接收指令、在权限内选工具、执行并汇总」展开成可落地的五层架构。"
group: "AI 与 Agent"
weight: 10
tags: ["Agent", "MCP", "架构"]
categories: ["AI"]
isNote: true
---

## 一句话定性

> Agent 是一个以 LLM 为决策核心的执行体：接收用户指令 → 在协议约束下获得临时能力 → 从工具注册表中选择并调用工具 → 汇总执行结果并返回给用户。

下面把这个压缩过的定义展开。

## 整体架构

一个 Agent 至少包含 5 个逻辑模块：

```text
User
 ↓
Instruction Parser（意图解析）
 ↓
LLM Planner（决策 / 推理）
 ↓
MCP 权限控制层
 ↓
Tool Registry（工具描述 & 调用）
 ↓
Executor（执行 & 状态回收）
 ↓
Result Synthesizer（结果整合）
 ↓
User
```

LLM 只是大脑皮层，Agent 才是完整的生物体。

## 核心流程

### 1. 接收用户指令

用户给出的通常不是代码，而是目标描述，例如「把这个目录里的 PDF 全部转成 Markdown 并做摘要」。

系统此时做三件事：

- 解析目标（Goal）。
- 识别约束（时间、权限、环境）。
- 形成可执行的意图表示（Intent Graph）。

这一步仍然由 LLM 完成，但不涉及任何真实操作。

### 2. 权限层：能力授予比工具调用更关键

MCP（Model Context Protocol）在这里的作用是**能力授予**，而不只是工具调用。

它要解决的问题是：

- 不能让模型天生什么都能干。
- 只能在明确上下文、明确时限、明确作用域内获得能力。

典型语义：

- 权限是临时的。
- 权限是最小化的。
- 权限是可回收的。
- 权限是声明式的。

```json
{
  "capabilities": [
    "filesystem.read:/data/reports",
    "pdf.parse",
    "markdown.write:/tmp/output"
  ],
  "expires_at": "2026-01-12T16:30:00Z"
}
```

LLM 只能在这个权限沙箱内计划和调用工具。这一步是 Agent 不失控的关键。

### 3. 工具注册表：工具是能力说明书

工具注册表不是简单的函数列表，而是一组具备语义描述、输入输出约束、失败模式的能力声明。

每个工具至少包含：

- name
- capability description（自然语言）
- input schema
- output schema
- side effects
- required permissions（与权限层对齐）

```json
{
  "name": "pdf_to_markdown",
  "description": "Convert PDF files into markdown text",
  "input": { "path": "string" },
  "output": { "markdown": "string" },
  "requires": ["filesystem.read", "markdown.write"]
}
```

LLM 并不「调用函数」，而是在「我能干什么」的语义空间里做选择。

### 4. Plan → Act → Observe 循环

Agent 的核心运行模式不是一次性调用，而是可中断、可回滚的循环：

```text
Plan（规划）
 ↓
Act（调用工具）
 ↓
Observe（读取结果）
 ↓
Reflect / Replan
```

例如：先列出目录，发现 20 个 PDF，逐个调用转换工具，某个失败就调整策略，最后汇总结果。LLM 在这里扮演的是**策略生成器加状态解释器**，而不是执行者。

### 5. 执行与回收

Executor 负责实际调用工具、捕获标准输出与错误、处理超时与异常、记录状态，并在结束时回收权限。

**LLM 永远不直接接触真实系统资源。**

### 6. 返回结果

最终返回给用户的不是原始输出，而是结构化结果、摘要、错误说明，以及已完成与未完成事项的清单。这是 Agent 与脚本的本质差异。

## 本质

> Agent = LLM + 受控权限 + 工具语义 + 执行循环

或者更直白一点：

- LLM 负责「想做什么」。
- 权限层决定「能不能做」。
- 工具注册表告诉它「怎么做」。
- Executor 保证「不会乱做」。

## 这个模型的适用面

「临时权限」「协议标准化」「工具注册表」这三个关键词，正好是当前主流 Agent 方案的共同交集，覆盖 OpenAI Agents、Anthropic Tool Use、AutoGPT / CrewAI / LangGraph 以及企业级 Copilot 架构。

## 可以继续深入的方向

- MCP 与 OAuth / RBAC 的关系。
- 工具选择靠 prompt，还是靠单独的 planner 模型。
- 多 Agent 协作时，Agent 之间的协议如何设计。
- Agent 的「记忆」是否也应该建模为工具。
- 为什么 Agent 天生是一个半确定系统。
