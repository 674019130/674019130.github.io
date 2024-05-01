---
title: LeetCode record 2024-05
# date: 2024-05-02 02:28:12
tags: [LeetCode, 算法]
categories: [LeetCode]
excerpt_type: md
excerpt: LeetCode 2024 年 5 月 刷题记录。
author: 苏
color:
toc: true
medium_zoom: true
---

## [2462. 雇佣 K 位工人的总代价](https://leetcode.cn/problems/total-cost-to-hire-k-workers/) 中等

给你一个下标从 **0** 开始的整数数组 `costs` ，其中 `costs[i]` 是雇佣第 `i` 位工人的代价。

同时给你两个整数 `k` 和 `candidates` 。我们想根据以下规则恰好雇佣 `k` 位工人：

- 总共进行 `k` 轮雇佣，且每一轮恰好雇佣一位工人。

- 在每一轮雇佣中，从最前面  `  candidates  `   和最后面 `  candidates `   人中选出代价最小的一位工人，如果有多位代价相同且最小的工人，选择下标更小的一位工人。

  - 比方说，`costs = [3,2,7,7,1,2]` 且 `candidates = 2` ，第一轮雇佣中，我们选择第 `4` 位工人，因为他的代价最小 `[*3,2*,7,7,***1**,2*]` 。
  - 第二轮雇佣，我们选择第 `1` 位工人，因为他们的代价与第 `4` 位工人一样都是最小代价，而且下标更小，`[*3,**2***,7,*7,2*]` 。注意每一轮雇佣后，剩余工人的下标可能会发生变化。

- 如果剩余员工数目不足 `candidates` 人，那么下一轮雇佣他们中代价最小的一人，如果有多位代价相同且最小的工人，选择下标更小的一位工人。

- 一位工人只能被选择一次。

返回雇佣恰好 `k` 位工人的总代价。


**示例 1：**

```
输入：costs = [17,12,10,2,7,2,11,20,8], k = 3, candidates = 4
输出：11
解释：我们总共雇佣 3 位工人。总代价一开始为 0 。
- 第一轮雇佣，我们从 [17,12,10,2,7,2,11,20,8] 中选择。最小代价是 2 ，有两位工人，我们选择下标更小的一位工人，即第 3 位工人。总代价是 0 + 2 = 2 。
- 第二轮雇佣，我们从 [17,12,10,7,2,11,20,8] 中选择。最小代价是 2 ，下标为 4 ，总代价是 2 + 2 = 4 。
- 第三轮雇佣，我们从 [17,12,10,7,11,20,8] 中选择，最小代价是 7 ，下标为 3 ，总代价是 4 + 7 = 11 。注意下标为 3 的工人同时在最前面和最后面 4 位工人中。
总雇佣代价是 11 。
```

**示例 2：**

```
输入：costs = [1,2,4,1], k = 3, candidates = 3
输出：4
解释：我们总共雇佣 3 位工人。总代价一开始为 0 。
- 第一轮雇佣，我们从 [1,2,4,1] 中选择。最小代价为 1 ，有两位工人，我们选择下标更小的一位工人，即第 0 位工人，总代价是 0 + 1 = 1 。注意，下标为 1 和 2 的工人同时在最前面和最后面 3 位工人中。
- 第二轮雇佣，我们从 [2,4,1] 中选择。最小代价为 1 ，下标为 2 ，总代价是 1 + 1 = 2 。
- 第三轮雇佣，少于 3 位工人，我们从剩余工人 [2,4] 中选择。最小代价是 2 ，下标为 0 。总代价为 2 + 2 = 4 。
总雇佣代价是 4 。
```

**提示：**

- `1 <= costs.length <= 105 `
- `1 <= costs[i] <= 105`
- `1 <= k, candidates <= costs.length`

### 思路

第一时间想到的还是暴力模拟，没有细琢磨数据量下时间复杂度的问题，先是因为打印太多 Debug 的东西 OLE，改到过了前几个样例之后 TLE 了。

问题主要出在每次选值都要获取两个子集，然后取其各自的最小值，时间复杂度大概在
$$ O ( k * candidates) \approx O(n ^ 2) $$
对于 $10^5$ 的数据量来说暴力 TLE 也不奇怪了。（**除去复制元素和开辟空间带来的时间开销，还有没有记录下标位置，还要再遍历去删除元素，再就是没有对 $2 * candidates \ge cost.size$ 这种情况做剪枝处理。**）

想办法复用每次排序的结果，最简单的就是上优先队列，先改了一版出来，然后在数个 corner case 的折磨下终于 AC 了。

最近大量依赖打印的日志 Debug，感觉应该逐渐减少这种依赖，最终目标是一次 AC。

``` java
public long totalCostTLE(int[] costs, int k, int candidates) {
    long ans = 0;

    List<Integer> costList = new java.util.ArrayList<>(Arrays.stream(costs)
                                                       .boxed()
                                                       .toList());

    while (k-- > 0) {
        //                System.out.println(costList);

        // 前闭后开区间
        List<Integer> pre = costList.subList(0, Math.min(candidates, costList.size()));
        List<Integer> rear = costList.subList(Math.max(0, costList.size() - candidates), costList.size());

        //                System.out.println(pre);
        //                System.out.println(rear);

        Integer minpre = pre.stream().min(Comparator.comparingInt(s -> s)).get();
        Integer minRear = rear.stream().min(Comparator.comparingInt(s -> s)).get();

        //                System.out.println("两个最小值：" + minpre + " " + minRear);

        Integer minCost = Math.min(minpre, minRear);
        int index = -1;
        for (int i = 0; i < Math.min(candidates, costList.size()); ++i) {
            if (Objects.equals(costList.get(i), minCost)) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            for (int i = Math.max(0, costList.size() - candidates); i < costList.size(); ++i) {
                if (Objects.equals(costList.get(i), minCost)) {
                    index = i;
                    break;
                }
            }
        }

        //                System.out.println("整个列表的实际最小值为：" + costList.stream().min(Comparator.comparingInt(s -> s)).get());
        //                System.out.println("下标为" + index + "的被移除，其值为" + minCost);
        costList.remove(index);

        ans += minCost;
    }

    return ans;
}
```

```java
public long totalCost(int[] costs, int k, int candidates) {
    Queue<Integer> pre = new PriorityQueue<>();
    Queue<Integer> rear = new PriorityQueue<>();

    // 左指针右移添加元素
    int lp = 0;
    // 右指针左移添加元素
    int rp = costs.length - 1;
    long ans = 0;

    if (candidates * 2 >= costs.length) {
        Arrays.sort(costs);
        for (int i = 0; i < k; ++i) {
            ans += costs[i];
        }
        return ans;
    }

    while (k > 0) {
        while (pre.size() < candidates && lp <= rp) {
            pre.add(costs[lp++]);
        }
        while (rear.size() < candidates && lp <= rp) {
            rear.add(costs[rp--]);
        }

        k--;
        int p = pre.isEmpty() ? Integer.MAX_VALUE : pre.peek();
        int r = rear.isEmpty() ? Integer.MAX_VALUE : rear.peek();
        if (p <= r) {
            System.out.println("pre: " + pre.peek());
            ans += pre.poll();
        } else {
            System.out.println("rear: " + rear.peek());
            ans += rear.poll();
        }
    }

    return ans;
}
```

