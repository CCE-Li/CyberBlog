---
title: "单调队列：滑动窗口的最值"
date: 2026-05-05
lastmod: 2026-05-05
description: "队列里存下标而不是值，靠单调性把区间最值的复杂度压到 O(n)。"
group: "数据结构"
weight: 40
tags: ["单调队列", "滑动窗口", "C++"]
categories: ["算法"]
isNote: true
math: true
---

单调队列维护一个窗口内的最值。要点只有两个：**队列里存的是下标**，以及**及时弹出已经离开窗口的队头**。

## 求区间最大值

维护一个递减队列：新元素入队前，把所有比它小的队尾弹出，这样队头始终是当前窗口的最大值。

```cpp
vector<int> dequeMax(vector<int> a) {  // 维护递减队列，求区间 max
    vector<int> res;
    deque<int> q;

    for (int i = 1; i <= n; i++) {
        while (!q.empty() && a[q.back()] < a[i]) // 维护单调性
            q.pop_back();
        q.push_back(i);

        if (!q.empty() && i - q.front() >= k)   // 弹出窗口外的内容
            q.pop_front();

        if (i >= k)                             // 窗口填满后开始记录
            res.push_back(a[q.front()]);
    }

    return res;
}
```

## 求区间最小值

同理换成递增队列：新元素入队前弹出所有比它大的队尾，队头即为窗口最小值。

```cpp
vector<int> dequeMin(vector<int> a) {  // 维护递增队列，求区间 min
    vector<int> res;
    deque<int> q;

    for (int i = 1; i <= n; i++) {
        while (!q.empty() && a[q.back()] > a[i])
            q.pop_back();
        q.push_back(i);

        if (!q.empty() && i - q.front() >= k)
            q.pop_front();

        if (i >= k) {
            res.push_back(a[q.front()]);
        }
    }

    return res;
}
```

## 易错点

- 队列必须存下标，否则无法判断队头是否已经滑出窗口。
- 弹出队尾用的是 `while` 而不是 `if`，要一直弹到单调性恢复。
- 判断越界用 `i - q.front() >= k`，注意窗口长度 $k$ 与下标差的关系。

## 延伸

单调队列最常见的两种用法是滑动窗口最值，以及优化 DP 转移中的区间最值项。后者在多重背包、分段 DP 里会反复出现。
