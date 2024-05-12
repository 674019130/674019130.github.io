---
title: LeetCode record 2024-05
# date: 2024-05-02 02:28:12
tags: [LeetCode, 算法]
categories: [LeetCode]
author: 苏
toc: true
codeHeightLimit: 300
medium_zoom: true
---

**如果有一天没有打卡，会不会辜负踌躇满志的那个自己。**

<!-- more -->

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

另，**在按升序遍历 $hourlyWage$ 的情况下，要想新的 $ans$ 更小，则必须有更小的 $curQuality$，所以更新时不必思考 $curQuality$ 没有更小但是在当前时薪下 $ans$ 更小的情况。**

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

## [1235. 规划兼职工作](https://leetcode.cn/problems/maximum-profit-in-job-scheduling/) 困难

你打算利用空闲时间来做兼职工作赚些零花钱。

这里有 `n` 份兼职工作，每份工作预计从 `startTime[i]` 开始到 `endTime[i]` 结束，报酬为 `profit[i]`。

给你一份兼职工作表，包含开始时间 `startTime`，结束时间 `endTime` 和预计报酬 `profit` 三个数组，请你计算并返回可以获得的最大报酬。

注意，时间上出现重叠的 2 份工作不能同时进行。

如果你选择的工作在时间 `X` 结束，那么你可以立刻进行在时间 `X` 开始的下一份工作。



**示例 1：**

**![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/10/19/sample1_1584.png)**

```
输入：startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
输出：120
解释：
我们选出第 1 份和第 4 份工作，
时间范围是 [1-3]+[3-6]，共获得报酬 120 = 50 + 70。
```

**示例 2：**

**![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/10/19/sample22_1584.png)**

```
输入：startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]
输出：150
解释：
我们选择第 1，4，5 份工作。
共获得报酬 150 = 20 + 70 + 60。
```

**示例 3：**

**![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/10/19/sample3_1584.png)**

```
输入：startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]
输出：6
```



**提示：**

- `1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4`
- `1 <= startTime[i] < endTime[i] <= 10^9`
- `1 <= profit[i] <= 10^4`

### 思路

一眼 DP，但是动态规划一直都是我的弱项，之前学的时候只学会了完全背包多重背包那几个，但是还是试着推了一下递推公式。

先按照**开始时间升序排序**，遍历工作。（现在想一下，可能应该遍历时间点，但是这样应该更复杂，不考虑做法了）

不难发现要求的结果是 $[0, endTime_{max}]$ 时间里的最大值，于是一开始定义 $dp[i]$ 为时间点 $i$ 能获取的最大报酬，递推公式：

$$ dp[Job[i].endTime] = max(dp[i-1], \quad dp[Job[i].startTime] + Job[i].profit) $$

写了一下发现过不去样例（写的也很简单，输出了一下 `dp[]`的值发现根本不连续，没有做到把问题拆分成子问题解决，递推公式里，`dp[i]` 和 `dp[i-1]` 之间没有明确的转移关系，这应该就是问题所在。

既然这样写递推公式没法联系 `dp[i]` 和 `dp[i-1]` ，**那么就要考虑改变 `dp` 数组的定义**。

看了一眼题解，感觉有点像模拟当前这个工作做与不做的模式，即定义 $dp[i]$ 为**按照结束时间升序排序**时前 $i$ 份工作能获取的最大报酬。

对于当前工作 $Job[i]$，有两种选择：

- 不选当前工作，则 $dp[i] = dp[i - 1]$
- 选择当前工作，则 $dp[i] = dp[j] + Job[i].profit$，**其中 $j$ 为最接近在这份工作开始时间的工作的下标，通过这个下标可以获得在能开始这份工作之前能获取的最大报酬。**

递推公式：

$$dp[i] = max(dp[i - 1], \quad dp[j] + Job[i].profit)$$

实现细节上，由于当 $i=0$ 时 $i-1 = -1$，会产生负数，所以下标都加一变成正数。

$j$ 的寻找用了二分，都知道只有有序数组才能用二分，因为这里是按照结束时间升序排序的，所以查的也是结束时间，用二分是可以的。（这里曾经困扰了我一段时间，后来才想到找的是时间，只要在时间数组里做查找就可以了）

总结一下，首先对于`dp`数组的定义有问题，傻傻的按照样例给的图例的时间轴进行的定义，但是实际上影响结果变化的是一个个工作，这里可能比较难想到的是按结束时间排序，题解里没说为什么这样排，感觉是为了用二分（？）。

其次是对于状态转移方程的认识不够，到底应该怎么定义才是对的，可能要看有没有把问题拆分成子问题，并且使他们与对`dp`数组的定义联系起来，感觉还是挺难的。

但是不管怎么说，这题还是思考之后理解并做出来了，是感觉到一点进步的。可能自己太笨，之前大学时候搞 ACM 对于这种题是一点点思路都没有，也可能是有畏难情绪在吧，现在长大一点了，反而有能力去思考了 T_T。

五一就要过去了，一切都会好的！

```java
public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
    // 其中 dp[i] 表示前 i 份工作能获得的最大报酬
    int[] dp = new int[endTime.length + 1];

    class Job {
        public int st;
        public int ed;
        public int pro;

        public Job(int st, int ed, int pro) {
            this.st = st;
            this.ed = ed;
            this.pro = pro;
        }

        @Override
        public String toString() {
            return "\nJob{" +
                    "st=" + st +
                    ", ed=" + ed +
                    ", pro=" + pro +
                    '}';
        }

        public static int bs(List<Job> jobs, int high, int target) {
            int low = -1;
            while (low + 1 < high) {
                int mid = (high - low) / 2 + low;
                if (jobs.get(mid).ed > target) {
                    high = mid;
                } else {
                    low = mid;
                }
            }

            return low;
        }
    }

    List<Job> jobs = new ArrayList<>();

    for (int i = 0; i < profit.length; ++i) {
        jobs.add(new Job(startTime[i], endTime[i], profit[i]));
    }

    jobs.sort((a, b) -> b.ed - a.ed);

    System.out.println(jobs);

    for (int i = 0; i < jobs.size(); ++i) {
        int j = Job.bs(jobs, i, jobs.get(i).st);
        dp[i + 1] = Math.max(dp[i], dp[j + 1] + jobs.get(i).pro);
    }

    for (int i : dp) {
        System.out.println(i);
    }

    return dp[profit.length];
}
```

## [3. 无重复字符的最长子串 ](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)中等

已解答

[算术评级: 5](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长** **子串** 的长度。

**示例 1:**

```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2:**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```



**提示：**

- `0 <= s.length <= 5 * 104`
- `s` 由英文字母、数字、符号和空格组成

### 思路

前两天的每日一题是在我看来不可做的 DP，直接放弃。今天来 A 一道经典题目，稍微思考一下就知道滑动窗口可做，5分钟速A。

```java
public int lengthOfLongestSubstring(String s) {
    int ans = 0;

    for (int i = 0; i < s.length(); ++i) {
        Set<Character> chars = new HashSet<>();
        chars.add(s.charAt(i));

        for (int j = i + 1; j < s.length(); ++j) {
            if (!chars.contains(s.charAt(j))) {
                chars.add(s.charAt(j));
            } else {
                break;
            }
        }
        ans = Math.max(ans, chars.size());
    }

    return ans;
}
```

## [1553. 吃掉 N 个橘子的最少天数](https://leetcode.cn/problems/minimum-number-of-days-to-eat-n-oranges/) 困难

厨房里总共有 `n` 个橘子，你决定每一天选择如下方式之一吃这些橘子：

- 吃掉一个橘子。
- 如果剩余橘子数 `n` 能被 2 整除，那么你可以吃掉 `n/2` 个橘子。
- 如果剩余橘子数 `n` 能被 3 整除，那么你可以吃掉 `2*(n/3)` 个橘子。

每天你只能从以上 3 种方案中选择一种方案。

请你返回吃掉所有 `n` 个橘子的最少天数。

 

**示例 1：**

```
输入：n = 10
输出：4
解释：你总共有 10 个橘子。
第 1 天：吃 1 个橘子，剩余橘子数 10 - 1 = 9。
第 2 天：吃 6 个橘子，剩余橘子数 9 - 2*(9/3) = 9 - 6 = 3。（9 可以被 3 整除）
第 3 天：吃 2 个橘子，剩余橘子数 3 - 2*(3/3) = 3 - 2 = 1。
第 4 天：吃掉最后 1 个橘子，剩余橘子数 1 - 1 = 0。
你需要至少 4 天吃掉 10 个橘子。
```

**示例 2：**

```
输入：n = 6
输出：3
解释：你总共有 6 个橘子。
第 1 天：吃 3 个橘子，剩余橘子数 6 - 6/2 = 6 - 3 = 3。（6 可以被 2 整除）
第 2 天：吃 2 个橘子，剩余橘子数 3 - 2*(3/3) = 3 - 2 = 1。（3 可以被 3 整除）
第 3 天：吃掉剩余 1 个橘子，剩余橘子数 1 - 1 = 0。
你至少需要 3 天吃掉 6 个橘子。
```

**示例 3：**

```
输入：n = 1
输出：1
```

**示例 4：**

```
输入：n = 56
输出：6
```

**提示：**

- `1 <= n <= 2*10^9`

### 思路

一眼 DFS，一分钟写了一个，果然 TLE 了。

考虑剪枝和记忆化，先存一下每次走到当前数目时是否比之前走过时需要的时间更短，如果已经更久，那么剪枝。

考虑贪心，如果能被 3 整除，那么可以一次吃掉 $\frac{2n}{3}$ 个橘子，显然比 $\frac{n}{2}$ 要大，优先走这一步，争取走出最终结果的函数调用足够靠前，这样能 break 后续的所有调用，也算是剪枝。

但是还是在 $n=166188$ 的时候 TLE 了。

再改，初始化时将 `Map<Integer, Integer> memo` 的容量初始化为 $n$，降低扩容次数
