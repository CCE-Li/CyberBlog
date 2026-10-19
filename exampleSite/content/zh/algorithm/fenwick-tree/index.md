---
title: "树状数组：统计左侧大于当前值的元素个数"
date: 2025-05-30
lastmod: 2025-05-30
description: "离散化加树状数组，把「左侧有多少个比当前数大」从 O(n²) 降到 O(n log n)。"
group: "数据结构"
weight: 20
tags: ["树状数组", "离散化", "C++"]
categories: ["算法"]
isNote: true
math: true
---

统计每个位置左侧有多少个比它大的数，暴力做法是 $O(n^2)$。当数组长度上万时，用树状数组配合离散化可以做到 $O(n \log n)$。

## 原理

1. 离散化压缩数值范围，避免负数与超大数。
2. 从左往右遍历，当前已经插入树中的数字总数为 $i$。
3. `<= x` 的数字数量等于树的前缀查询结果。
4. **左侧严格大于 x 的数量 = 已插入总数 − query(x 的排名)**。
5. **左侧大于等于 x 的数量 = 已插入总数 − query(x 的排名 − 1)**。

关键在于「先查询、后插入」：查询时树中只有当前元素左侧的元素，天然满足「左侧」这个条件。

## 模板

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct FenwickTree {
    vector<int> tree;
    int size;

    FenwickTree(int n) : size(n), tree(n + 2, 0) {}

    // 单点加 delta，默认加 1
    void update(int idx, int delta = 1) {
        for (; idx <= size; idx += idx & -idx)
            tree[idx] += delta;
    }

    // 查询 [1, idx] 前缀和
    int query(int idx) {
        int res = 0;
        for (; idx > 0; idx -= idx & -idx)
            res += tree[idx];
        return res;
    }
};

vector<int> countLeftGreaterFast(const vector<int>& arr) {
    vector<int> tmp = arr;
    // 离散化
    sort(tmp.begin(), tmp.end());
    tmp.erase(unique(tmp.begin(), tmp.end()), tmp.end());
    int maxRank = tmp.size();

    FenwickTree ft(maxRank);
    vector<int> ans;

    for (int num : arr) {
        // 当前数字的排名，从 1 开始
        int r = lower_bound(tmp.begin(), tmp.end(), num) - tmp.begin() + 1;
        // 已插入的元素个数 = ans.size()
        int cnt = ans.size() - ft.query(r);
        ans.push_back(cnt);
        ft.update(r);
    }
    return ans;
}

int main() {
    vector<int> a = {5, 2, 6, 1, 3};
    vector<int> res = countLeftGreaterFast(a);
    for (int x : res) cout << x << " ";
    // 输出：0 1 0 3 2
    return 0;
}
```

## 复杂度与选择

| 场景 | 推荐做法 | 复杂度 |
| --- | --- | --- |
| 数组长度几百以内 | 暴力双重循环，代码短 | $O(n^2)$ |
| 数组长度上万、竞赛场景 | 离散化 + 树状数组 | $O(n \log n)$ |

如果数组包含负数或极大值，离散化会自动处理，无需额外修改。

如果只需求某一个特定位置左侧的大数个数，直接遍历该位置左边即可，不必动用树状数组。
