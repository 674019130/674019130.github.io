---
title: 分布式事务解决方案 Seata 学习笔记
date: 2024-06-28 00:24:45
tags: [Seata, 分布式事务, Java]
postTitleClass: 'text-pink-400'
pageTtitleClass: 'text-rgb(255, 0, 0)'
categories: [技术笔记, 分布式系统]
toc: true
---

**截至 2025-04-15，依然没能在项目中用上 T_T，是确实还没场景**

<!-- more -->

## Seata术语

#### TC (Transaction Coordinator) - 事务协调者[](https://seata.apache.org/zh-cn/docs/overview/terminology#tc-transaction-coordinator---事务协调者)（控制中心，控制事务的流程）

维护全局和分支事务的状态，驱动全局事务提交或回滚。

#### TM (Transaction Manager) - 事务管理器[](https://seata.apache.org/zh-cn/docs/overview/terminology#tm-transaction-manager---事务管理器)（用来发起事务）

定义全局事务的范围：开始全局事务、提交或回滚全局事务。

#### RM (Resource Manager) - 资源管理器[](https://seata.apache.org/zh-cn/docs/overview/terminology#rm-resource-manager---资源管理器)（每一个子事务实例）

管理分支事务处理的资源，与 TC 交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。

## 事务模式（四种）

### AT 模式 两阶段

- **非侵入式**

- **两阶段**提交协议

  - 一阶段：业务数据和回滚日志记录在**同一个本地事务中提交**，释放本地锁和连接资源
  - 二阶段：
    - 提交异步化
    - 回滚通过一阶段的回滚日志进行反向补偿

- ```java
  // 两个数据源的情况下
  @GlobalTransactional
  public void purchase(String userId, String commodityCode, int count, int money) {
      jdbcTemplateA.update("update stock_tbl set count = count - ? where commodity_code = ?", new Object[] {count, commodityCode});
      jdbcTemplateB.update("update account_tbl set money = money - ? where user_id = ?", new Object[] {money, userId});
  }
  ```

- （自己的理解）最简单的情况（指同一服务下多个数据源的事务操作），最好写的模式，相当于手动包装了多个数据源的事务操作，回滚也是依赖于 Seata 对于数据源的代理，相当于回滚和事务捏合这两部分 Seata 都帮你做了。

  缺点也很明显，依赖于数据库原生的 SQL 和回滚操作，同时在高并发的情况下需要额外加锁。

### TCC 模式 两阶段

- 为独立部署的 SOA 服务设计，即可以做到跨应用管理
- ![Overview of a global transaction](https://s2.loli.net/2024/06/28/dsezG7JymNEC2Kv.png)
- **完全不依赖数据库**，是业务层面的分布式事务，AT 和 XA 都是数据库层面的分布式事务
- **侵入式，自己实现 Try, Confirm, Cancel 操作（TCC 叫法的来源）**，复杂
  - Try 是一阶段，做资源的检查和预留
  - Confirm 是二阶段的提交，**真正执行业务**
  - Cancel 是二阶段的回滚，依赖于 Try 的资源预留

> ```java
> public interface TccActionOne {
>     @TwoPhaseBusinessAction(name = "DubboTccActionOne", commitMethod = "commit", rollbackMethod = "rollback")
>     public boolean prepare(BusinessActionContext actionContext, @BusinessActionContextParameter(paramName = "a") String a);
>     public boolean commit(BusinessActionContext actionContext);
>     public boolean rollback(BusinessActionContext actionContext);
> }
> ```
>
> Seata 会把一个 TCC 接口当成一个 Resource，也叫 TCC Resource。**在业务接口中核心的注解是 `@TwoPhaseBusinessAction`，表示当前方法使用 TCC 模式管理事务提交**，并标明了 Try，Confirm，Cancel 三个阶段。name属性，给当前事务注册了一个全局唯一的的 TCC bean name。同时 TCC 模式的三个执行阶段分别是：
>
> - Try 阶段，预定操作资源（Prepare） 这一阶段所以执行的方法便是**被 `@TwoPhaseBusinessAction` 所修饰的方法**。如示例代码中的 `prepare` 方法。
> - Confirm 阶段，执行主要业务逻辑（Commit） 这一阶段使用 **`commitMethod` 属性所指向的方法**，来执行 **Confirm** 的工作。
> - Cancel 阶段，事务回滚（Rollback） 这一阶段**使用 `rollbackMethod` 属性所指向的方法**，来执行 **Cancel** 的工作。
>
> ---
>
> 其次，可以在 TCC 模式下**使用 `BusinessActionContext` 在事务上下文中传递查询参数**。如下属性：
>
> - `xid` 全局事务id
> - `branchId` 分支事务id
> - `actionName` 分支资源id，（resource id）
> - `actionContext` 业务传递的参数，可以通过 `@BusinessActionContextParameter` 来标注需要传递的参数。
>
> 在定义好 TCC 接口之后，我们可以像 AT 模式一样，通过 `@GlobalTransactional` 开启一个分布式事务。
>
> ```java
> @GlobalTransactional
> public String doTransactionCommit(){
>     tccActionOne.prepare(null,"one");
>     tccActionTwo.prepare(null,"two");
> }
> ```
>
>
>
> 注意，如果 TCC 参与者是本地 bean（非远程RPC服务），本地 TCC bean 还需要在接口定义中添加 @LocalTCC 注解，比如,
>
> ```java
> @LocalTCC
> public interface TccActionTwo {
>     @TwoPhaseBusinessAction(name = "TccActionTwo", commitMethod = "commit", rollbackMethod = "rollback")
>     public boolean prepare(BusinessActionContext actionContext, @BusinessActionContextParameter(paramName = "a") String a);
>     public boolean commit(BusinessActionContext actionContext);
>     public boolean rollback(BusinessActionContext actionContext);
> }
> ```

相**当于是自己实现一个 AT 模式，入口放开了，要做的填充也就多了。**比如需要自己从业务层面实现隔离性（比如添加 `冻结余额` 字段）

**但是本质是不同的，AT 模式依赖于数据库，TCC 模式只依赖于自己写的业务代码**，理论上来说我对 Redis 也可以使用 TCC 来完成一次分布式事务。

### Saga 模式

- 用于 **参与者比较多，长事务** 场景
- 因为一些原因无法实现 TCC 三个接口的时候
- 自己理解的流程大概就是每一个事务都各干各的，**异步执行**，有点 **乐观锁** 的意思；只有在出现问题的时候，才对之前已经执行了的事务做回滚（补偿）。

​	但是 Saga 模式 **不保证隔离性**，也就是事务与事务之间可能会相互影响，在做回滚时可能会失败，因为别的事务也执行了。有点 **AP 和 CP 的区别** 的意思。

​	关于隔离性的应对方案，要结合业务来说，总之是尽量保证亏损可接受，解决方案可落地，不能做到最后用户确实没钱了，想回滚只能逼用户去犯罪（bushi

- ![Saga模式示意图](https://s2.loli.net/2024/06/28/1POJBCnmizGwb6r.png)
- Seata Saga 提供了一个**可视化的状态机设计器** https://github.com/apache/incubator-seata/tree/refactor_designer/saga/seata-saga-statemachine-designer

### XA 模式 两阶段

- 我说实话，除了 **是基于被主流数据库都实现了的 XA 协议** 这一点，没看出来跟 AT 模式有什么区别。

- **数据库那边做了隔离**，所以能满足全局的数据一致性

- 会阻塞，性能差

  > XA prepare 后，分支事务进入阻塞阶段，收到 XA commit 或 XA rollback 前必须阻塞等待。事务资源长时间得不到释放，锁定周期长，而且在应用层上面无法干预，性能差。

  然后我去问了下 ChatGPT，XA 模式是同步的，所有 RM 都准备完成后才能提交或者回滚；AT模式是支持异步提交的，阻塞肯定比 XA 是好很多的。

## TODO

- 了解全局锁本地锁跟数据隔离是怎么互相作用的
- 真正用到的时候了解一下写法，写 DEMO 验证
- 了解三阶段提交
