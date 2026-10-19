---
title: "life"
displayTitle: "life"
description: "从入学到现在：一条主干记录方向性的节点，枝干向外生长成脉络。"
isModule: true
isTimeline: true
weight: 5

threads:
  - key: acm
    name: "算法竞赛"
    color: "cyan"
  - key: oss
    name: "开源"
    color: "green"
  - key: eng
    name: "工程"
    color: "orange"
  - key: ai
    name: "AI"
    color: "purple"
  - key: people
    name: "人与事"
    color: "pink"

# 主干：只放真正改变了方向的事。按时间顺序书写，数组顺序即时间顺序。
# branches 里挂的是这条主干的枝干节点。
#   thread  枝干所属脉络，取值见上方 threads 的 key
#   date    短标签，自由文本，如 "大一上" / "2026.06"
#   url     可选，填写后节点可点击进入文章
trunk:
  - id: "year-one"
    date: "大一"
    title: "入学"
    summary: "换了一个环境，开始把时间投向真正感兴趣的方向。"
    branches:
      - thread: acm
        date: "大一上"
        title: "第一次接触算法竞赛"
        note: "从基础语法和数组题开始，逐渐把刷题变成固定习惯。"
      - thread: people
        date: "大一"
        title: "认识第一批一起写代码的人"
        note: ""

  - id: "quick-ssh"
    date: "2026.06"
    title: "Quick-SSH 首次发布"
    summary: "把日常反复敲的 SSH 操作做成一个真正能分发出去的工具。"
    branches:
      - thread: oss
        date: "2026.06"
        title: "第一份正式的 README 与 Release"
        note: "开始在意别人能不能装上、能不能看懂。"
      - thread: eng
        date: "2026.06"
        title: "用 Rust 重写核心逻辑"
        note: "TUI 与 CLI 两套入口共享同一个配置层。"
      - thread: people
        date: "2026.07"
        title: "有人提了第一个 issue"
        note: "第一次意识到自己写的东西会被陌生人使用。"

  - id: "cyberblog"
    date: "2026.10"
    title: "CyberBlog 上线"
    summary: "把长期散落的笔记收拢成一个可以持续维护的地方。"
    branches:
      - thread: eng
        date: "2026.10"
        title: "Algorithm / MarkText 两个模块落地"
        note: "笔记不再只是本地文件，而是有结构的归档。"
      - thread: ai
        date: "2026.10"
        title: "开始让 AI 参与日常开发流程"
        note: "从补全走向协作，重点转向怎么描述问题。"
---
