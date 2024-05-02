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

## [857. 雇佣 K 名工人的最低成本](https://leetcode.cn/problems/minimum-cost-to-hire-k-workers/) 困难

[算术评级: 8](https://leetcode.cn/problems/minimum-cost-to-hire-k-workers/description/?envType=daily-question&envId=2024-05-02)[第 90 场周赛](https://leetcode.cn/contest/weekly-contest-90)[Q4](https://leetcode.cn/contest/weekly-contest-90/problems/minimum-cost-to-hire-k-workers)

2260

有 `n` 名工人。 给定两个数组 `quality` 和 `wage` ，其中，`quality[i]` 表示第 `i` 名工人的工作质量，其最低期望工资为 `wage[i]` 。

现在我们想雇佣 `k` 名工人组成一个*工资组。*在雇佣 一组 `k` 名工人时，我们必须按照下述规则向他们支付工资：

1. 对工资组中的每名工人，应当按其工作质量与同组其他工人的工作质量的比例来支付工资。
2. 工资组中的每名工人至少应当得到他们的最低期望工资。

给定整数 `k` ，返回 *组成满足上述条件的付费群体所需的最小金额* 。在实际答案的 `10-5` 以内的答案将被接受。。

 

**示例 1：**

```
输入： quality = [10,20,5], wage = [70,50,30], k = 2
输出： 105.00000
解释： 我们向 0 号工人支付 70，向 2 号工人支付 35。
```

**示例 2：**

```
输入： quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
输出： 30.66667
解释： 我们向 0 号工人支付 4，向 2 号和 3 号分别支付 13.33333。
```

 

**提示：**

- `n == quality.length == wage.length`
- `1 <= k <= n <= 104`
- `1 <= quality[i], wage[i] <= 104`

### 思路

hard 题，一开始没读懂题意，看了半天样例。quality 可以看作工时，第一条要求是同工同酬。

第一想法贪心暴力，先算出时薪，对这个时薪的要求是 **这个时薪 * 每个人的工时须 >= wage[i]**。

写了一版常数还挺大的 $O(n^2)$​ 的，在第 41 个样例就 TLE 了。:cry:

可能对于 medium 题来说这样的写法再优化一下常数已经可以 AC 了，但是对于 hard 来说显然需要更深层次的优化。

考虑了很多剪枝，但是左右不大，几乎没有什么优化的效果。

---

看了一眼提示，最重要的一句话出现了：**所有期望时薪比当前时薪低的工人，都可以雇佣，所有期望时薪比当前时薪高的工人，都不能雇佣**

基于此结论，可以不必再遍历整个数组来维护 **当前时薪下前 $k$ 个最小工时** 了。**因为要想有资格进入这个优先队列，首先当前时薪要符合这个人的要求。**

$$ans = qualitySum * hourlyWage$$

维护一个最大堆，里面放在按升序遍历 $hourlyWage$ 时当前时薪下的最小工时，如果 $curQuality$ 小于堆顶元素，则触发 $qualitySum$ 更小的条件，则有可能有更小的 $ans$。

另，**在按升序遍历 $ hourlyWage $ 的情况下，要想新的 $ans$ 更小，则必须有更小的 $curQuality$，所以更新时不必思考 $curQuality$ 没有更小但是在当前时薪下 $ans$ 更小的情况。**

一开始是用 ` ans += qualityQueue.stream().map(s -> curHW * s).reduce(Double::sum).get();`算的，结果在最后一个样例 TLE 了，于是改成维护一个当前总和，不用再每次都相加计算了。

最后一个样例 $k =  6807$​，怪不得 TLE 了 QAQ

一共做了接近三个半小时，有刚上大学时候通宵搞 ACM 的感觉了，忆往昔，而今迈步从头越。

``` java
public double mincostToHireWorkers(int[] quality, int[] wage, int k) {

    class Pair<L, R> {
        private L key;
        private R value;

        public Pair(L key, R value) {
            this.key = key;
            this.value = value;
        }

        public L getKey() {
            return key;
        }

        public R getValue() {
            return value;
        }

        @Override
        public String toString() {
            return "\nPair{" +
                "key=" + key +
                ", value=" + value +
                '}';
        }
    }

    // 1. 先算时薪
    // 2. 这个时薪 * 每个人的工时须 >= wage[i]
    // 思路：贪心，从最低时薪开始算
    // 暴力算出当前时薪下每个人需要支付的薪水，取前 K 小个值

    // 考虑如何剪枝
    // 考虑一个推测，如果使用的当前时薪超出了半数人的时薪，那么每个人当前时薪下需要支付的薪水之和必然不是最低的，即符合要求的最低时薪一定在前 (quality.length / 2) + 1 中。
    // 暂时想不到如何证明。(错误的。 T_T）

    // 所有期望时薪比当前时薪低的工人，都可以雇佣，所有期望时薪比当前时薪高的工人，都不能雇佣
    // ans = qualitySum * hourlyWage;
    // 在按升序遍历 hourlyWage 的情况下，要想新的 ans 更小，则必须有更小的 curQuality，所以更新时不必思考 curQuality 没有更小但是在当前时薪下 ans 更小的情况。

    List<Pair<Integer, Double>> hwList = new ArrayList<>();

    for (int i = 0; i < quality.length; ++i) {
        double hw = (double) wage[i] / quality[i];
        hwList.add(new Pair<>(i, hw));
    }

    hwList.sort(Comparator.comparingDouble(Pair::getValue));

    double minAns = Double.MAX_VALUE;

    Queue<Integer> qualityQueue = new PriorityQueue<>(k, Comparator.comparingInt(s -> -s));
    int curSumQuality = 0;

    for (Pair<Integer, Double> pair : hwList) {
        double curHW = pair.getValue();
        int index = pair.key;
        double ans = 0;

        boolean include = false;
        if (qualityQueue.size() < k) {
            qualityQueue.add(quality[index]);
            curSumQuality += quality[index];
            include = true;
        } else if (quality[index] < qualityQueue.peek() && qualityQueue.size() == k) {
            curSumQuality -= qualityQueue.poll();
            curSumQuality += quality[index];
            qualityQueue.add(quality[index]);
            include = true;
        }


        ans +=  curSumQuality * curHW;
        if (qualityQueue.size() == k && include) {
            minAns = Math.min(minAns, ans);
        }
    }

    //        while (!hourlyWageQueue.isEmpty()) {
    //            double ans = 0;
    //
    //            Pair<Integer, Double> poll = hourlyWageQueue.poll();
    //            double curHW = poll.getValue();
    //            ans += wage[poll.key];
    //
    //            // 指定容量，剪枝大数据量下的堆维护开销
    //            Queue<Double> wageQueue = new PriorityQueue<>(k - 1 > 0 ? k - 1 : 1);
    //
    //            // 求当前时薪下前 k 小个满足工人要求的薪水
    //            // 1. 考虑按时薪升序开始算，满 k 个就退出循环剪枝。但是有可能这个人的工时很高，只是时薪低，这时候这个人的薪水也会巨高，不能这样剪
    //            // 2. 考虑按期望薪资升序开始算，满 k 个就退出循环剪枝。但是这个人可能时薪巨高，只是期望薪资低，工时其实更远小于其他人，这时候这个人的薪水也会巨高，感觉也不能这样剪
    //            int curIndex = 0;
    //            for (int i = 0; i < hwList.size(); ++i) {
    //                if (hwList.get(i).getValue() == curHW) {
    //                    curIndex = i;
    //                }
    //            }
    //
    //            for (int i = 0; i < curIndex; ++i) {
    //                wageQueue.add(quality[hwList.get(i).getKey()] * curHW);
    //            }
    //
    //            // 剪枝
    //            if (wageQueue.size() >= k - 1) {
    //                int kCopy = k;
    //                while (--kCopy > 0) {
    //                    ans += wageQueue.poll();
    //                }
    //
    //                minAns = Math.min(ans, minAns);
    //            }
    //        }

    return minAns;
}
```

