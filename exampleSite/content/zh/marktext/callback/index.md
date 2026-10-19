---
title: "回调函数：从函数指针到 Lambda"
date: 2026-02-06
lastmod: 2026-02-06
description: "回调是异步与事件驱动的基础设施。理清它的三种实现方式、优缺点，以及与闭包、Promise 的关系。"
group: "编程基础"
weight: 10
tags: ["C++", "回调", "异步编程"]
categories: ["编程"]
isNote: true
---

## 什么是回调函数

回调函数是一种特殊的函数：它作为参数传递给另一个函数，并在被调用函数执行完毕后被调用。常见于事件处理、异步编程和各种系统 API。

几个基本概念：

1. **回调**：被传入另一个函数的函数。
2. **异步编程**：代码执行时不会阻塞程序运行的方式。
3. **事件驱动**：程序的执行由外部事件触发，而不是顺序执行。

## 作用与使用场景

回调的核心价值是**把代码逻辑分离出来**，让代码更模块化、更可维护。它还能避免阻塞，提高程序的并发效率，并实现逻辑复用。

典型场景：

- **事件处理**：鼠标点击、键盘输入、网络请求。
- **异步操作**：读取文件、发送邮件、下载文件。
- **数据处理**：排序、过滤、映射的比较函数。
- **插件开发**：WordPress 插件、jQuery 插件。

## 三种实现方式

### 函数指针

函数指针存储函数的地址。作为参数传递后，被调用方就能通过它调用目标函数。

```c
返回类型 (*函数指针名称)(参数列表)
```

例如定义接收两个整数并返回整数的回调：

```c
int (*callback)(int, int);

int add(int a, int b) {
    return a + b;
}

callback = add;
```

### 函数对象 / functor

函数对象是重载了 `operator()` 的类实例。相比函数指针，它可以携带状态。

```cpp
class Add {
public:
    int operator()(int a, int b) {
        return a + b;
    }
};

Add add;
```

### 匿名函数 / Lambda

C++11 之后可以直接用 Lambda 表达式作为回调，无需显式定义函数或类。

```cpp
#include <iostream>
#include <vector>
#include <functional>

void forEach(const std::vector<int>& v, std::function<void(int)> func) {
    for (int i : v) {
        func(i);
    }
}

int main() {
    std::vector<int> v{1, 2, 3, 4, 5};
    forEach(v, [](int i) { std::cout << i << " "; });
    std::cout << std::endl;
    return 0;
}
```

`[]` 是捕获列表，用于访问外部变量；`{}` 是函数体。上例中 `forEach` 接收一个 `std::function<void(int)>`，调用方直接传入 Lambda，代码比函数指针或函数对象简洁得多。

## 应用举例

**网络编程**：连接收到数据后触发回调。

```cpp
void onDataReceived(int socket, char* data, int size);

int main() {
    int socket = connectToServer();
    startReceivingData(socket, onDataReceived);
}

void onDataReceived(int socket, char* data, int size) {
    // 处理数据
}
```

**GUI 编程**：按钮点击时触发回调。

```cpp
void onButtonClicked(Button* button);

int main() {
    Button* button = createButton("Click me");
    setButtonClickHandler(button, onButtonClicked);
}

void onButtonClicked(Button* button) {
    // 处理点击事件
}
```

**多线程**：任务完成后通知主线程。

```cpp
void onTaskCompleted(int taskId);

int main() {
    for (int i = 0; i < numTasks; i++) {
        startBackgroundTask(i, onTaskCompleted);
    }
}

void onTaskCompleted(int taskId) {
    // 处理任务完成事件
}
```

## 优缺点

优点：

- 提高代码的复用性和灵活性，支持模块化编程。
- 解耦模块之间的依赖关系。
- 支持异步执行，避免阻塞线程。

缺点：

- 嵌套过深会导致回调地狱，难以维护。
- 存在共享资源时容易产生竞态条件。
- 大量使用时可能破坏代码的结构与可读性。

一句话概括：**代码灵活、易于扩展，但不易阅读、容易出错**。

## 与其他概念的关系

**与闭包**：闭包由函数及其引用环境组成。当回调需要访问父函数的局部变量时，把回调写在闭包内部就能延长这些变量的生命周期。

**与 Promise**：两者都是异步编程的实现方式。回调通过函数指针或函数对象注册；Promise 则把异步操作封装成对象，用链式 `then()` 与 `catch()` 管理结果，能有效缓解回调地狱。

**与观察者模式**：观察者模式定义一对多的依赖关系，主题状态变化时遍历所有观察者调用其更新方法。这里的更新方法本质上就是回调，因此观察者模式可以看作回调在架构层面的应用。

## 如何写好回调

1. 明确回调的目的和作用域，只关注相关任务。
2. 明确参数与返回值类型，方便调用方使用。
3. 谨慎处理错误与异常，必要时用 try-catch 包裹。
4. 保证回调执行足够快，避免死锁或长时间阻塞。
5. 使用能反映功能的命名，如 `onSuccess`、`onError`、`onComplete`。
6. 提供文档和示例代码。
7. 遵循项目既有的编码规范。

参数设计上，异步回调通常以错误信息作为第一个参数，结果作为第二个参数。也可以额外传入上下文对象，让回调在正确的环境中执行。
