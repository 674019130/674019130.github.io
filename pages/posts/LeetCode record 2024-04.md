---
title: LeetCode record 2024-04
date: 2024-04-27 00:00:00
tags: [LeetCode, 刷题记录]
categories: [技术笔记, 算法与数据结构]
excerpt: LeetCode 2024 年 4 月 刷题记录。
author: 苏
toc: true
medium_zoom: true
---

## [1017. 负二进制转换](https://leetcode.cn/problems/convert-to-base-2/) 中等

给你一个整数 `n` ，以二进制字符串的形式返回该整数的 **负二进制（`base -2`）**表示。

**注意，**除非字符串就是 `"0"`，否则返回的字符串中不能含有前导零。

**示例 1：**

```
输入：n = 2
输出："110"
解释：(-2)2 + (-2)1 = 2
```

**示例 2：**

```
输入：n = 3
输出："111"
解释：(-2)2 + (-2)1 + (-2)0 = 3
```

**示例 3：**

```
输入：n = 4
输出："100"
解释：(-2)2 = 4
```

**提示：**

- `0 <= n <= 109`

### 思路：

第一时间没想到短除法（忘了T_T），先写了个 demo 算了下表示 n 的最大位数，然后打算在这个范围内穷举来着，但是太暴力了感觉写了可能也要 TLE，遂放弃。

然后找规律，从 0 写到了 7，没什么很好的规律。然后搜二进制，想起了短除法，先写了普通二进制的 demo，对于负二进制想必同理，**但是余数存在负数的情况**，思路卡住，遂看题解。

> 但是由于是负数，我们在取余的时候，可能会出现负数。但是二进制是没有负数的，因此我们要将余数为负数修正为余数为正数，即 -1 修正为 1，对应的商就应该增加 1。https://leetcode.cn/problems/convert-to-base-2/solutions/2759014/javapython3cmo-ni-shu-xue-jin-zhi-zhuan-9j7na/

调整代码，AC。

``` java
package su.github.leetcode;

public class m04d28 {
    class Solution {
        public String baseNeg2(int n) {

            if (n == 0) {
                return "0";
            }

            StringBuilder sb = new StringBuilder();
            while (n != 0) {
                int mo = n % -2;
                n /= (-2);
                if (mo < 0) {
                    n += 1;
                    mo = -mo;
                }
                sb.append(mo);
            }

            return sb.reverse().toString();
        }
    }
}

```

## [1329. 将矩阵按对角线排序](https://leetcode.cn/problems/sort-the-matrix-diagonally/) 中等

**矩阵对角线** 是一条从矩阵最上面行或者最左侧列中的某个元素开始的对角线，沿右下方向一直到矩阵末尾的元素。例如，矩阵 `mat` 有 `6` 行 `3` 列，从 `mat[2][0]` 开始的 **矩阵对角线** 将会经过 `mat[2][0]`、`mat[3][1]` 和 `mat[4][2]` 。

给你一个 `m * n` 的整数矩阵 `mat` ，请你将同一条 **矩阵对角线** 上的元素按升序排序后，返回排好序的矩阵。

**示例 1：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/25/1482_example_1_2.png)

```
输入：mat = [[3,3,1,1],[2,2,1,2],[1,1,1,2]]
输出：[[1,1,1,1],[1,2,2,2],[1,2,3,3]]
```

**示例 2：**

```
输入：mat = [[11,25,66,1,69,7],[23,55,17,45,15,52],[75,31,36,44,58,8],[22,27,33,25,68,4],[84,28,14,11,5,50]]
输出：[[5,17,4,1,52,7],[11,11,25,45,8,69],[14,23,25,44,58,15],[22,27,31,36,50,66],[84,28,75,33,55,68]]
```

**提示：**

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 100`
- `1 <= mat[i][j] <= 100`

### 思路

模拟题且数据量不大，考虑暴力模拟，按对角线存储数据并排序，后按照遍历顺序放回原位。

代码有点粗糙，应该还有优化空间，比如取完一条对角线后就排序并放回原位，应该会降低一下常数时间复杂度。不管怎么说，没看题解顺利 AC ，开心捏o(*￣▽￣*)ブ！

后查看题解，提到 $i - j + m$ 的写法，对于数组`int[n][m]`，**根据同一对角线上的元素的下标之差相等**，考虑最差情况下
$$i - j = 0 - (m - 1) = 1 - m$$
 ，右平移 $m$ 即可将下标平移至以 1 开头的数组中（**其实还是存在一个小疑问，为什么是 1 开头不是 0 开头。经测试，0 开头也是没问题的，可能是为了写起来简单吧**）。附官方题解代码。

```java
class Solution {
    public int[][] diagonalSort(int[][] mat) {
        int n = mat.length, m = mat[0].length;
        List<List<Integer>> diag = new ArrayList<>(m + n);
        for (int i = 0; i < m + n; i++) {
            diag.add(new ArrayList<>());
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                // i - j + m - 1 也能 AC
                diag.get(i - j + m).add(mat[i][j]);
            }
        }
        for (List<Integer> d : diag) {
            Collections.sort(d, Collections.reverseOrder());
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                mat[i][j] = diag.get(i - j + m).removeLast();
            }
        }
        return mat;
    }
}

作者：力扣官方题解
链接：https://leetcode.cn/problems/sort-the-matrix-diagonally/solutions/2754949/jiang-ju-zhen-an-dui-jiao-xian-pai-xu-by-fsf0/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



```java
class Solution {
    public int[][] diagonalSort(int[][] mat) {
        List<List<Integer>> diagonalArray = new ArrayList<>();

        // 右上角开始的对角线 mat[3][4]
        for (int j = mat[0].length - 1; j > 0; --j) {
            List<Integer> temp = new ArrayList<>();
            for (int i = 0, jj = j; i <= mat.length - 1 && jj <= mat[i].length - 1; i++, jj++) {
                temp.add(mat[i][jj]);
            }

            diagonalArray.add(temp);
        }

        // [0][0]开始的对角线
        {
            int i = 0, j = 0;
            List<Integer> temp = new ArrayList<>();
            while (i <= mat.length - 1 && j <= mat[i].length - 1) {
                temp.add(mat[i][j]);
                i++;
                j++;
            }
            diagonalArray.add(temp);
        }

        // 左下角开始的对角线
        for (int i = mat.length - 1; i > 0; --i) {
            List<Integer> temp = new ArrayList<>();
            for (int j = 0, ii = i; j <= mat[i].length - 1 && ii <= mat.length - 1; ++j, ++ii) {
                temp.add(mat[ii][j]);
            }
            diagonalArray.add(temp);
        }

        System.out.println(diagonalArray);

        List<List<Integer>> sorted = diagonalArray.stream()
                .map(s -> s.stream().sorted().toList())
                .toList();

        int[][] ret = new int[mat.length][mat[0].length];
        int index = 0;
        // 右上角开始的对角线 mat[3][4]
        for (int j = mat[0].length - 1; j > 0; --j) {
            List<Integer> temp = sorted.get(index++);
            int indexx = 0;

            for (int i = 0, jj = j; i <= mat.length - 1 && jj <= mat[i].length - 1; i++, jj++) {
                ret[i][jj] = temp.get(indexx++);
            }

            diagonalArray.add(temp);
        }

        // [0][0]开始的对角线
        {
            int i = 0, j = 0;

            int indexx = 0;
            List<Integer> temp = sorted.get(index++);
            while (i <= mat.length - 1 && j <= mat[i].length - 1) {
                ret[i][j] = temp.get(indexx++);
                i++;
                j++;
            }
        }

        // 左下角开始的对角线
        for (int i = mat.length - 1; i > 0; --i) {
            List<Integer> temp = sorted.get(index++);
            int indexx = 0;

            for (int j = 0, ii = i; j <= mat[i].length - 1 && ii <= mat.length - 1; ++j, ++ii) {
                ret[ii][j] = temp.get(indexx++);
            }
            diagonalArray.add(temp);
        }

        return ret;
    }
}
```

## [2. 两数相加](https://leetcode.cn/problems/add-two-numbers/) 中等

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。



**示例 1：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

**示例 2：**

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

**示例 3：**

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

**提示：**

- 每个链表中的节点数在范围 `[1, 100]` 内
- `0 <= Node.val <= 9`
- 题目数据保证列表表示的数字不含前导零

### 思路

当日的每日一题太水了，半分钟 A 了之后从题库开头找了个 medium 题做。

看题意感觉是简化后的链表加法模拟，直接上手做，可能是自己写法的问题，循环退出条件使用了`.next != null`，但是实际上使用当前节点不为空会更好写一点，有很多情况不用再特殊处理了。别的没什么好说的，主要是要注意细节，上 AC 代码。

后看了一下官方题解，官方是两条链表并行遍历到都为`null`，中间的写法更鲁棒一些，代码行数更短。无所谓孰优孰劣吧，我的写法应该胜在分段逻辑清晰（？）。

```java
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {

    ListNode ans = new ListNode(0);
    ListNode head = ans;
    boolean greaterThan10 = false;

    while (l1.next != null && l2.next != null) {
        // calc logic
        ans.val = ((l1.val + l2.val) + (greaterThan10 ? 1 : 0)) % 10;
        greaterThan10 = ((l1.val + l2.val) + (greaterThan10 ? 1 : 0)) >= 10;

        // node move forward
        ans.next = new ListNode(0);
        ans = ans.next;
        l1 = l1.next;
        l2 = l2.next;
    }

    ans.val = ((l1.val + l2.val) + (greaterThan10 ? 1 : 0)) % 10;
    greaterThan10 = ((l1.val + l2.val) + (greaterThan10 ? 1 : 0)) >= 10;

    ListNode unfinished = l1.next != null ? l1.next : l2.next != null ? l2.next : null;
    if (unfinished != null) {
        ans.next = unfinished;
        ans = ans.next;

        while (greaterThan10 && ans.next != null) {
            ans.val += greaterThan10 ? 1 : 0;
            greaterThan10 = ans.val >= 10;
            ans.val %= 10;
            ans = ans.next;
        }

        ans.val += greaterThan10 ? 1 : 0;
        greaterThan10 = ans.val >= 10;
        ans.val %= 10;

        if (greaterThan10) {
            ans.next = new ListNode(1);
            greaterThan10 = false;
        }
    }

    if (greaterThan10) {
        ans.next = new ListNode(1);
    }

    return head;
}
```

