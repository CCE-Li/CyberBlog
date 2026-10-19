---
title: "高精度四则运算模板"
date: 2026-05-27
lastmod: 2026-05-27
description: "用字符串模拟加减乘除与取模，覆盖超出 long long 范围的整数运算。"
group: "数学与数论"
weight: 20
tags: ["高精度", "C++", "模板"]
categories: ["算法"]
isNote: true
---

当整数超出 `long long` 范围时，只能用字符串模拟竖式运算。下面是一套完整可用的加减乘除与取模模板。

```cpp
#include <bits/stdc++.h>
using namespace std;

// ------------------------------
// 1. 高精度加法 (a + b)
// ------------------------------
string add(string a, string b) {
    reverse(a.begin(), a.end());
    reverse(b.begin(), b.end());
    string res;
    int carry = 0, i = 0;
    while (i < a.size() || i < b.size() || carry) {
        int sum = carry;
        if (i < a.size()) sum += a[i] - '0';
        if (i < b.size()) sum += b[i] - '0';
        carry = sum / 10;
        res.push_back(sum % 10 + '0');
        i++;
    }
    reverse(res.begin(), res.end());
    return res;
}

// ------------------------------
// 2. 高精度减法 (a - b，保证 a >= b)
// ------------------------------
string sub(string a, string b) {
    reverse(a.begin(), a.end());
    reverse(b.begin(), b.end());
    string res;
    int borrow = 0, i = 0;
    while (i < a.size()) {
        int digitA = a[i] - '0' - borrow;
        int digitB = (i < b.size()) ? b[i] - '0' : 0;
        borrow = 0;
        if (digitA < digitB) {
            digitA += 10;
            borrow = 1;
        }
        res.push_back(digitA - digitB + '0');
        i++;
    }
    reverse(res.begin(), res.end());
    int pos = res.find_first_not_of('0');
    if (pos == string::npos) return "0";
    return res.substr(pos);
}

// ------------------------------
// 3. 高精度乘法 (a * b)
// ------------------------------
string mul(string a, string b) {
    reverse(a.begin(), a.end());
    reverse(b.begin(), b.end());
    vector<int> res(a.size() + b.size(), 0);

    for (int i = 0; i < a.size(); i++)
        for (int j = 0; j < b.size(); j++)
            res[i + j] += (a[i] - '0') * (b[j] - '0');

    int carry = 0;
    for (int k = 0; k < res.size(); k++) {
        int total = res[k] + carry;
        res[k] = total % 10;
        carry = total / 10;
    }

    string ans;
    for (int x : res) ans.push_back(x + '0');
    reverse(ans.begin(), ans.end());
    int pos = ans.find_first_not_of('0');
    return pos == string::npos ? "0" : ans.substr(pos);
}

// ------------------------------
// 辅助：比较 a >= b
// ------------------------------
bool ge(string a, string b) {
    if (a.size() != b.size()) return a.size() > b.size();
    return a >= b;
}

// ------------------------------
// 4. 高精度除法 (a / b，整数除法，向下取整)
// ------------------------------
string div(string a, string b) {
    string res, cur;
    for (char c : a) {
        cur += c;
        if (cur.size() == 1 && cur[0] == '0') cur = "";
        int cnt = 0;
        while (ge(cur, b)) {
            cur = sub(cur, b);
            cnt++;
        }
        if (!res.empty() || cnt) res.push_back(cnt + '0');
    }
    return res.empty() ? "0" : res;
}

// ------------------------------
// 5. 高精度取模 (a % b)
// ------------------------------
string mod(string a, string b) {
    string cur;
    for (char c : a) {
        cur += c;
        if (cur.size() == 1 && cur[0] == '0') cur = "";
        while (ge(cur, b)) cur = sub(cur, b);
    }
    return cur.empty() ? "0" : cur;
}

// ------------------------------
// 测试主函数
// ------------------------------
int main() {
    string a, b;
    cin >> a >> b;

    cout << "a + b = " << add(a, b) << endl;
    if (ge(a, b)) cout << "a - b = " << sub(a, b) << endl;
    cout << "a * b = " << mul(a, b) << endl;
    cout << "a / b = " << div(a, b) << endl;
    cout << "a % b = " << mod(a, b) << endl;

    return 0;
}
```

## 实现要点

| 运算 | 核心操作 | 复杂度 |
| --- | --- | --- |
| 加法 | 逆序后按位相加，处理进位 | $O(n)$ |
| 减法 | 逆序后按位相减，处理借位 | $O(n)$ |
| 乘法 | 双层循环累加到 `res[i+j]`，最后统一进位 | $O(nm)$ |
| 除法 | 逐位试减，商累加 | $O(n^2)$ |
| 取模 | 逐位试减，保留余数 | $O(n^2)$ |

除法与取模用的是试减法，正确性是确定的，但常数较大。如果数据规模很大，可以换成二分商的做法，把单次试减降到 $O(\log 10) \approx O(1)$。
