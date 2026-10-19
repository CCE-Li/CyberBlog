---
title: "KMP 算法：next 数组与线性匹配"
date: 2026-06-04
lastmod: 2026-06-04
description: "匹配失败时只回退模式串指针，文本串指针永不回退，这是 KMP 能做到 O(n+m) 的原因。"
group: "字符串"
weight: 10
tags: ["字符串", "KMP", "C++"]
categories: ["算法"]
isNote: true
---

多次查找时，KMP 通常比 `find` 更快，因为它不会回退文本串指针。

## next 数组（前缀函数）

`next[i]` 表示 `P[0...i]` 中最长的「真前缀等于真后缀」的长度。

```text
P = "ababaca"

i:     0 1 2 3 4 5 6
P:     a b a b a c a
next:  0 0 1 2 3 0 1
```

## 求 next 数组

```cpp
vector<int> getNext(const string& p) {
    int m = p.size();
    vector<int> nxt(m);

    for (int i = 1, j = 0; i < m; i++) {
        while (j > 0 && p[i] != p[j])
            j = nxt[j - 1];

        if (p[i] == p[j])
            j++;

        nxt[i] = j;
    }

    return nxt;
}
```

## KMP 匹配

```cpp
vector<int> kmp(const string& s, const string& p) {
    vector<int> nxt = getNext(p);
    vector<int> pos;

    int n = s.size();
    int m = p.size();

    for (int i = 0, j = 0; i < n; i++) {
        while (j > 0 && s[i] != p[j])
            j = nxt[j - 1];

        if (s[i] == p[j])
            j++;

        if (j == m) {
            pos.push_back(i - m + 1); // 匹配起点
            j = nxt[j - 1];
        }
    }

    return pos;
}
```

## 完整模板

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> getNext(const string& p) {
    int m = p.size();
    vector<int> nxt(m);

    for (int i = 1, j = 0; i < m; i++) {
        while (j > 0 && p[i] != p[j])
            j = nxt[j - 1];

        if (p[i] == p[j])
            j++;

        nxt[i] = j;
    }

    return nxt;
}

vector<int> kmp(const string& s, const string& p) {
    vector<int> nxt = getNext(p);
    vector<int> ans;

    for (int i = 0, j = 0; i < (int)s.size(); i++) {
        while (j > 0 && s[i] != p[j])
            j = nxt[j - 1];

        if (s[i] == p[j])
            j++;

        if (j == (int)p.size()) {
            ans.push_back(i - p.size() + 1);
            j = nxt[j - 1];
        }
    }

    return ans;
}

int main() {
    string s = "abababac";
    string p = "abab";

    auto pos = kmp(s, p);

    for (auto x : pos)
        cout << x << ' ';
}
```

输出：

```text
0 2
```

## 竞赛常用写法（1 下标）

很多题解采用 1 下标的写法，边界处更符合直觉：

```cpp
string s, p;
cin >> s >> p;

int n = s.size();
int m = p.size();

s = " " + s;
p = " " + p;

vector<int> ne(m + 1);

for (int i = 2, j = 0; i <= m; i++) {
    while (j && p[i] != p[j + 1])
        j = ne[j];

    if (p[i] == p[j + 1])
        j++;

    ne[i] = j;
}

for (int i = 1, j = 0; i <= n; i++) {
    while (j && s[i] != p[j + 1])
        j = ne[j];

    if (s[i] == p[j + 1])
        j++;

    if (j == m) {
        cout << i - m + 1 << '\n';
        j = ne[j];
    }
}
```

## KMP 的竞赛用途

除了字符串匹配，还经常用于：

- 求字符串循环节。
- 求最短循环串。
- 求 border（前后缀相同）。
- 字符串压缩。
- 统计每个前缀出现的次数。
- 构造 KMP 自动机。
- 与 DP 结合处理「禁止串」问题。

## 复杂度为什么是线性的

```cpp
while (j && s[i] != p[j + 1])
    j = ne[j];
```

这一步保证匹配失败时不会回退文本串指针 `i`，$j$ 的总增加量不超过 $n$，回退量也不会超过增加量，因此总复杂度是 $O(n + m)$。这是 KMP 的核心。
