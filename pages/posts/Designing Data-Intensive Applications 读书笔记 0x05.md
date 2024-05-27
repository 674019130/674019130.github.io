---
title: 《Designing Data-Intensive Applications》 读书笔记 | 0x05
date: 2024-05-09 17:16:59
tags: [DDIA, System Design]
categories: [读书笔记, DDIA]
excerpt: 来看看作者如何从另一种角度描述分布式系统。
author: 苏
color: palevioletred
---

> 我们必须跳出电脑指令序列的窠臼。叙述定义、描述元数据、梳理关系，**而不是编写过程**。
>
> —— Grace Murray Hopper，未来的计算机及其管理（1962）

<!-- more -->

> 在 [第五章](https://vonng.gitbook.io/vonng/part-ii/ch5) 中，我们讨论了复制 —— 即数据在不同节点上的副本，对于非常大的数据集，或非常高的吞吐量，仅仅进行复制是不够的：我们需要将数据进行 **分区（partitions）**，也称为 **分片（sharding）**。

> **术语澄清**
>
> 上文中的 **分区（partition）**，在 MongoDB，Elasticsearch 和 Solr Cloud 中被称为 **分片（shard）**，在 HBase 中称之为 **区域（Region）**，Bigtable 中则是 **表块（tablet）**，Cassandra 和 Riak 中是 **虚节点（vnode）**，Couchbase 中叫做 **虚桶（vBucket）**。但是 **分区（partitioning）** 是最约定俗成的叫法。

