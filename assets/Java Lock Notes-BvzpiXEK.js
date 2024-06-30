import{_ as d}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DRMwKLA6.js";import{a as p,p as o,o as c,c as u,w as i,f as g,r as e,g as t,h as s}from"./app-B_lbTwZU.js";import"./YunFooter.vue_vue_type_script_setup_true_lang-DXX2ZxjQ.js";import"./YunCard.vue_vue_type_script_setup_true_lang-DDKa6XCF.js";import"./index-C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-l3Vxf24V.js";import"./post-B4jxDa69.js";const m=t("blockquote",null,[t("p",null,[t("a",{href:"https://tech.meituan.com/2018/11/15/java-lock.html",target:"_blank",rel:"noreferrer"},"https://tech.meituan.com/2018/11/15/java-lock.html")])],-1),E=t("p",null,"美团这篇写的很好，非常适合拿来复习。",-1),_=t("hr",null,null,-1),y=t("figure",null,[t("img",{src:"https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/7f749fc8.png",alt:"img",loading:"lazy",decoding:"async"})],-1),v=t("h3",{id:"_1-乐观锁-vs-悲观锁",tabindex:"-1"},[s("1. 乐观锁 VS 悲观锁 "),t("a",{class:"header-anchor",href:"#_1-乐观锁-vs-悲观锁","aria-label":'Permalink to "1. 乐观锁 VS 悲观锁"'},"​")],-1),f=t("p",null,"乐观锁与悲观锁是一种广义上的概念，体现了看待线程同步的不同角度。在Java和数据库中都有此概念对应的实际应用。",-1),A=t("p",null,"先说概念。对于同一个数据的并发操作，悲观锁认为自己在使用数据的时候一定有别的线程来修改数据，因此在获取数据的时候会先加锁，确保数据不会被别的线程修改。Java中，synchronized关键字和Lock的实现类都是悲观锁。",-1),F=t("p",null,"而乐观锁认为自己在使用数据时不会有别的线程修改数据，所以不会添加锁，只是在更新数据的时候去判断之前有没有别的线程更新了这个数据。如果这个数据没有被更新，当前线程将自己修改的数据成功写入。如果数据已经被其他线程更新，则根据不同的实现方式执行不同的操作（例如报错或者自动重试）。",-1),C=t("p",null,"乐观锁在Java中是通过使用无锁编程来实现，最常采用的是CAS算法，Java原子类中的递增操作就通过CAS自旋实现的。",-1),b=t("ul",null,[t("li",null,"悲观锁适合写操作多的场景，先加锁可以保证写操作时数据正确。"),t("li",null,"乐观锁适合读操作多的场景，不加锁的特点能够使其读操作的性能大幅提升。")],-1),S=t("blockquote",null,[t("div",{class:"language-java vp-adaptive-theme"},[t("button",{title:"Copy Code",class:"copy"}),t("span",{class:"lang"},"java"),t("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[t("code",{"v-pre":""},[t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"public"),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," volatile"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," AtomicInteger size "),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," new"),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," AtomicInteger"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),t("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"0"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},");")]),s(`
`),t("span",{class:"line"}),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"void"),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," test"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() {")]),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    size."),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"incrementAndGet"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),t("button",{class:"collapse"})]),t("p",null,[s("乐观锁且线程安全的方法"),t("code",null,"test()"),s("。")])],-1),J=t("p",null,"在JNI里是借助于一个CPU指令完成的，属于原子操作，可以保证多个线程都能够看到同一个变量的修改值。",-1),D=t("p",null,[s("后续JDK通过CPU的 "),t("strong",null,"cmpxchg"),s(" 指令，去比较寄存器中的 A 和 内存中的值 V。")],-1),B=t("hr",null,null,-1),V=t("p",null,[t("strong",null,"CAS虽然很高效，但是它也存在三大问题，这里也简单说一下：")],-1),x=t("ol",null,[t("li",null,[t("p",null,"ABA问题"),t("p",null,"。CAS需要在操作值的时候检查内存值是否发生变化，没有发生变化才会更新内存值。但是如果内存值原来是A，后来变成了B，然后又变成了A，那么CAS进行检查时会发现值没有发生变化，但是实际上是有变化的。ABA问题的解决思路就是在变量前面添加版本号，每次变量更新的时候都把版本号加一，这样变化过程就从“A－B－A”变成了“1A－2B－3A”。"),t("ul",null,[t("li",null,"JDK从1.5开始提供了AtomicStampedReference类来解决ABA问题，具体操作封装在compareAndSet()中。compareAndSet()首先检查当前引用和当前标志与预期引用和预期标志是否相等，如果都相等，则以原子方式将引用值和标志的值设置为给定的更新值。")])]),t("li",null,[t("p",null,[t("strong",null,"循环时间长开销大"),s("。CAS操作如果长时间不成功，会导致其一直自旋，给CPU带来非常大的开销。")])]),t("li",null,[t("p",null,"只能保证一个共享变量的原子操作。"),t("p",null,"对一个共享变量执行操作时，CAS能够保证原子操作，但是对多个共享变量操作时，CAS是无法保证操作的原子性的。"),t("blockquote",null,[t("div",{class:"language-java vp-adaptive-theme"},[t("button",{title:"Copy Code",class:"copy"}),t("span",{class:"lang"},"java"),t("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[t("code",{"v-pre":""},[t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"public"),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," volatile"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," AtomicInteger size "),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," new"),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," AtomicInteger"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),t("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"0"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},");")]),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"public"),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," volatile"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," AtomicInteger size2 "),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," new"),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," AtomicInteger"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),t("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"0"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},");")]),s(`
`),t("span",{class:"line"}),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"void"),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," test"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"() {")]),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    size."),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"incrementAndGet"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    size2."),t("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"incrementAndGet"),t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"();")]),s(`
`),t("span",{class:"line"},[t("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),t("button",{class:"collapse"})]),t("p",null,[s("乐观锁但非线程安全的方法"),t("code",null,"test()"),s("。")])]),t("ul",null,[t("li",null,"Java从1.5开始JDK提供了AtomicReference类来保证引用对象之间的原子性，可以把多个变量放在一个对象里来进行CAS操作。")])])],-1),$=t("hr",null,null,-1),z=t("h3",{id:"_2-自旋锁-vs-适应性自旋锁",tabindex:"-1"},[s("2. 自旋锁 VS 适应性自旋锁 "),t("a",{class:"header-anchor",href:"#_2-自旋锁-vs-适应性自旋锁","aria-label":'Permalink to "2. 自旋锁 VS 适应性自旋锁"'},"​")],-1),N=t("p",null,"在介绍自旋锁前，我们需要介绍一些前提知识来帮助大家明白自旋锁的概念。",-1),P=t("p",null,"阻塞或唤醒一个Java线程需要操作系统切换CPU状态来完成，这种状态转换需要耗费处理器时间。如果同步代码块中的内容过于简单，状态转换消耗的时间有可能比用户代码执行的时间还要长。",-1),I=t("p",null,[s("在许多场景中，"),t("strong",null,"同步资源的锁定时间很短"),s("，为了这一小段时间去切换线程，"),t("strong",null,"线程挂起和恢复现场的花费可能会让系统得不偿失"),s("。如果物理机器有多个处理器，能够让两个或以上的线程同时并行执行，我们就可以让后面那个请求锁的线程不放弃CPU的执行时间，看看持有锁的线程是否很快就会释放锁。")],-1),j=t("p",null,"而为了让当前线程“稍等一下”，我们需让当前线程进行自旋，如果在自旋完成后前面锁定同步资源的线程已经释放了锁，那么当前线程就可以不必阻塞而是直接获取同步资源，从而避免切换线程的开销。这就是自旋锁。",-1),w=t("hr",null,null,-1),L=t("h3",{id:"_3-无锁-vs-偏向锁-vs-轻量级锁-vs-重量级锁",tabindex:"-1"},[s("3. 无锁 VS 偏向锁 VS 轻量级锁 VS 重量级锁 "),t("a",{class:"header-anchor",href:"#_3-无锁-vs-偏向锁-vs-轻量级锁-vs-重量级锁","aria-label":'Permalink to "3. 无锁 VS 偏向锁 VS 轻量级锁 VS 重量级锁"'},"​")],-1),U=t("p",null,"这四种锁是指锁的状态，专门针对synchronized的。在介绍这四种锁状态之前还需要介绍一些额外的知识。",-1),K=t("p",null,"首先为什么Synchronized能实现线程同步？",-1),T=t("p",null,"在回答这个问题之前我们需要了解两个重要的概念：“Java对象头”、“Monitor”。",-1),q=t("p",null,[t("strong",null,"锁一共有4种状态，级别从低到高依次是：无锁、偏向锁、轻量级锁和重量级锁。锁状态只能升级不能降级。")],-1),G=t("table",null,[t("thead",null,[t("tr",null,[t("th",{style:{"text-align":"left"}},"锁状态"),t("th",{style:{"text-align":"left"}},"存储内容"),t("th",{style:{"text-align":"left"}},"存储内容")])]),t("tbody",null,[t("tr",null,[t("td",{style:{"text-align":"left"}},"无锁"),t("td",{style:{"text-align":"left"}},"对象的hashCode、对象分代年龄、是否是偏向锁（0）"),t("td",{style:{"text-align":"left"}},"01")]),t("tr",null,[t("td",{style:{"text-align":"left"}},"偏向锁"),t("td",{style:{"text-align":"left"}},"偏向线程ID、偏向时间戳、对象分代年龄、是否是偏向锁（1）"),t("td",{style:{"text-align":"left"}},"01")]),t("tr",null,[t("td",{style:{"text-align":"left"}},"轻量级锁"),t("td",{style:{"text-align":"left"}},"指向栈中锁记录的指针"),t("td",{style:{"text-align":"left"}},"00")]),t("tr",null,[t("td",{style:{"text-align":"left"}},"重量级锁"),t("td",{style:{"text-align":"left"}},"指向互斥量（重量级锁）的指针"),t("td",{style:{"text-align":"left"}},"10")])])],-1),st={__name:"Java Lock Notes",setup(R,{expose:r}){const a=JSON.parse('{"title":"Java Lock Notes","description":"","frontmatter":{"title":"Java Lock Notes","date":"2024-03-04T15:40:59.000Z","tags":["锁","JDK"],"categories":["笔记","Java"],"author":"苏","readmore":true},"headers":[{"level":3,"title":"1. 乐观锁 VS 悲观锁","slug":"_1-乐观锁-vs-悲观锁","link":"#_1-乐观锁-vs-悲观锁","children":[]},{"level":3,"title":"2. 自旋锁 VS 适应性自旋锁","slug":"_2-自旋锁-vs-适应性自旋锁","link":"#_2-自旋锁-vs-适应性自旋锁","children":[]},{"level":3,"title":"3. 无锁 VS 偏向锁 VS 轻量级锁 VS 重量级锁","slug":"_3-无锁-vs-偏向锁-vs-轻量级锁-vs-重量级锁","link":"#_3-无锁-vs-偏向锁-vs-轻量级锁-vs-重量级锁","children":[]}],"relativePath":"pages/posts/Java Lock Notes.md","path":"/home/runner/work/674019130.github.io/674019130.github.io/pages/posts/Java Lock Notes.md","lastUpdated":1719766846000}'),h=p(),n=a.frontmatter||{};return h.meta.frontmatter=Object.assign(h.meta.frontmatter||{},a.frontmatter||{}),o("pageData",a),o("valaxy:frontmatter",n),globalThis.$frontmatter=n,r({frontmatter:{title:"Java Lock Notes",date:"2024-03-04T15:40:59.000Z",tags:["锁","JDK"],categories:["笔记","Java"],author:"苏",readmore:!0}}),(l,O)=>{const k=d;return c(),u(k,{frontmatter:g(n)},{"main-content-md":i(()=>[m,E,_,y,v,f,A,F,C,b,S,J,D,B,V,x,$,z,N,P,I,j,w,L,U,K,T,q,G]),"main-header":i(()=>[e(l.$slots,"main-header")]),"main-header-after":i(()=>[e(l.$slots,"main-header-after")]),"main-nav":i(()=>[e(l.$slots,"main-nav")]),"main-content":i(()=>[e(l.$slots,"main-content")]),"main-content-after":i(()=>[e(l.$slots,"main-content-after")]),"main-nav-before":i(()=>[e(l.$slots,"main-nav-before")]),"main-nav-after":i(()=>[e(l.$slots,"main-nav-after")]),comment:i(()=>[e(l.$slots,"comment")]),footer:i(()=>[e(l.$slots,"footer")]),aside:i(()=>[e(l.$slots,"aside")]),"aside-custom":i(()=>[e(l.$slots,"aside-custom")]),default:i(()=>[e(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{st as default};