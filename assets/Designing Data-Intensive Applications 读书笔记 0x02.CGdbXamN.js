import{_ as f}from"./ValaxyMain.vue_vue_type_style_index_0_lang.CjQLfBGS.js";import{f as k,a as B,u as S}from"./chunks/vue-router.CAdTcK3X.js";import{s as D,bH as o,aW as u,v as l,t as r,H as t,bi as q,aK as v,aM as T}from"./framework.DDojlQDl.js";import"./app.CIAkCWmS.js";import"./chunks/dayjs.DPscOGnl.js";import"./chunks/vue-i18n.D5iU1Uln.js";import"./chunks/pinia.DkkyVvQY.js";import"./chunks/@vueuse/motion.B7tSKkoB.js";import"./chunks/nprogress.DgNGesC2.js";import"./YunComment.vue_vue_type_style_index_0_lang.Do970eH_.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.CUTuRIHR.js";import"./post.C0zJ9ES1.js";const x=k("/posts/Designing Data-Intensive Applications 读书笔记 0x02",async a=>JSON.parse('{"title":"《Designing Data-Intensive Applications》 读书笔记 | 0x02","description":"","frontmatter":{"title":"《Designing Data-Intensive Applications》 读书笔记 | 0x02","date":"2023-02-02 10:46:51","tags":["DDIA","System Design"],"categories":["读书笔记","DDIA"],"excerpt":"现代存储系统的存储与检索使用的数据结构是怎么来的？","author":"苏","readmore":true},"headers":[],"relativePath":"pages/posts/Designing Data-Intensive Applications 读书笔记 0x02.md","lastUpdated":1744783260000}'),{lazy:(a,p)=>a.name===p.name}),R={__name:"Designing Data-Intensive Applications 读书笔记 0x02",setup(a,{expose:p}){var g;const{data:m}=x(),b=S(),e=B(),i=Object.assign(e.meta.frontmatter||{},((g=m.value)==null?void 0:g.frontmatter)||{});return e.meta.frontmatter=i,b.currentRoute.value.data=m.value,T("valaxy:frontmatter",i),globalThis.$frontmatter=i,p({frontmatter:{title:"《Designing Data-Intensive Applications》 读书笔记 | 0x02",date:"2023-02-02 10:46:51",tags:["DDIA","System Design"],categories:["读书笔记","DDIA"],excerpt:"现代存储系统的存储与检索使用的数据结构是怎么来的？",author:"苏",readmore:!0}}),(s,n)=>{const d=f;return v(),D(d,{frontmatter:q(i)},{"main-content-md":o(()=>[n[0]||(n[0]=l("h1",{id:"第三章-存储与检索",tabindex:"-1"},[t("第三章：存储与检索 "),l("a",{class:"header-anchor",href:"#第三章-存储与检索","aria-label":'Permalink to "第三章：存储与检索"'},"​")],-1)),n[1]||(n[1]=l("blockquote",null,[l("p",null,[t("为了高效查找数据库中特定键的值，我们需要一个数据结构："),l("strong",null,"索引（index）"),t("。本章将介绍一系列的索引结构，并在它们之间进行比较。索引背后的大致思想是通过保存一些额外的元数据作为路标来帮助你找到想要的数据。如果你想以几种不同的方式搜索同一份数据，那么你也许需要在数据的不同部分上建立多个索引。")])],-1)),n[2]||(n[2]=l("p",null,[t("没有废话，提到了 "),l("strong",null,"元数据"),t(" 这个概念，可以在后面多思考一下，"),l("strong",null,"索引"),t(" 里为什么一定要加这些元数据，这些元数据是怎样让搜索加速的。")],-1)),n[3]||(n[3]=l("hr",null,null,-1)),n[4]||(n[4]=l("blockquote",null,[l("p",null,[t("让我们从 "),l("strong",null,"键值数据（key-value Data）"),t(" 的索引开始。这不是你可以索引的唯一数据类型，但键值数据是很常见的。在引入更复杂的索引之前，它是重要的第一步。")]),l("p",null,[t("键值存储与在大多数编程语言中可以找到的 "),l("strong",null,"字典（dictionary）"),t(" 类型非常相似，通常字典都是用 "),l("strong",null,"散列映射（hash map）"),t(" 或 "),l("strong",null,"散列表（hash table）"),t(" 实现的。散列映射在许多算法教科书中都有描述【1,2】，所以这里我们不会讨论它的工作细节。既然我们已经可以用散列映射来表示 "),l("strong",null,"内存中"),t(" 的数据结构，为什么不使用它来索引 "),l("strong",null,"硬盘上"),t(" 的数据呢？")])],-1)),n[5]||(n[5]=l("p",null,[t("内存上的散列索引，是不是可以理解为应用里类似 "),l("code",null,"HashMap<K, V>"),t("的变量。之所以能表示内存中的数据结构，是因为编程语言为程序封装了寻址、调用等操作。")],-1)),n[6]||(n[6]=l("p",null,[t("而作者既然提到了也可以用来索引 "),l("strong",null,"硬盘上"),t(" 的数据，那么必然也要实现相应的操作。")],-1)),n[7]||(n[7]=l("hr",null,null,-1)),n[8]||(n[8]=l("blockquote",null,[l("p",null,"像 Bitcask 这样的存储引擎非常适合每个键的值经常更新的情况。例如，键可能是某个猫咪视频的网址（URL），而值可能是该视频被播放的次数（每次有人点击播放按钮时递增）。在这种类型的工作负载中，有很多写操作，但是没有太多不同的键 —— 每个键有很多的写操作，但是将所有键保存在内存中是可行的。"),l("p",null,[t("到目前为止，我们只是在追加写入一个文件 —— 所以如何避免最终用完硬盘空间？一种好的解决方案是，将日志分为特定大小的 "),l("strong",null,"段（segment）"),t("，当日志增长到特定尺寸时关闭当前段文件，并开始写入一个新的段文件。然后，我们就可以对这些段进行 "),l("strong",null,"压缩（compaction）"),t("，如 [图 3-2]")])],-1)),r(" > (https://github.com/Vonng/ddia/blob/master/img/fig3-2.png) "),n[9]||(n[9]=l("blockquote",null,[l("p",null,"所示。这里的压缩意味着在日志中丢弃重复的键，只保留每个键的最近更新。")],-1)),r(" > ![img](https://1126993343-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MHdCOHMs3fNDC20H5qi%2Fuploads%2Fgit-blob-c3a6ae6f68ea1206d8620d623958aabf9b93becd%2Ffig3-2.png?alt=media) "),n[10]||(n[10]=l("blockquote",null,[l("p",null,[l("strong",null,"图 3-2 键值更新日志（统计猫咪视频的播放次数）的压缩，只保留每个键的最近值")]),l("p",null,"而且，由于压缩经常会使得段变得很小（假设在一个段内键被平均重写了好几次），我们也可以在执行压缩的同时将多个段合并在一起，如 [图 3-3]")],-1)),r(" > (https://github.com/Vonng/ddia/blob/master/img/fig3-3.png) "),n[11]||(n[11]=l("blockquote",null,[l("p",null,"所示。段被写入后永远不会被修改，所以合并的段被写入一个新的文件。冻结段的合并和压缩可以在后台线程中完成，这个过程进行的同时，我们仍然可以继续使用旧的段文件来正常提供读写请求。合并过程完成后，我们将读取请求转换为使用新合并的段而不是旧的段 —— 然后旧的段文件就可以简单地删除掉了。")],-1)),n[12]||(n[12]=l("p",null,"不难看出这是一种非常好的处理思路。通过「压缩」这种方式处理旧数据，维护有限占用空间里的一份最新数据。这里可以想到多线程处理，主线程负责数据的更新，即写操作；其他线程将之前生成的「日志」文件读取并压缩，并视情况做其他处理。",-1)),n[13]||(n[13]=l("p",null,"BTW，作者在后面提到了一些实现过程中的细节，越来越像 Redis 等缓存系统了。",-1)),n[14]||(n[14]=l("hr",null,null,-1)),n[15]||(n[15]=l("blockquote",null,[l("p",null,"但是，散列表索引也有其局限性："),l("ul",null,[l("li",null,"散列表必须能放进内存。如果你有非常多的键，那真是倒霉。原则上可以在硬盘上维护一个散列映射，不幸的是硬盘散列映射很难表现优秀。它需要大量的随机访问 I/O，而后者耗尽时想要再扩充是很昂贵的，并且需要很烦琐的逻辑去解决散列冲突【5】。"),l("li",null,"范围查询效率不高。例如，你无法轻松扫描 kitty00000 和 kitty99999 之间的所有键 —— 你必须在散列映射中单独查找每个键。")])],-1)),n[16]||(n[16]=l("p",null,"我刚刚提到的硬盘上做散列映射的想法，应该是由于 IO 效率问题很难被实际应用。",-1)),n[17]||(n[17]=l("p",null,"不知道 SSD 上的表现会不会好一些。",-1)),n[18]||(n[18]=l("hr",null,null,-1)),n[19]||(n[19]=l("blockquote",null,[l("p",null,"现在我们可以对段文件的格式做一个简单的改变：要求键值对的序列按键排序。乍一看，这个要求似乎打破了我们使用顺序写入的能力，我们将稍后再回到这个问题。"),l("p",null,[t("我们把这个格式称为 "),l("strong",null,"排序字符串表（Sorted String Table）"),t("，简称 SSTable。我们还要求每个键只在每个合并的段文件中出现一次（压缩过程已经保证）。与使用散列索引的日志段相比，SSTable 有几个大的优势：")])],-1)),n[20]||(n[20]=l("p",null,"篇幅限制不引用具体优势了。这让我有了一些思考：",-1)),n[21]||(n[21]=l("ol",null,[l("li",null,[t("索引结构是不是最好是基于 "),l("strong",null,"已排序"),t(" 数据上的，或者索引结构本身包含 "),l("strong",null,"已排序"),t(" 这个特性。")]),l("li",null,[t("基于 "),l("strong",null,"已排序"),t(" 这个特性，二分查找似乎已经是效率最高的，普适性最强的查找算法了。树这种数据结构就很适合使用二分查找。作者循循善诱，给出了现代数据系统技术选型的来龙去脉。")])],-1)),n[22]||(n[22]=l("hr",null,null,-1)),n[23]||(n[23]=l("blockquote",null,[l("h4",{id:"构建和维护sstables",tabindex:"-1"},[t("构建和维护SSTables "),l("a",{class:"header-anchor",href:"#构建和维护sstables","aria-label":'Permalink to "构建和维护SSTables"'},"​")]),l("p",null,"到目前为止还不错，但是如何让你的数据能够预先排好序呢？毕竟我们接收到的写入请求可能以任何顺序发生。"),l("p",null,"虽然在硬盘上维护有序结构也是可能的（请参阅 “[B 树]”），但在内存保存则要容易得多。有许多可以使用的众所周知的树形数据结构，例如红黑树或 AVL 树【2】。使用这些数据结构，你可以按任何顺序插入键，并按排序顺序读取它们。")],-1)),n[24]||(n[24]=l("p",null,"这里可以看出来，其实树这种数据结构，在应用的时候除了本身的特性，还要参考 IO 速率。在硬盘和内存上是两种差距很大的应用场景。",-1)),n[25]||(n[25]=l("hr",null,null,-1)),n[26]||(n[26]=l("blockquote",null,[l("p",null,[t("Lucene，是一种全文搜索的索引引擎，在 Elasticsearch 和 Solr 被使用，它使用类似的方法来存储它的关键词词典【12,13】。全文索引比键值索引复杂得多，但是基于类似的想法：在搜索查询中，由一个给定的单词，找到提及单词的所有文档（网页，产品描述等）。这也是通过键值结构实现的：其中键是 "),l("strong",null,"单词（term）"),t("，值是所有包含该单词的文档的 ID 列表（"),l("strong",null,"postings list"),t("）。在 Lucene 中，从词语到记录列表的这种映射保存在类似于 SSTable 的有序文件中，并根据需要在后台执行合并【14】。")])],-1)),n[27]||(n[27]=l("p",null,"提到了 Elasticsearch，后面学习的时候可以注意一下啊。",-1)),n[28]||(n[28]=l("p",null,[t("以 "),l("strong",null,"单词"),t(" 为键，用大量空间（但是使用压缩和树结构进行优化）换取时间。当把其中一项做到极致，比如特别快或者占用磁盘空间特别小时，也是一种成功。或者这时候应用范围会更广——相比于特点中庸的应用。")],-1)),n[29]||(n[29]=l("hr",null,null,-1)),n[30]||(n[30]=l("blockquote",null,[l("h3",{id:"b树",tabindex:"-1"},[t("B树 "),l("a",{class:"header-anchor",href:"#b树","aria-label":'Permalink to "B树"'},"​")]),l("p",null,"前面讨论的日志结构索引看起来已经相当可用了，但它们却不是最常见的索引类型。使用最广泛的索引结构和日志结构索引相当不同，它就是我们接下来要讨论的 B 树。"),l("p",null,"从 1970 年被引入【17】，仅不到 10 年后就变得 “无处不在”【18】，B 树很好地经受了时间的考验。在几乎所有的关系数据库中，它们仍然是标准的索引实现，许多非关系数据库也会使用到 B 树。"),l("p",null,"像 SSTables 一样，B 树保持按键排序的键值对，这允许高效的键值查找和范围查询。但这也就是仅有的相似之处了：B 树有着非常不同的设计理念。")],-1)),n[31]||(n[31]=l("p",null,[t("终于到 B 树了！这里提到 B 树的设计理念与上文提到的 "),l("strong",null,"日志结构索引"),t(" 不同。先独立思考一下。")],-1)),n[32]||(n[32]=l("p",null,"B 树也是有序的树形结构，每一层都存储数据，有序且进行了分区。一直维护最新的数据。",-1)),n[33]||(n[33]=l("hr",null,null,-1)),n[34]||(n[34]=l("blockquote",null,[l("p",null,[t("我们前面看到的日志结构索引将数据库分解为可变大小的段，通常是几兆字节或更大的大小，并且总是按顺序写入段。相比之下，B 树将数据库分解成固定大小的 "),l("strong",null,"块（block）"),t(" 或 "),l("strong",null,"分页（page）"),t("，传统上大小为 4KB（有时会更大），并且一次只能读取或写入一个页面。这种设计更接近于底层硬件，因为硬盘空间也是按固定大小的块来组织的。")]),l("p",null,"每个页面都可以使用地址或位置来标识，这允许一个页面引用另一个页面 —— 类似于指针，但在硬盘而不是在内存中。我们可以使用这些页面引用来构建一个页面树，如 [图 3-6]")],-1)),r(" > (https://github.com/Vonng/ddia/blob/master/img/fig3-6.png)  "),n[35]||(n[35]=l("blockquote",null,[l("p",null,"所示。")],-1)),r(" > ![img](https://1126993343-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MHdCOHMs3fNDC20H5qi%2Fuploads%2Fgit-blob-99ab40d51ee679cb35bd46f8378776d832deff07%2Ffig3-6.png?alt=media) "),n[36]||(n[36]=l("p",null,[t("果然自己思考没有想到重点，作者想说的重点是， B 树使用了 "),l("strong",null,"更接近底层硬件的设计"),t("，使用固定大小的块（block）或者分页（page）来组织数据。")],-1)),n[37]||(n[37]=l("p",null,[t("BTW，在上文中曾经提过在保存数据时是保存 "),l("strong",null,"副本"),t(" 还是 "),l("strong",null,"引用"),t("，在「时间」这个指标相对来说更为重要的阶段，通常都会使用大量的「空间」，而保存 "),l("strong",null,"副本"),t(" 所占用的「空间」是不可估量的，保存引用可能是唯一可行的出路。")],-1)),n[38]||(n[38]=l("hr",null,null,-1)),n[39]||(n[39]=l("blockquote",null,[l("p",null,[t("在 B 树的一个页面中对子页面的引用的数量称为 "),l("strong",null,"分支因子（branching factor）"),t("。例如，在 [图 3-6]")])],-1)),r(" > (https://github.com/Vonng/ddia/blob/master/img/fig3-6.png) "),n[40]||(n[40]=l("blockquote",null,[l("p",null,"中，分支因子是 6。在实践中，分支因子的大小取决于存储页面引用和范围边界所需的空间，但这个值通常是几百。")],-1)),n[41]||(n[41]=l("p",null,[l("strong",null,"分支因子"),t(" 的数量级也显示出 B 树在应对大数据量时依然游刃有余，容量很大。")],-1)),n[42]||(n[42]=l("p",null,[t("与之相对的，B 树的 "),l("strong",null,"层高"),t(" 应该不会很大。")],-1)),n[43]||(n[43]=l("hr",null,null,-1)),n[44]||(n[44]=l("blockquote",null,[l("p",null,[l("strong",null,"图 3-7 通过分割页面来生长 B 树")]),l("p",null,[t("这个算法可以确保树保持平衡：具有 n 个键的 B 树总是具有 "),l("span",{class:"katex"},[l("span",{class:"katex-mathml"},[l("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[l("semantics",null,[l("mrow",null,[l("mi",null,"O"),l("mo",{stretchy:"false"},"("),l("mi",null,"l"),l("mi",null,"o"),l("mi",null,"g"),l("mi",null,"n"),l("mo",{stretchy:"false"},")")]),l("annotation",{encoding:"application/x-tex"},"O (log n)")])])]),l("span",{class:"katex-html","aria-hidden":"true"},[l("span",{class:"base"},[l("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),l("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"O"),l("span",{class:"mopen"},"("),l("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),l("span",{class:"mord mathnormal"},"o"),l("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"g"),l("span",{class:"mord mathnormal"},"n"),l("span",{class:"mclose"},")")])])]),t(" 的深度。大多数数据库可以放入一个三到四层的 B 树，所以你不需要追踪多个页面引用来找到你正在查找的页面（分支因子为 500 的 4KB 页面的四层树可以存储多达 256TB 的数据）。")])],-1)),n[45]||(n[45]=l("p",null,"为什么要设计成「矮胖」形式而不是「瘦高」形式呢？我想，这里面还是跟「B 树使用更接近底层硬件的设计」有关，载入一页（一层）之后，在页内进行检索无需进行 IO 操作，时空间开销更小。",-1)),n[46]||(n[46]=l("p",null,[t("同时 "),l("span",{class:"katex"},[l("span",{class:"katex-mathml"},[l("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[l("semantics",null,[l("mrow",null,[l("mi",null,"O"),l("mo",{stretchy:"false"},"("),l("mi",null,"l"),l("mi",null,"o"),l("mi",null,"g"),l("mi",null,"n"),l("mo",{stretchy:"false"},")")]),l("annotation",{encoding:"application/x-tex"},"O (log n)")])])]),l("span",{class:"katex-html","aria-hidden":"true"},[l("span",{class:"base"},[l("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),l("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"O"),l("span",{class:"mopen"},"("),l("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),l("span",{class:"mord mathnormal"},"o"),l("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"g"),l("span",{class:"mord mathnormal"},"n"),l("span",{class:"mclose"},")")])])]),t(" 的复杂度使每一层的 "),l("strong",null,"分支因子"),t(" 数量级可以稍微大一些。")],-1)),n[47]||(n[47]=l("hr",null,null,-1)),n[48]||(n[48]=l("blockquote",null,[l("h4",{id:"让b树更可靠",tabindex:"-1"},[t("让B树更可靠 "),l("a",{class:"header-anchor",href:"#让b树更可靠","aria-label":'Permalink to "让B树更可靠"'},"​")]),l("p",null,"B 树的基本底层写操作是用新数据覆写硬盘上的页面，并假定覆写不改变页面的位置：即，当页面被覆写时，对该页面的所有引用保持完整。这与日志结构索引（如 LSM 树）形成鲜明对比，后者只追加到文件（并最终删除过时的文件），但从不修改文件中已有的内容。"),l("p",null,"你可以把覆写硬盘上的页面对应为实际的硬件操作。在磁性硬盘驱动器上，这意味着将磁头移动到正确的位置，等待旋转盘上的正确位置出现，然后用新的数据覆写适当的扇区。在固态硬盘上，由于 SSD 必须一次擦除和重写相当大的存储芯片块，所以会发生更复杂的事情【19】。"),l("p",null,"而且，一些操作需要覆写几个不同的页面。例如，如果因为插入导致页面过满而拆分页面，则需要写入新拆分的两个页面，并覆写其父页面以更新对两个子页面的引用。这是一个危险的操作，因为如果数据库在系列操作进行到一半时崩溃，那么最终将导致一个损坏的索引（例如，可能有一个孤儿页面没有被任何页面引用） 。"),l("p",null,[t("为了使数据库能处理异常崩溃的场景，B 树实现通常会带有一个额外的硬盘数据结构："),l("strong",null,"预写式日志"),t("（WAL，即 write-ahead log，也称为 "),l("strong",null,"重做日志"),t("，即 redo log）。这是一个仅追加的文件，每个 B 树的修改在其能被应用到树本身的页面之前都必须先写入到该文件。当数据库在崩溃后恢复时，这个日志将被用来使 B 树恢复到一致的状态【5,20】。")])],-1)),n[49]||(n[49]=l("p",null,"内容有点多，简而言之。",-1)),n[50]||(n[50]=l("ol",null,[l("li",null,"B 树的查找效率可能很高，但是在面对插入删除操作时显得有些力不从心。不但有风险，开销还不小。"),l("li",null,[l("strong",null,"redo log"),t(" 是附着在 B 树这种数据结构上的一种额外的硬盘数据结构，使用追加的方式写入对 B 树的修改语句。用以应对数据库异常崩溃时数据丢失或索引损坏的情况。")])],-1)),n[51]||(n[51]=l("p",null,"看到这里，感慨颇多。",-1)),n[52]||(n[52]=l("p",null,"以前对于知识的态度是——欣赏能讲得出来龙去脉深入浅出的，也很爱直接把知识摆在桌子上自己啃的。但是现在看来，循循善诱的讲法还是更胜一筹。这可能也是习惯于填鸭式教育的一种觉醒吧。",-1)),n[53]||(n[53]=l("hr",null,null,-1)),n[54]||(n[54]=l("blockquote",null,[l("p",null,[t("由于反复压缩和合并 SSTables，日志结构索引也会多次重写数据。这种影响 —— 在数据库的生命周期中每笔数据导致对硬盘的多次写入 —— 被称为 "),l("strong",null,"写入放大（write amplification）"),t("。使用固态硬盘的机器需要额外关注这点，固态硬盘的闪存寿命在覆写有限次数后就会耗尽。")])],-1)),n[55]||(n[55]=l("p",null,"作者会频繁提到有关硬件的细节，应该重视起来。",-1)),n[56]||(n[56]=l("hr",null,null,-1)),n[57]||(n[57]=l("blockquote",null,[l("p",null,"在许多固态硬盘上，固件内部使用了日志结构化算法，以将随机写入转变为顺序写入底层存储芯片，因此存储引擎写入模式的影响不太明显【19】。但是，较低的写入放大率和减少的碎片仍然对固态硬盘更有利：更紧凑地表示数据允许在可用的 I/O 带宽内处理更多的读取和写入请求。")],-1)),n[58]||(n[58]=l("p",null,"note.",-1)),n[59]||(n[59]=l("hr",null,null,-1)),n[60]||(n[60]=l("blockquote",null,[l("h4",{id:"lsm树的缺点",tabindex:"-1"},[t("LSM树的缺点 "),l("a",{class:"header-anchor",href:"#lsm树的缺点","aria-label":'Permalink to "LSM树的缺点"'},"​")]),l("p",null,"日志结构存储的缺点是压缩过程有时会干扰正在进行的读写操作。尽管存储引擎尝试增量地执行压缩以尽量不影响并发访问，但是硬盘资源有限，所以很容易发生某个请求需要等待硬盘先完成昂贵的压缩操作。对吞吐量和平均响应时间的影响通常很小，但是日志结构化存储引擎在更高百分位的响应时间（请参阅 “[描述性能]”）有时会相当长，而 B 树的行为则相对更具有可预测性【28】。"),l("p",null,"压缩的另一个问题出现在高写入吞吐量时：硬盘的有限写入带宽需要在初始写入（记录日志和刷新内存表到硬盘）和在后台运行的压缩线程之间共享。写入空数据库时，可以使用全硬盘带宽进行初始写入，但数据库越大，压缩所需的硬盘带宽就越多。"),l("p",null,"如果写入吞吐量很高，并且压缩没有仔细配置好，有可能导致压缩跟不上写入速率。在这种情况下，硬盘上未合并段的数量不断增加，直到硬盘空间用完，读取速度也会减慢，因为它们需要检查更多的段文件。通常情况下，即使压缩无法跟上，基于 SSTable 的存储引擎也不会限制传入写入的速率，所以你需要进行明确的监控来检测这种情况【29,30】。")],-1)),n[61]||(n[61]=l("p",null,"LSM 树的效率随着使用时间的增长和数据量的增加而下降。需要提供一个监测指标来防止这种情况的发生和恶化。",-1)),n[62]||(n[62]=l("hr",null,null,-1)),n[63]||(n[63]=l("blockquote",null,[l("p",null,"反直觉的是，内存数据库的性能优势并不是因为它们不需要从硬盘读取的事实。只要有足够的内存即使是基于硬盘的存储引擎也可能永远不需要从硬盘读取，因为操作系统在内存中缓存了最近使用的硬盘块。相反，它们更快的原因在于省去了将内存数据结构编码为硬盘数据结构的开销【44】。")],-1)),n[64]||(n[64]=l("p",null,"note：Redis 相对于硬盘上的数据系统为什么快？",-1)),n[65]||(n[65]=l("hr",null,null,-1)),n[66]||(n[66]=l("blockquote",null,[l("p",null,[t("术语 "),l("strong",null,"交易 / 事务（transaction）"),t(" 仍留了下来，用于指代一组读写操作构成的逻辑单元。")])],-1)),n[67]||(n[67]=l("p",null,"note。",-1)),n[68]||(n[68]=l("hr",null,null,-1)),n[69]||(n[69]=l("blockquote",null,[l("h3",{id:"数据仓库",tabindex:"-1"},[t("数据仓库 "),l("a",{class:"header-anchor",href:"#数据仓库","aria-label":'Permalink to "数据仓库"'},"​")]),l("p",null,"一个企业可能有几十个不同的交易处理系统：面向终端客户的网站，控制实体商店的收银系统，仓库库存跟踪，车辆路线规划，供应链管理，员工管理等。这些系统中每一个都很复杂，需要专人维护，所以最终这些系统互相之间都是独立运行的。"),l("p",null,[t("这些 OLTP 系统往往对业务运作至关重要，因而通常会要求 "),l("strong",null,"高可用"),t(" 与 "),l("strong",null,"低延迟"),t("。所以 DBA 会密切关注他们的 OLTP 数据库，他们通常不愿意让业务分析人员在 OLTP 数据库上运行临时的分析查询，因为这些查询通常开销巨大，会扫描大部分数据集，这会损害同时在执行的事务的性能。")])],-1)),n[70]||(n[70]=l("p",null,"除去 SQL 语句本身的复杂性，在大规模的数据集上进行操作时，可能简单的 SQL 也会带来巨大的性能开销。",-1)),n[71]||(n[71]=l("hr",null,null,-1)),n[72]||(n[72]=l("blockquote",null,[l("p",null,[t("相比之下，数据仓库是一个独立的数据库，分析人员可以查询他们想要的内容而不影响 OLTP 操作【48】。数据仓库包含公司各种 OLTP 系统中所有的只读数据副本。从 OLTP 数据库中提取数据（使用定期的数据转储或连续的更新流），转换成适合分析的模式，清理并加载到数据仓库中。将数据存入仓库的过程称为 “"),l("strong",null,"抽取 - 转换 - 加载（ETL）"),t("”，如 [图 3-8]")])],-1)),r(" > (https://github.com/Vonng/ddia/blob/master/img/fig3-8.png)  "),n[73]||(n[73]=l("blockquote",null,[l("p",null,"所示。")],-1)),r(" > ![img](https://1126993343-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MHdCOHMs3fNDC20H5qi%2Fuploads%2Fgit-blob-acecd9e64499e2541269ebc48f1579b1c6ac2acc%2Ffig3-8.png?alt=media) "),n[74]||(n[74]=l("p",null,"ETL 好像是现在大数据提到的概念来着。之前在微软的时候也看到了 spark 和 Kafka 这种用以处理大规模数据的系统。",-1)),n[75]||(n[75]=l("hr",null,null,-1)),n[76]||(n[76]=l("blockquote",null,[l("p",null,"对这个想法，有一个巧妙的扩展被 C-Store 发现，并在商业数据仓库 Vertica 中被采用【61,62】：既然不同的查询受益于不同的排序顺序，为什么不以几种不同的方式来存储相同的数据呢？反正数据都需要做备份，以防单点故障时丢失数据。因此你可以用不同排序方式来存储冗余数据，以便在处理查询时，调用最适合查询模式的版本。n")],-1)),n[77]||(n[77]=l("p",null,"note，涨知识。",-1)),n[78]||(n[78]=l("hr",null,null,-1)),n[79]||(n[79]=l("blockquote",null,[l("p",null,"关于 OLTP，我们最后还介绍了一些更复杂的索引结构，以及针对所有数据都放在内存里而优化的数据库。"),l("p",null,"然后，我们暂时放下了存储引擎的内部细节，查看了典型数据仓库的高级架构，并说明了为什么分析工作负载与 OLTP 差别很大：当你的查询需要在大量行中顺序扫描时，索引的重要性就会降低很多。相反，非常紧凑地编码数据变得非常重要，以最大限度地减少查询需要从硬盘读取的数据量。我们讨论了列式存储如何帮助实现这一目标。"),l("p",null,"作为一名应用程序开发人员，如果你掌握了有关存储引擎内部的知识，那么你就能更好地了解哪种工具最适合你的特定应用程序。当你调整数据库的优化参数时，这种理解让你能够设想增减某个值会产生怎样的效果。"),l("p",null,"尽管本章不能让你成为一个特定存储引擎的调参专家，但它至少大概率使你有了足够的概念与词汇储备去读懂你所选择的数据库的文档。")],-1)),n[80]||(n[80]=l("p",null,"第三章内容很多，但是大部分都是在介绍时下流行的一些数据系统，包括大型的公司是怎么处理海量数据的，做了哪些优化，深层次的原因是什么样的。",-1)),n[81]||(n[81]=l("p",null,"还介绍了索引和实现索引使用的各种数据结构，包括 B 树和 B 树的变种（我们常常说的 InnoDB 使用的 B+ 树），讲了这些数据结构的来龙去脉。",-1)),n[82]||(n[82]=l("p",null,"开拓了视野，也能为阅读文档打下基础。",-1)),n[83]||(n[83]=l("p",null,"也让我在讨论相关内容的时候有话可说，有根据可判断。",-1)),n[84]||(n[84]=l("p",null,"BTW，第四章稍微搁置一下，准备回归学习一下具体的应用。",-1))]),"main-header":o(()=>[u(s.$slots,"main-header")]),"main-header-after":o(()=>[u(s.$slots,"main-header-after")]),"main-nav":o(()=>[u(s.$slots,"main-nav")]),"main-content-before":o(()=>[u(s.$slots,"main-content-before")]),"main-content":o(()=>[u(s.$slots,"main-content")]),"main-content-after":o(()=>[u(s.$slots,"main-content-after")]),"main-nav-before":o(()=>[u(s.$slots,"main-nav-before")]),"main-nav-after":o(()=>[u(s.$slots,"main-nav-after")]),comment:o(()=>[u(s.$slots,"comment")]),footer:o(()=>[u(s.$slots,"footer")]),aside:o(()=>[u(s.$slots,"aside")]),"aside-custom":o(()=>[u(s.$slots,"aside-custom")]),default:o(()=>[u(s.$slots,"default")]),_:3},8,["frontmatter"])}}};export{R as default,x as usePageData};
