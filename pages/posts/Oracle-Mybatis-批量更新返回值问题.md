---
title: Oracle & Mybatis 批量更新返回值问题
date: 2022-11-04 09:29:59
tags: [数据库, Oracle, Mybatis, Java]
categories: [奇奇怪怪的项目里的问题]
author: 苏
readmore: true
excerpt: Mybatis 在使用（批量）更新语句的时候，应该在 SQL 语句正常执行完毕后返回「受影响行数」，但在连接的数据库是 Oracle 的时候却一直返回 -1，无法对 SQL 的执行状态进行判断，为了解决这个问题，我做了一些尝试……
---

# 场景

ORM：Mybatis

数据库：Oracle

组里新人写的一个接口。

传给 Mapper 层的是两个元素数量相等的 List，根据某两个字段是否与 List 中的元素匹配，对 status 字段做更新。

# 问题

假如传入 3 条数据，对应数据库中，应该更新三行的 status，如果能够做到全部更新成功，则继续后续业务的执行。但是无论受影响行数是 0 或其他任何非负整数，方法的返回值都是 -1。无法获取受影响行数。

# 解决方案

这个项目用的是 xml 文件写 mapper，为了实现批量查询，需要在 `foreach` 标签里添加一些东西。

`    <foreach collection="list" item="item" index="index" open="begin" close=";end;" separator=";"> `

解决了批量更新的问题，返回值还是 -1，开始查网上的资料。无奈 Mybatis & Oracle 的相关资料非常少，包括外网也是。

当数据库是 MySQL 的时候，可以通过修改 JDBC 的 URL 参数，添加`”affectedRows=true“`来实现返回受影响行数的功能（我自己在 MySQL 数据库开发的时候并没有遇到需要额外配置这个参数的情况）。于是我去搜了 Oracle JDBC 的官方文档，官方给出的 URL 参数里并没有效果类似`”affectedRows“`的，这条路走不通。

JDBC 连接上走不通，看看能不能从 Mybatis 入手。继续搜别的资料。

搜到有解释说，返回值是 -1 是由于：

> 是由于defaultExecutorType的引起的，defaultExecutorType有三个执行器SIMPLE、REUSE和BATCH。其中BATCH可以批量更新操作缓存SQL以提高性能，但是有个缺陷就是无法获取update、delete返回的行数。defaultExecutorType的默认执行器是SIMPLE。
>
> | 名称   | 描述                                 |
> | ------ | ------------------------------------ |
> | SIMPLE | 执行器执行其它语句                   |
> | REUSE  | 可能重复使用prepared statements 语句 |
> | BATCH  | 可以重复执行语句和批量更新           |
>
> 由于项目配置中启用了BATCH执行器，UPDATE和DELETE返回的行数就丢失了，把执行器改为SIMPLE即可。

但是该项目的 Mybatis 配置是这样的：
```yaml
mybatis:
    configuration:
        default-executor-type: simple
```

所以这条路也走不通，继续找原因。

在 StackOverflow 找到有个人说用 BEGIN + END + ; 实现的并不是 「a batch operation」，这里引出了 statement batch 的类型。

> ![image-20221104103007804](https://tva3.sinaimg.cn/large/008kWByAly8h7swp3ep1wj30j80lp76t.jpg)

但是实际测试的时候发现`getUpdateCounts()`返回的数组还是都是 -2。

无奈已经下班一个小时了，只好先用 `in`代替了`where`条件中的`=`，抛弃了批量更新，修改为了一条 SQL 语句。这样可以正常获取返回值。

第二天早上来了就在查还有没有相关的资料。查到一个人读了更多的 Oracle JDBC 的文档，解决了我的问题。

> 后来，在 Oracle 的文档说明中，发现的原因：
>
> https://docs.oracle.com/cd/E11882_01/java.112/e16548/oraperf.htm#JJDBC28777
>
> 其中，有一段说明：
>
> Update Counts in the Oracle Implementation of Standard Batching
>
> If a statement batch is processed successfully, then the integer array, or update counts array, returned by the statement `executeBatch` call will always have one element for each operation in the batch. In the Oracle implementation of standard update batching, the values of the array elements are as follows:
>
> - For a prepared statement batch, it is not possible to know the number of rows affected in the database by each individual statement in the batch. Therefore, all array elements have a value of `-2`. According to the JDBC 2.0 specification, a value of `-2` indicates that the operation was successful but the number of rows affected is unknown.
> - For a generic statement batch, the array contains the actual update counts indicating the number of rows affected by each operation. The actual update counts can be provided only in the case of generic statements in the Oracle implementation of standard batching.
> - For a callable statement batch, the server always returns the value `1` as the update count, irrespective of the number rows affected by each operation.
>
> In your code, upon successful processing of a batch, you should be prepared to handle either `-2`, `1`, or true update counts in the array elements. For a successful batch processing, the array contains either all `-2`, 1, or all positive integers.

针对三种不同的「statement batch」，Oracle 给出的返回值是不同的，也代表了不同的意义，文档里说的很明白。

- parpared statement：-2 表示执行成功，但无法返回实际成功行数；

- generic statement：返回实际成功行数；
- callable statement：永远返回 1；

最终的解决方案，抛弃 Mybatis：

```java
private int updateList(List < MyObject > myList) {
    int size = myList.size();
    int batchSize = 100;
    int index = 0;
    Long affectedRows = 0 L;

    SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
    Connection conn = sqlSession.getConnection();
    Statement statement = null;
    try {
        statement = conn.createStatement();
        conn.setAutoCommit(false);

        for (MyObject obj: myList) {
            index++;

            String sql = "update tb_test set status = " + obj.getStatus + " where id = " + obj.getId();
            statement.addBatch(sql);

            if (index % batchSize == 0 || index == size) {
                int[] ints = statement.executeBatch();
                affectedRows += IntStream.of(ints).sum();
                statement.clearBatch();
            }
        }
        conn.commit();
        conn.setAutoCommit(true);

    } catch (SQLException throwables) {
        throwables.printStackTrace();
    } finally {
        try {
            if (statement != null && !statement.isClosed()) {
                statement.close();
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        try {
            if (conn != null && !conn.isClosed()) {
                conn.close();
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    return affectedRows.intValue();
}
```

# 吐槽

- Oracle 给我一种很难用的感觉。
- 网络上（尤其是 CSDN & 博客园）的资料基本都是复制来复制去，毫无营养。
- 新人手里那个项目的代码质量一言难尽，主要是注释和魔法数问题。

- 三种 statement 的区分是什么，后面找机会再了解下。（懒狗一条🐶
