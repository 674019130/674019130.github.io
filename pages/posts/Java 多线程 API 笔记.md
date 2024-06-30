---
title: Java 多线程 API 笔记（待填坑）
date: 2024-06-30 22:47:12
tags: [Java, 多线程, API]
categories: [笔记, Java]
author: 苏
# type: yuque
# hide: true
---

#### 除了要理解 Java 多线程的内存模型，还要熟悉相关的 Java API，最好能再看下多线程工具实现的源码。

<!-- more -->

## java.util.concurrent.CompletableFuture

```java
public class CompletableFuture<T> implements Future<T>, CompletionStage<T>
// Since 1.8
```