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
    date: "2024.09"
    title: "入学"
    summary: "换了一个环境，开始把时间投向真正感兴趣的方向。"
    branches:
      - thread: acm
        date: "2024 秋"
        title: "第一次接触算法竞赛"
        note: "从基础语法和数组题开始，逐渐把刷题变成固定习惯。"
      - thread: people
        date: "2024 秋"
        title: "认识第一批一起写代码的人"
        note: ""

  - id: "teamhelper"
    date: "2026.02"
    title: "TeamHelper 实习"
    summary: "大二寒假进入真实的产品环境，开始做大模型在 AR 眼镜方向的应用。"
    branches:
      - thread: ai
        date: "2026.02"
        title: "大模型在 AR 眼镜方向的应用"
        note: "从实验室里的模型，转到有硬件约束、有真实用户的场景里去看它到底能做什么。"
      - thread: eng
        date: "2026.02"
        title: "第一次参与完整的产品开发流程"
        note: "需求、实现、联调、迭代，和一个人写代码是两回事。"
      - thread: people
        date: "2026.02"
        title: "和团队一起做东西"
        note: "第一次以实习生的身份，和别人共同承担一个目标。"

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

  - id: "astana"
    date: "2026.09"
    title: "阿斯塔纳 IT 大学交换"
    summary: "作为交换生去到另一个国家，换一套完全不同的环境继续学习。"
    branches:
      - thread: people
        date: "2026.09"
        title: "换一个国家生活与学习"
        note: "从熟悉的环境里抽离出来，重新适应语言、节奏和做事方式。"

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
