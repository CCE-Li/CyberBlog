---
title: "二维前缀和与二维差分"
date: 2026-06-04
lastmod: 2026-06-04
description: "容斥原理写对四个角标，子矩阵查询与区间修改都能做到 O(1)。"
group: "前缀和与差分"
weight: 10
tags: ["前缀和", "差分", "C++"]
categories: ["算法"]
isNote: true
math: true
---

二维前缀和与二维差分是同一个容斥思想的两个方向：前者把子矩阵查询压到 $O(1)$，后者把子矩阵修改压到 $O(1)$。**统一使用 1 下标**可以完全避免边界越界。

## 二维前缀和

构建公式：

$$
s_{i,j} = a_{i,j} + s_{i-1,j} + s_{i,j-1} - s_{i-1,j-1}
$$

查询子矩阵 $(x_1, y_1)$ 到 $(x_2, y_2)$：

$$
\text{res} = s_{x_2,y_2} - s_{x_1-1,y_2} - s_{x_2,y_1-1} + s_{x_1-1,y_1-1}
$$

```cpp
#include <iostream>
using namespace std;

const int N = 1010; // 按题目数据范围调整
int a[N][N];
int s[N][N];

int main() {
    int n, m, q;
    cin >> n >> m >> q;

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> a[i][j];

    // 预处理前缀和
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            s[i][j] = a[i][j] + s[i-1][j] + s[i][j-1] - s[i-1][j-1];

    while (q--) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        int res = s[x2][y2] - s[x1-1][y2] - s[x2][y1-1] + s[x1-1][y1-1];
        cout << res << '\n';
    }

    return 0;
}
```

矩阵大小不确定时也可以改用 `vector`：

```cpp
vector<vector<int>> a(n + 1, vector<int>(m + 1));
vector<vector<int>> s(n + 1, vector<int>(m + 1));
```

## 二维差分

对子矩阵 $(x_1, y_1)$ 到 $(x_2, y_2)$ 整体加上 `val`，只需修改四个位置：

```cpp
void add(int x1, int y1, int x2, int y2, int val) {
    s[x1][y1] += val;
    s[x2+1][y2+1] += val;
    s[x1][y2+1] -= val;
    s[x2+1][y1] -= val;
}
```

完成所有修改后，再用前缀和还原原数组：

```cpp
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        s[i][j] += s[i-1][j] + s[i][j-1] - s[i-1][j-1];
        cout << s[i][j] << " ";
    }
    cout << endl;
}
```

## 完整模板

```cpp
int a[N][N], s[N][N];

void add(int x1, int y1, int x2, int y2, int val) {
    s[x1][y1] += val;
    s[x2+1][y2+1] += val;
    s[x1][y2+1] -= val;
    s[x2+1][y1] -= val;
}

void solve() {
    int n, m, q;
    cin >> n >> m >> q;

    // 用差分的方式逐个元素填入
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            cin >> a[i][j];
            add(i, j, i, j, a[i][j]);
        }

    while (q--) {
        int x1, y1, x2, y2, k;
        cin >> x1 >> y1 >> x2 >> y2 >> k;
        add(x1, y1, x2, y2, k);
    }

    // 还原数组
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            s[i][j] += s[i-1][j] + s[i][j-1] - s[i-1][j-1];
            cout << s[i][j] << " ";
        }
        cout << endl;
    }
}
```

## 总结

1. 构建：**当前 + 上方 + 左方 − 左上角**。
2. 查询：**右下角 − 上边界外 − 左边界外 + 双边界外**。
3. 差分修改：**左上、右下加，右上、左下减**。
4. 1 下标写法是最省心的选择，竞赛中一般开 `N = 1010` 或 `N = 5010` 足够。
