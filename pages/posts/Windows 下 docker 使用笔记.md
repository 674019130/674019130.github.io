---
title: Windows 下 Docker 使用笔记
# date: 2024-05-29 20:19:12
tags: [docker]
categories: [笔记, docker]
author: 苏
type: yuque
codeHeightLimit: 300
# color: 'red'
# color: '#FF8EB3'
# color: 'rgb(255, 0, 255)'
# color: '255, 0, 255'
typora-copy-images-to: upload
---

**Docker 伟大，无需多言！**

> 但是 Windows 下的 Docker 使用体验像吃了那个。

> 换了 MacBook 之后终于丝滑体验了！

<!-- ![image.png](https://s2.loli.net/2024/05/28/17kjdQVX35ieZvb.png) -->

<!-- more -->
## 0. 一些简单的常用命令

```bash
# 显示当前容器 IP
hostname -i
```

你可以使用命令 `netsh int ipv4 show dynamicport tcp` 查看当前的“TCP 动态端口范围”

还可使用 `netsh int ipv4 show excludedportrange protocol=tcp` 查看当前已经被征用的端口



## 1. RocketMQ 启动服务踩坑

### 第一步，pull 镜像

一共要启动的服务有两个，nameserver 和 broker。生产者和消费者在 Spring 服务中配置。

```
# 最新(rocketmq)
docker pull rocketmqinc/rocketmq
# 指定版本号(rocketmq)
docker pull rocketmqinc/rocketmq:<版本号># 最新(RocketMQ控制台)

docker pull pangliang/rocketmq-console-ng
```

### 第二步，搞一个 `broker.conf`

可以从启动的容器里拿到宿主机本地，也可以自己写，以下是配置文件描述

```
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

# brokerClusterName = DefaultCluster
# brokerName = broker-a
# brokerId = 0
# deleteWhen = 04
# fileReservedTime = 48
# brokerRole = ASYNC_MASTER
# flushDiskType = ASYNC_FLUSH


ongPollingEnable=true
offsetCheckInSlave=false
# nameServer地址，分号分割
namesrvAddr=172.16.234.150:9876
fetchNamesrvAddrByAddressServer=false
#是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true
#是否允许 Broker 自动创建Topic，建议线下开启，线上关闭
autoCreateTopicEnable=true
sendThreadPoolQueueCapacity=100000
clusterTopicEnable=true
filterServerNums=1
pullMessageThreadPoolNums=20
# broker名字，名字可重复,为了管理,每个master起一个名字,他的slave同他,eg:Amaster叫broker-a,他的slave也叫broker-a
brokerName=knBroker
#rocketmqHome=/usr/local/alibaba-rocketmq/
sendMessageThreadPoolNums=24
# 0 表示 Master，>0 表示 Slave
brokerId=0
brokerIP1=172.16.234.150
brokerTopicEnable=true
brokerPermission=6
shortPollingTimeMills=1000
clientManageThreadPoolNums=16
adminBrokerThreadPoolNums=16
flushConsumerOffsetInterval=5000
flushConsumerOffsetHistoryInterval=60000
# 在发送消息时，自动创建服务器不存在的topic，默认创建的队列数
defaultTopicQueueNums=8
rejectTransactionMessage=false
notifyConsumerIdsChangedEnable=true
pullThreadPoolQueueCapacity=100000
# # 所属集群名字
brokerClusterName=DefaultCluster
putMsgIndexHightWater=600000
maxTransferBytesOnMessageInDisk=65536
#检测物理文件磁盘空间
diskMaxUsedSpaceRatio=75
checkCRCOnRecover=true
haSlaveFallbehindMax=268435
deleteConsumeQueueFilesInterval=100
cleanResourceInterval=10000
maxMsgsNumBatch=64
flushConsumeQueueLeastPages=2
syncFlushTimeout=5000
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#Broker 的角色
brokerRole=ASYNC_MASTER
destroyMapedFileIntervalForcibly=120000
#commitLog每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824
haSendHeartbeatInterval=5000
#刷盘方式
flushDiskType=ASYNC_FLUSH
cleanFileForciblyEnable=true
haHousekeepingInterval=20000
redeleteHangedFileInterval=120000
#限制的消息大小
maxMessageSize=524288
flushCommitLogTimed=false
haMasterAddress=
maxTransferCountOnMessageInDisk=4
flushIntervalCommitLog=1000
#文件保留时间，默认 48 小时
fileReservedTime=72
flushCommitLogThoroughInterval=10000
maxHashSlotNum=5000
maxIndexNum=20000
messageIndexEnable=true
#存储路径
storePathRootDir=/root/store
#commitLog 存储路径
storePathCommitLog=/root/store/commitlog
#消费队列存储路径存储路径
storePathConsumeQueue=/root/store/consumequeue
#消息索引存储路径
storePathIndex=/root/store/index
haListenPort=10912
flushDelayOffsetInterval=10000
haTransferBatchSize=32768
deleteCommitLogFilesInterval=100
maxTransferBytesOnMessageInMemory=262144
accessMessageInMemoryMaxRatio=40
flushConsumeQueueThoroughInterval=60000
flushIntervalConsumeQueue=1000
maxTransferCountOnMessageInMemory=32
messageIndexSafe=false
#ConsumeQueue每个文件默认存30W条，根据业务情况调整
mapedFileSizeConsumeQueue=6000000
messageDelayLevel=1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
flushCommitLogLeastPages=4
serverChannelMaxIdleTimeSeconds=120
#Broker 对外服务的监听端口
listenPort=10911
serverCallbackExecutorThreads=0
serverAsyncSemaphoreValue=64
serverSocketSndBufSize=131072
serverSelectorThreads=3
serverPooledByteBufAllocatorEnable=false
serverWorkerThreads=8
serverSocketRcvBufSize=131072
serverOnewaySemaphoreValue=256
clientWorkerThreads=4
connectTimeoutMillis=3000
clientSocketRcvBufSize=131072
clientOnewaySemaphoreValue=2048
clientChannelMaxIdleTimeSeconds=120
clientPooledByteBufAllocatorEnable=false
clientAsyncSemaphoreValue=2048
channelNotActiveInterval=60000
clientCallbackExecutorThreads=2
clientSocketSndBufSize=131072
```

### 第三步，Docker 启动 RocketMQ

这里踩了几个坑：

1. **盘符**：Windows 盘符（如 `D:`）在 Docker for Windows 中需要小写并转换为 `/d/` 这种形式。
2. 确保本地路径在 Windows 上**存在并且正确**。

路径搞定之后又遇到错误：

`docker: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:10911 -> 0.0.0.0:0: listen tcp 0.0.0.0:10911: bind: An attempt was made to access a socket in a way forbidden by its access permissions.`

一开始是以为没有用管理员权限开 cmd，导致不让绑定端口映射，但是其实不是。

冒号前宿主后容器，试了端口号±1的都不行，但是之前启动 Redis 的时候 6378 是可以用的，同时本地启 Spring 服务的 8080 前后几个也能用，于是先用 80xx 的端口做了替代，反正不影响使用。

**然后搜了一下原因：**

> 进入正题，为什么会发生这个错误？这里不得不说明一下两个和问题有关的特性。
>
> - Windows 中个东西叫做“**TCP 动态端口范围**”，这个范围内的端口有时候会被一些服务占用。在 Windows Vista（或 Windows Server 2008）之前，动态端口范围是 1025 到 5000；在其之后的版本中，新的默认起始端口为 49152，新的默认结束端口为 65535。
> - **如果安装了 Hyper-V，则 Hyper-V 会保留一些随机端口号供 Windows [容器](https://cloud.tencent.com/product/tke?from_column=20065&from=20065)主机网络服务使用。**
>
> 一般情况（正常情况下）Hyper-V 会在“TCP 动态端口范围”中预留一些随机的端口号，但是预留的端口号一般都很大，所以即使预留了成百上千个端口，也影响不大。但是 Windows 自动更新有时会出错（万恶的自动更新），把“TCP 动态端口范围”起始端口被重置为 1024，导致 Hyper-V 在预留端口的时候占用了常用端口号，使得一些常用端口因为被预留而无法使用。
>
> 你可以使用命令 `netsh int ipv4 show dynamicport tcp` 查看当前的“TCP 动态端口范围”，还可使用 `netsh int ipv4 show excludedportrange protocol=tcp` 查看当前已经被征用的端口。

我用的引擎其实是 WSL 2，好像是跟这个 Hyper-V 没关系，但是本着刨根问底的原则，查了一下被征用的端口：

```bash
协议 tcp 端口排除范围

开始端口    结束端口
----------    --------
      1044        1143
      1144        1243
      1244        1343
      1344        1443
      1457        1556
      1842        1941
      2666        2765
     10776       10875
     10876       10975
*    10976       11075
     11076       11175
     11176       11275
     11276       11375
     11376       11475
     50000       50059     *
     54288       54288

* - 管理的端口排除。
```

可以看到 10911/10910 端口确实是在被征用的范围内的（我在输出结果中用 * 标记了），那么应该就是因为 Hyper-V 随机征用端口导致的。

于是带着一个小猜想去问了一下 ChatGPT：

> wsl2底层实现使用了 hyper-v？
>
> ChatGPT
>
> 是的，**WSL 2 的底层实现确实使用了 Hyper-V 技术**。这是因为 WSL 2 采用了完全虚拟化的方式，与 WSL 1 不同，它使用了 Hyper-V 虚拟化平台来运行 Linux 内核。这种设计使得 WSL 2 在性能和功能上有了显著提升，并且能够提供更接近于本机 Linux 环境的体验。
>
> 下面是 WSL 2 使用 Hyper-V 的一些关键点：
>
> 1. **完全虚拟化**：WSL 2 采用完全虚拟化的方式，每个 WSL 2 发行版都运行在一个 Hyper-V 虚拟机中，这个虚拟机拥有自己的 Linux 内核。
> 2. **Hyper-V 技术**：Hyper-V 是 Windows 操作系统中的虚拟化平台，可以创建和管理虚拟机。WSL 2 利用了 Hyper-V 的功能来创建和运行 Linux 发行版。
> 3. **性能优势**：相比于 WSL 1，WSL 2 的性能更好。因为它使用了 Hyper-V 的硬件虚拟化技术，能够提供更快的启动速度、更好的文件系统性能和更好的兼容性。
> 4. **隔离性**：每个 WSL 2 发行版运行在独立的 Hyper-V 虚拟机中，提供了更好的隔离性。这意味着不同的 WSL 2 发行版之间互不影响，而且可以与 Windows 本机环境隔离开来。
>
> 虽然 WSL 2 使用了 Hyper-V 技术，但用户在使用 WSL 2 时并不需要直接管理 Hyper-V 虚拟机。WSL 2 提供了简单易用的命令行工具和界面，让用户可以方便地管理和使用 Linux 发行版，而无需深入了解 Hyper-V 的操作。

---

搞定前面端口的问题，再试一下启动一次容器。

先启动 nameserver ，再启动 broker，确保 IP 地址是匹配的。

上面的`broker.conf`文件里指定了 namesrv 和 broker 的 IP 地址，**但是** 在 Docker 启动容器时要指定 IP 地址需要自定义网络，如果跟我一样不打算自定义网络的话，可以注释掉对应的配置项，先启动 namesrv，再通过配置环境变量和镜像命令来指定 namesrv 的地址（但是`broker.conf`里的配置还是要改成正确的 namesrv 地址）。

**以下命令中存在需要自己手动替换的地方，如挂载路径、端口号和 IP 地址。**

```shell
# 1. success namesrv
docker run -d -p 9876:9876   -v /d/docker_volume/rocketmq/namesrv/logs:/root/logs   -v /d/docker_volume/rocketmq/namesrv/store:/root/store   -v /d/docker_volume/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf   --name rmqnamesrv rocketmqinc/rocketmq:latest sh mqnamesrv

# 2. success broker
docker run -d  -p 10911:10911 -p 10909:10909 -v /d/docker_volume/rocketmq/broker/logs:/root/logs -v /d/docker_volume/rocketmq/broker/store:/root/store -v /d/docker_volume/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf --name rmqbroker --add-host namesrv:172.17.0.2 -e "NAMESRV_ADDR=namesrv:9876" rocketmqinc/rocketmq:latest sh mqbroker -n namesrv:9876 -c /opt/rocketmq-4.4.0/conf/broker.conf autoCreateTopicEnable=true

# 3. success console
docker run -d --name rocketmq-console  -p 8080:8080 -t apacherocketmq/rocketmq-console:2.0.0 -e "JAVA_OPTS=-Drocketmq.namesrv.addr=172.17.0.2:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false"

docker run -d --name rocketmq-console  -p 8080:8080 -t styletang/rocketmq-console-ng:latest -e "JAVA_OPTS=-Drocketmq.namesrv.addr=172.17.0.2:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false"
```

通过查看挂载在本地的日志，可以发现 namesrv 和 broker 之间已经建立了通信（重点日志添加了换行）。

```shell
# broker.log:
2024-05-31 22:06:19 INFO main - Replace, key: namesrvAddr, value: namesrv:9876 -> 172.17.0.2:9876

2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=RMQ_SYS_TRANS_HALF_TOPIC, readQueueNums=1, writeQueueNums=1, perm=RW-, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=BenchmarkTest, readQueueNums=1024, writeQueueNums=1024, perm=RW-, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=OFFSET_MOVED_EVENT, readQueueNums=1, writeQueueNums=1, perm=RW-, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=knBroker, readQueueNums=1, writeQueueNums=1, perm=RWX, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=TBW102, readQueueNums=8, writeQueueNums=8, perm=RWX, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=SELF_TEST_TOPIC, readQueueNums=1, writeQueueNums=1, perm=RW-, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load exist local topic, TopicConfig [topicName=DefaultCluster, readQueueNums=16, writeQueueNums=16, perm=RWX, topicFilterType=SINGLE_TAG, topicSysFlag=0, order=false]
2024-05-31 22:06:19 INFO main - load /root/store/config/topics.json OK
2024-05-31 22:06:19 INFO main - load /root/store/config/consumerOffset.json OK
2024-05-31 22:06:19 INFO main - load /root/store/config/consumerFilter.json OK
2024-05-31 22:06:19 INFO main - load /root/store/config/delayOffset.json OK
2024-05-31 22:06:20 INFO main - Set user specified name server address: namesrv:9876
2024-05-31 22:06:20 WARN main - Load default transaction message hook service: TransactionalMessageServiceImpl
2024-05-31 22:06:20 WARN main - Load default discard message hook service: DefaultTransactionalMessageCheckListener
2024-05-31 22:06:20 INFO main - The broker dose not enable acl
2024-05-31 22:06:20 INFO FileWatchService - FileWatchService service started
2024-05-31 22:06:20 INFO PullRequestHoldService - PullRequestHoldService service started
2024-05-31 22:06:20 INFO brokerOutApi_thread_1 - register broker to name server namesrv:9876 OK
2024-05-31 22:06:20 INFO main - Start transaction service!

2024-05-31 22:06:20 INFO main - The broker[knBroker, 172.17.0.4:10911] boot success. serializeType=JSON and name server is namesrv:9876

2024-05-31 22:06:25 INFO FilterServerManagerScheduledThread1 - CallShell: <sh /opt/rocketmq-4.4.0/bin/startfsrv.sh -c /opt/rocketmq-4.4.0/conf/broker.conf -n namesrv:9876> OK
2024-05-31 22:06:30 INFO BrokerControllerScheduledThread1 - dispatch behind commit log 0 bytes
2024-05-31 22:06:30 INFO BrokerControllerScheduledThread1 - Slave fall behind master: 0 bytes
2024-05-31 22:06:30 INFO brokerOutApi_thread_2 - register broker to name server namesrv:9876 OK
```

```shell
# namesrv.log:

2024-05-31 22:06:20 INFO NettyServerCodecThread_1 - NETTY SERVER PIPELINE: channelRegistered 172.17.0.4:42174
2024-05-31 22:06:20 INFO NettyServerCodecThread_1 - NETTY SERVER PIPELINE: channelActive, the channel[172.17.0.4:42174]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, RMQ_SYS_TRANS_HALF_TOPIC QueueData [brokerName=knBroker, readQueueNums=1, writeQueueNums=1, perm=6, topicSynFlag=0]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, BenchmarkTest QueueData [brokerName=knBroker, readQueueNums=1024, writeQueueNums=1024, perm=6, topicSynFlag=0]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, OFFSET_MOVED_EVENT QueueData [brokerName=knBroker, readQueueNums=1, writeQueueNums=1, perm=6, topicSynFlag=0]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, knBroker QueueData [brokerName=knBroker, readQueueNums=1, writeQueueNums=1, perm=7, topicSynFlag=0]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, TBW102 QueueData [brokerName=knBroker, readQueueNums=8, writeQueueNums=8, perm=7, topicSynFlag=0]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, SELF_TEST_TOPIC QueueData [brokerName=knBroker, readQueueNums=1, writeQueueNums=1, perm=6, topicSynFlag=0]
2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new topic registered, DefaultCluster QueueData [brokerName=knBroker, readQueueNums=16, writeQueueNums=16, perm=7, topicSynFlag=0]

2024-05-31 22:06:20 INFO RemotingExecutorThread_1 - new broker registered, 172.17.0.4:10911 HAServer: 172.17.0.4:10912
```

![image-20240531231411249](https://s2.loli.net/2024/05/31/gay2XUvZTAPBSJi.png)

至此，Docker 启动 RocketMQ 告一段落。

