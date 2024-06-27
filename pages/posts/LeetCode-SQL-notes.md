---
title: LeetCode 数据库刷题笔记
author: 苏
date: 2022-11-02 18:04:34
tags: [LeetCode, 数据库]
categories: [LeetCode, 数据库]
readmore: true
excerpt: 记录在 LeetCode SQL 相关的题目。调皮的小知识点有点多，用笔记📔把它们一网打尽！
---

# LeetCode 数据库刷题笔记

> 只做重点的记录。

## [570. 至少有5名直接下属的经理](https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/) 中等

表: `Employee`

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
| department  | varchar |
| managerId   | int     |
+-------------+---------+
id 是此表的主键（具有唯一值的列）。
该表的每一行表示雇员的名字、他们的部门和他们的经理的id。
如果managerId为空，则该员工没有经理。
没有员工会成为自己的管理者。
```

 

编写一个解决方案，找出至少有**五个直接下属**的经理。

以 **任意顺序** 返回结果表。

查询结果格式如下所示。

 

**示例 1:**

```
输入: 
Employee 表:
+-----+-------+------------+-----------+
| id  | name  | department | managerId |
+-----+-------+------------+-----------+
| 101 | John  | A          | Null      |
| 102 | Dan   | A          | 101       |
| 103 | James | A          | 101       |
| 104 | Amy   | A          | 101       |
| 105 | Anne  | A          | 101       |
| 106 | Ron   | B          | 101       |
+-----+-------+------------+-----------+
输出: 
+------+
| name |
+------+
| John |
+------+
```

### 答案

```sql
# Write your MySQL query statement below
select e.name from Employee e
where e.id in (
    select ee.id from Employee ee, Employee eee
    where eee.managerId = ee.id #(1)
    group by ee.id 
    having count(distinct eee.id) >= 5 #(2)
)
```

需要注意的是，要查找对于每一个分组的条件，写在`(1)`处，对筛选之后分组的结果再进行数量限制，写在`(2)`处。与之类似的还有**题目 185**，也可以使用子查询做。

## [185. 部门工资前三高的所有员工](https://leetcode.cn/problems/department-top-three-salaries/) 困难

表: `Employee`

```
+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| id           | int     |
| name         | varchar |
| salary       | int     |
| departmentId | int     |
+--------------+---------+
id 是该表的主键列(具有唯一值的列)。
departmentId 是 Department 表中 ID 的外键（reference 列）。
该表的每一行都表示员工的ID、姓名和工资。它还包含了他们部门的ID。
```

 

表: `Department`

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
+-------------+---------+
id 是该表的主键列(具有唯一值的列)。
该表的每一行表示部门ID和部门名。
```

 

公司的主管们感兴趣的是公司每个部门中谁赚的钱最多。一个部门的 **高收入者** 是指一个员工的工资在该部门的 **不同** 工资中 **排名前三** 。

编写解决方案，找出每个部门中 **收入高的员工** 。

以 **任意顺序** 返回结果表。

返回结果格式如下所示。

 

**示例 1:**

```
输入: 
Employee 表:
+----+-------+--------+--------------+
| id | name  | salary | departmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 85000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
| 5  | Janet | 69000  | 1            |
| 6  | Randy | 85000  | 1            |
| 7  | Will  | 70000  | 1            |
+----+-------+--------+--------------+
Department  表:
+----+-------+
| id | name  |
+----+-------+
| 1  | IT    |
| 2  | Sales |
+----+-------+
输出: 
+------------+----------+--------+
| Department | Employee | Salary |
+------------+----------+--------+
| IT         | Max      | 90000  |
| IT         | Joe      | 85000  |
| IT         | Randy    | 85000  |
| IT         | Will     | 70000  |
| Sales      | Henry    | 80000  |
| Sales      | Sam      | 60000  |
+------------+----------+--------+
```

### 答案

```sql
SELECT
	d.NAME AS Department,
	e.NAME AS Employee,
	e.salary AS Salary 
FROM
	employee e
	LEFT JOIN department d ON e.departmentId = d.id 
WHERE
	e.id IN (
	SELECT
		e1.id 
	FROM
		employee e1,
		employee e2 
	WHERE
		e1.salary <= e2.salary 
		AND e1.departmentId = e2.departmentId 
	GROUP BY
		e1.id 
	HAVING
		count( DISTINCT e2.salary ) <= 3 
	) 
ORDER BY
	Department,
	Salary DESC
```

```sql
select Department, Employee, Salary
from (
    select d.Name as Department, e.Name as Employee, e.Salary as Salary, 
	dense_rank() over (partition by DepartmentId order by Salary desc) as rk
    from Employee as e, Department as d
    where e.DepartmentId = d.Id
) m
where rk <= 3;
```

## 181. 超过经理收入的员工

## 183. 部门工资最高的员工

```mysql
输入：
Employee 表:
+----+-------+--------+--------------+
| id | name  | salary | departmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 70000  | 1            |
| 2  | Jim   | 90000  | 1            |
| 3  | Henry | 80000  | 2            |
| 4  | Sam   | 60000  | 2            |
| 5  | Max   | 90000  | 1            |
+----+-------+--------+--------------+
Department 表:
+----+-------+
| id | name  |
+----+-------+
| 1  | IT    |
| 2  | Sales |
+----+-------+
输出：
+------------+----------+--------+
| Department | Employee | Salary |
+------------+----------+--------+
| IT         | Jim      | 90000  |
| Sales      | Henry    | 80000  |
| IT         | Max      | 90000  |
+------------+----------+--------+
解释：Max 和 Jim 在 IT 部门的工资都是最高的，Henry 在销售部的工资最高。
```

双字段使用`in`

```
select d.name as Department, e.name as Employee, e.Salary as Salary
from Employee e , Department d
where e.Departmentid = d.id
and
(e.DepartmentId, Salary)
in
(select Departmentid, max(Salary) from Employee GROUP BY DepartmentId )
```

## 180. 连续出现的数字

```mysql
输入：
Logs 表：
+----+-----+
| Id | Num |
+----+-----+
| 1  | 1   |
| 2  | 1   |
| 3  | 1   |
| 4  | 2   |
| 5  | 1   |
| 6  | 2   |
| 7  | 2   |
+----+-----+
输出：
Result 表：
+-----------------+
| ConsecutiveNums |
+-----------------+
| 1               |
+-----------------+
解释：1 是唯一连续出现至少三次的数字。
```

对一张表重复关联3次，横向比较。

```mysql
select distinct l1.num as ConsecutiveNums
from logs l1, logs l2, logs l3
where l1.num = l2.num and l2.num = l3.num and l1.id = l2.id - 1 and l2.id = l3.id - 1
```

## 178. 分数排名

MySql8.x 版本以上支持`rank()`开窗函数。

Oracle 和 SqlServer 也支持，但是没有查具体版本。

> https://blog.csdn.net/u013317445/article/details/100514974
>
> MySql 之 rank() over(order by)、rank() over(partition by order by)

在版本不支持开窗函数的情况下，使用语义分析，**rank **即为前面有多少比自己「大」的数据，根据排名规则（如并列排名，顺序排名等）进行去重等操作，一样可以实现添加排名的功能。

```mysql
select a.Score as Score,
(select count(distinct b.Score) from Scores b where b.Score >= a.Score) as Rank
from Scores a
order by a.Score DESC
```

## 626. 换座位

```mysql
输入:
Seat 表:
+----+---------+
| id | student |
+----+---------+
| 1  | Abbot   |
| 2  | Doris   |
| 3  | Emerson |
| 4  | Green   |
| 5  | Jeames  |
+----+---------+
输出:
+----+---------+
| id | student |
+----+---------+
| 1  | Doris   |
| 2  | Abbot   |
| 3  | Green   |
| 4  | Emerson |
| 5  | Jeames  |
+----+---------+
解释:
请注意，如果学生人数为奇数，则不需要更换最后一名学生的座位。
```

解法一：

```mysql
select (
    case
        when mod(id, 2) = 1 and id != counts.counts then id + 1
        when mod(id, 2) = 1 and id = counts.counts then id
        else id - 1
        end) as id, student
from seat,
    (select count(1) as counts
    from seat) counts
order by id asc
```

解法二：

```mysql
select s1.id, coalesce(s2.student, s1.student) as student
from seat s1
left join seat s2
on (s1.id+1)^1-1 = s2.id
```

位运算实现相邻两数互换位置。
