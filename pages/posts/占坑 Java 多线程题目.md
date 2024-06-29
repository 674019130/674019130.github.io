---
title: Java 多线程题目
date: 2024-05-03 02:28:12
tags: [Java, 多线程, 面试题]
categories: [代码, 多线程代码片段]
author: 苏
type: yuque
# hide: true
---

> Talk is cheap, show me the code.

<!-- more -->



## 多线程交替输出



## 线程池和多线程场景题

### 题目描述

在一台4核处理器的服务器上，有一个Java服务需要对上万条用户数据进行处理。每条数据需要依次经过三个方法的处理：方法A和方法B是RPC调用，每次调用耗时约10毫秒，方法C也是RPC调用，处理前需要对A和B的结果进行数据加工。要求设计一个高效的解决方案，使用线程池和多线程并发技术来最大化CPU利用率，并确保RPC调用的高效执行。

### 任务描述

1. **线程池配置**：创建适当大小的线程池或使用可缓存的线程池来处理并发任务。
2. **并行处理**：利用并行流或CompletableFuture进行并行处理，每个用户数据依次进行方法A和方法B的RPC调用。
3. **数据加工和后续处理**：对方法A和方法B的结果进行数据加工后，再调用方法C进行RPC处理。

> 固定线程池大小：
>
> Total processing time: 57018 ms
>
> Total processing time: 56957 ms
>
> Total processing time: 57026 ms
>
> 
>
> Cached 线程池：
>
> Total processing time: 341 ms
>
> Total processing time: 291 ms

```java
package su.github.leetcode;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TestExcetor {
    public static void main(String[] args) {
        // 创建示例用户数据
        List<RpcProcessingService.UserData> userDataList = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            userDataList.add(new RpcProcessingService.UserData(i));
        }

        // 创建并调用RPC处理服务
        RpcProcessingService service = new RpcProcessingService();
        service.processUserData(userDataList);
    }
}

class RpcProcessingService {

    private static final int THREAD_POOL_SIZE = 8; // 根据需要调整线程池大小

//    private ExecutorService threadPool = Executors.newCachedThreadPool();
    private ExecutorService threadPool = Executors.newCachedThreadPool();

    public void processUserData(List<UserData> userDataList) {
        long startTime = System.nanoTime(); // 开始计时

        List<CompletableFuture<Void>> futures = userDataList.stream()
                .map(userData -> CompletableFuture
                        .supplyAsync(() -> methodA(userData), threadPool)
                        .thenCombineAsync(CompletableFuture.supplyAsync(() -> methodB(userData), threadPool), this::processABResults, threadPool)
                        .thenAcceptAsync(this::methodC, threadPool))
                .toList();

        // 等待所有任务完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long endTime = System.nanoTime(); // 结束计时
        long duration = (endTime - startTime) / 1_000_000; // 计算时间差并转换为毫秒
        System.out.println("Total processing time: " + duration + " ms");

        // 关闭线程池
        threadPool.shutdown();
    }

    private ResultA methodA(UserData userData) {
        // RPC调用A
        // 模拟10ms的调用延迟
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new ResultA(); // 返回A方法的结果
    }

    private ResultB methodB(UserData userData) {
        // RPC调用B
        // 模拟10ms的调用延迟
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new ResultB(); // 返回B方法的结果
    }

    private ProcessedResult processABResults(ResultA resultA, ResultB resultB) {
        // 对A和B的结果进行加工
        return new ProcessedResult(resultA, resultB);
    }

    private void methodC(ProcessedResult processedResult) {
        // RPC调用C
        // 模拟10ms的调用延迟
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        // 处理C方法的结果
    }

    // 用户数据类
    static class UserData {
        int id;

        public UserData(int id) {
            this.id = id;
        }

        // 用户数据字段
    }

    // A方法的结果类
    static class ResultA {
        // A方法的结果字段
    }

    // B方法的结果类
    static class ResultB {
        // B方法的结果字段
    }

    // 处理后的结果类
    static class ProcessedResult {
        // 处理后的结果字段

        public ProcessedResult(ResultA resultA, ResultB resultB) {
            // 结合A和B的结果
        }
    }
}

```

