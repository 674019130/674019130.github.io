---
title: 《Designing Data-Intensive Applications》 读书笔记 | 0x01
# date: 2024-05-02 02:28:12
tags: [DDIA, 读书笔记, 数据密集型应用]
categories: [技术笔记, 分布式系统]
excerpt: 数据模型除了「SQL」还有什么？
author: 苏
readmore: true
toc: true
---

# 第二章：数据模型与查询语言

> 多数应用使用层层叠加的数据模型构建。对于每层数据模型的关键问题是：它是如何用低一层数据模型来 **表示** 的？例如：
>
> 1. 作为一名应用开发人员，你观察现实世界（里面有人员、组织、货物、行为、资金流向、传感器等），并采用对象或数据结构，以及操控那些数据结构的 API 来进行建模。那些结构通常是特定于应用程序的。
> 2. 当要存储那些数据结构时，你可以利用通用数据模型来表示它们，如 JSON 或 XML 文档、关系数据库中的表或图模型。
> 3. 数据库软件的工程师选定如何以内存、磁盘或网络上的字节来表示 JSON / XML/ 关系 / 图数据。这类表示形式使数据有可能以各种方式来查询，搜索，操纵和处理。
> 4. 在更低的层次上，硬件工程师已经想出了使用电流、光脉冲、磁场或者其他东西来表示字节的方法。

由上往下，作者分别从应用层、传输层、持久化（IO 数据传输）、硬件四个层次对数据模型的表现形式做了举例。

值得注意的是，应用层的数据模型在设计的时候往往是 **面向对象** 思想比较直观的表现，这种「直观」表现中必然包含 **抽象** 。

更底层一些的数据模型显然依赖于应用层表现出的 **抽象** 行为。

-------

> 一个复杂的应用程序可能会有更多的中间层次，比如基于 API 的 API，不过基本思想仍然是一样的：每个层都通过提供一个明确的数据模型来隐藏更低层次中的复杂性。这些抽象允许不同的人群有效地协作（例如数据库厂商的工程师和使用数据库的应用程序开发人员）。

作者在这里也提到了 **抽象** 的概念。不同的是，作者从硬件自底向上地描述 **抽象** 行为对 **层次之间协作** 的重要性。

--------

> 掌握一个数据模型需要花费很多精力（想想关系数据建模有多少本书）。即便只使用一个数据模型，不用操心其内部工作机制，构建软件也是非常困难的。然而，因为数据模型对上层软件的功能（能做什么，不能做什么）有着至深的影响，所以选择一个适合的数据模型是非常重要的。

我在考虑从一开始建立数据模型的时候是从 **应用层** 开始思考，作者是从底层数据模型对上层软件功能的影响开始思考。

这让我想到，我的思维模式还停留在 **应用层** 开发，根据应用所需去选取合适的数据模型（包括面向对象设计和数据库的选取）。但是面对 **数据密集型应用** ，可能从数据模型的选取开始思考才是更合适的。

这是一种思维习惯和经验带来的差异，理应学会作者的这种思维方式。

--------------

> 目前大多数应用程序开发都使用面向对象的编程语言来开发，这导致了对 SQL 数据模型的普遍批评：如果数据存储在关系表中，那么需要一个笨拙的转换层，处于应用程序代码中的对象和表，行，列的数据库模型之间。模型之间的不连贯有时被称为 **阻抗不匹配（impedance mismatch）**

**关系表** 和 **面向对象编程** 之间确实存在一种反技术直觉的阻抗。就像本应如电流般顺畅的数据传输受到了阻力，需要添加一个臃肿、难以使用而又经常出错的转换器。

ORM 框架减少了转换所需的工作量，但是问题依然客观存在。

------------

<!-- > ![](https://1126993343-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MHdCOHMs3fNDC20H5qi%2Fuploads%2Fgit-blob-6a1a9b9d3ecedac52ea104412282d46b86f2f850%2Ffig2-1.png?alt=media) -->

> JSON 表示比 [图 2-1]
<!-- > (https://github.com/Vonng/ddia/blob/master/img/fig2-1.png) -->
>  中的多表模式具有更好的 **局部性（locality）**。如果在前面的关系型示例中获取简介，那需要执行多个查询（通过 `user_id` 查询每个表），或者在 User 表与其下属表之间混乱地执行多路连接。而在 JSON 表示中，所有相关信息都在同一个地方，一个查询就足够了。
>
> 从用户简介文件到用户职位，教育历史和联系信息，这种一对多关系隐含了数据中的一个树状结构，而 JSON 表示使得这个树状结构变得明确（见 [图 2-2]
<!-- > (https://github.com/Vonng/ddia/blob/master/img/fig2-2.png)）。 -->

<!-- > ![](https://1126993343-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MHdCOHMs3fNDC20H5qi%2Fuploads%2Fgit-blob-2f1801d2975d43a8e5f385d350001e68dd005d33%2Ffig2-2.png?alt=media) -->

JSON 相比于关系数据模型，优势在于能自由组织不同的相关信息，并在任一层级将整个数据单元独立出来。这就是作者所说的 **局部性**。

------------

> 在上一节的 [例 2-1] 中，`region_id` 和 `industry_id` 是以 ID，而不是纯字符串 "Greater Seattle Area" 和 "Philanthropy" 的形式给出的。为什么？
>
> 如果用户界面用一个自由文本字段来输入区域和行业，那么将他们存储为纯文本字符串是合理的。另一方式是给出地理区域和行业的标准化的列表，并让用户从下拉列表或自动填充器中进行选择，其优势如下：
>
> - 各个简介之间样式和拼写统一
> - 避免歧义（例如，如果有几个同名的城市）
> - 易于更新 —— 名称只存储在一个地方，如果需要更改（例如，由于政治事件而改变城市名称），很容易进行全面更新。
> - 本地化支持 —— 当网站翻译成其他语言时，标准化的列表可以被本地化，使得地区和行业可以使用用户的语言来显示
> - 更好的搜索 —— 例如，搜索华盛顿州的慈善家就会匹配这份简介，因为地区列表可以编码记录西雅图在华盛顿这一事实（从 "Greater Seattle Area" 这个字符串中看不出来）
>
> 存储 ID 还是文本字符串，这是个 **副本（duplication）** 问题。当使用 ID 时，对人类有意义的信息（比如单词：Philanthropy）只存储在一处，所有引用它的地方使用 ID（ID 只在数据库中有意义）。当直接存储文本时，对人类有意义的信息会复制在每处使用记录中。
>
> 使用 ID 的好处是，ID 对人类没有任何意义，因而永远不需要改变：ID 可以保持不变，即使它标识的信息发生变化。任何对人类有意义的东西都可能需要在将来某个时候改变 —— 如果这些信息被复制，所有的冗余副本都需要更新。这会导致写入开销，也存在不一致的风险（一些副本被更新了，还有些副本没有被更新）。去除此类重复是数据库 **规范化（normalization）** 的关键思想。

这一段将我工作中曾经捕风捉影观测到的问题，用高度精炼的语言概括了出来。关键词是 **副本**，**规范化（标准化）**。

我的看法是，在需要使用 **ID** 的地方，往往我们是需要 **ID** 带来的 **一致性**，即 **副本不可变性** 的。这有时候是一种优势，辨证来看，这也增加了模块之间的 **耦合**。

使用 **字符串** 副本相应的可以做 **解耦**，但是也导致了不一致的问题。

应该根据场景灵活选择。

---------------

> 不幸的是，对这些数据进行规范化需要多对一的关系（许多人生活在一个特定的地区，许多人在一个特定的行业工作），这与文档模型不太吻合。在关系数据库中，通过 ID 来引用其他表中的行是正常的，因为连接很容易。在文档数据库中，一对多树结构没有必要用连接，对连接的支持通常很弱 。
>
>: 在撰写本文时，RethinkDB 支持连接，MongoDB 不支持连接，而 CouchDB 只支持预先声明的视图。

在我的计算机的学习过程中常常发现，在不变更底层算法的情况下，往往是用一种资源来换取另一种资源，最常见的就是空间换时间或时间换空间。

使用文档数据库时，数据组织相对松散，可能带来的是轻便和易用（例如使用 JSON 时）。但在需要 **连接** 的地方显得有些力不从心。这也是一种取舍。

这往往让我想起「没有银弹」。

# 后记

这一章主要介绍了多种数据模型，除了 SQL 和 NoSQL，还有图模型和其他旧式但依然很有意义的模型。

拓宽眼界，先知道有这个东西，适用于什么情景，这样在做选型的时候才能更得心应手。
