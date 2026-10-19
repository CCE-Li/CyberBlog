---
title: "乘法逆元：模意义下的除法"
date: 2026-09-28
lastmod: 2026-09-28
description: "模运算里没有分数，除以 a 要改成乘 a 的逆元；模数为质数时用费马小定理配快速幂。"
group: "数学与数论"
weight: 10
tags: ["数论", "逆元", "快速幂"]
categories: ["算法"]
isNote: true
math: true
---

## 先记住前提

本文讨论的是**模运算**下的除法，模数为 $10^9 + 7$，而且它是**质数**。

## 普通数学里的除法

正常算数中：

$$
6 \div 2 = 3
$$

除以 2，等价于乘 2 的倒数：

$$
6 \times \frac{1}{2} = 3
$$

## 模运算里的坑

在模 $10^9+7$ 这种整数环境中，**没有小数、没有分数**。

不能直接写 `/2`、`/3`，那样会直接算错。那想做除法怎么办？

**找一个整数 $x$，代替「除以 $a$」**，这个 $x$ 就叫 $a$ 在模 $mod$ 下的乘法逆元。

## 逆元的定义

若

$$
a \times x \equiv 1 \pmod{mod}
$$

则 $x$ 是 $a$ 的乘法逆元。

它的作用是：

$$
b \div a \iff b \times x \pmod{mod}
$$

即 **除以 $a$ 等于乘 $a$ 的逆元**。

## 实例（mod = 1e9+7）

- 除以 2，乘 `inv2 = 500000004`：

$$
2 \times 500000004 \equiv 1 \pmod{10^9+7}
$$

- 除以 3，乘 `inv3 = 333333336`：

$$
3 \times 333333336 \equiv 1 \pmod{10^9+7}
$$

## 为什么代码里必须用逆元

原式里有 $\dfrac{A}{2}$、$\dfrac{B}{3}$，在 `mod = 1e9+7` 下必须写成：

- `A * inv2 % mod`
- `B * inv3 % mod`

## 质数模下怎么求逆元

模数是质数时，由费马小定理：

$$
a^{-1} \equiv a^{\,mod-2} \pmod{mod}
$$

所以直接用快速幂就能求出任意非零数的逆元：

```cpp
long long qpow(long long a, long long b, long long mod) {
    long long res = 1 % mod;
    a %= mod;
    while (b > 0) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}

int inv(int x) {
    return qpow(x, mod - 2, mod);
}
```

## 线性预处理逆元

需要频繁求逆元时，可以 $O(n)$ 一次算完：

```cpp
inv[1] = 1;
for (int i = 2; i <= n; i++)
    inv[i] = (mod - mod / i) * inv[mod % i] % mod;
```

## 一句话总结

- 普通数学：除以一个数等于乘它的倒数。
- 模质数数学：除以一个数等于乘它的**乘法逆元**。
- 逆元就是模意义下的「整数版倒数」。

前提是 $a$ 与 $mod$ 互质，模数为质数时只要 $a$ 不是 $mod$ 的倍数即可。
