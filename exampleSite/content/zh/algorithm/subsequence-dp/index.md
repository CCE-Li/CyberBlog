---
title: "子序列 DP：五个常用模板"
date: 2026-06-07
lastmod: 2026-06-07
description: "LIS、LCS、最大子段和、子序列计数、不相邻取数，五个模板覆盖绝大多数子序列题。"
group: "动态规划"
weight: 30
tags: ["动态规划", "LIS", "LCS", "C++"]
categories: ["算法"]
isNote: true
math: true
---

## 子序列的总数

对长度为 $n$ 的数组，子序列（含空集）有 $2^n$ 个。用 DP 的语言描述就是每个元素「选或不选」：

```cpp
int dp[N];

void solve() {
    vector<int> a = {1, 2, 3};
    dp[0] = 1;

    for (int i = 1; i < a.size(); i++) {
        dp[i] = 1 + dp[i - 1] + dp[i - 1];
    }

    cout << dp[a.size() - 1];
}
```

## 1. 最长递增子序列 LIS

**状态**：`dp[i]` 表示以 `i` 结尾的最长递增子序列长度。

```cpp
const int N = 1005;
int dp[N], a[N];

int LIS(int n) {
    int ans = 1;
    for (int i = 1; i <= n; i++) {
        dp[i] = 1; // 至少包含自己
        for (int j = 1; j < i; j++) {
            if (a[i] > a[j]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        ans = max(ans, dp[i]);
    }
    return ans;
}
```

## 2. 最长公共子序列 LCS

**状态**：`dp[i][j]` 表示第一个串前 `i` 个字符与第二个串前 `j` 个字符的 LCS 长度。

```cpp
const int N = 1005;
int dp[N][N];

int LCS(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[n][m];
}
```

## 3. 最大子段和

**状态**：`dp[i]` 表示以 `i` 结尾的最大子段和，转移时在「接上前面」和「从当前重新开始」之间取较大值。

```cpp
const int N = 1e5 + 10;
int dp[N], a[N];

int maxSubseqSum(int n) {
    int ans = a[1];
    dp[1] = a[1];
    for (int i = 2; i <= n; i++) {
        dp[i] = max(a[i], dp[i-1] + a[i]);
        ans = max(ans, dp[i]);
    }
    return ans;
}
```

## 4. 子序列计数

每个元素独立地「选或不选」，因此总数是 2 的幂。

```cpp
const int MOD = 1e9 + 7;

long long countSubseq(int a[], int n) {
    long long dp = 1; // 空集
    for (int i = 1; i <= n; i++) {
        dp = dp * 2 % MOD;
    }
    return dp; // 包含空集；不含空集则返回 dp - 1
}
```

## 5. 不相邻取数（打家劫舍模型）

**状态**：`dp[i]` 表示前 `i` 个元素中，不选相邻元素时的最大和。

```cpp
int dp[N], a[N];

int nonOverlapSum(int n) {
    if (n == 0) return 0;
    if (n == 1) return a[1];
    dp[1] = a[1];
    dp[2] = max(a[1], a[2]);
    for (int i = 3; i <= n; i++) {
        dp[i] = max(dp[i-1], dp[i-2] + a[i]);
    }
    return dp[n];
}
```

## 超级总结

1. **LIS**：`dp[i] = max(dp[j]) + 1`，要求 `a[j] < a[i]`。
2. **LCS**：字符相等就 `+1`，否则取两边的较大值。
3. **最大子段和**：`max(a[i], dp[i-1] + a[i])`。
4. **子序列计数**：每步 `dp = dp * 2`。
5. **不相邻取数**：`dp[i] = max(dp[i-1], dp[i-2] + a[i])`。

这五个模板的共同点是状态都定义在「以 i 结尾」或「前 i 个」，区别只在转移时用到了前一项、前两项，还是整个前缀的最优值。
