import{_ as o}from"./ValaxyMain.vue_vue_type_style_index_0_lang.DfSvu0AI.js";import{f as u,a as E,u as y}from"./chunks/vue-router._WMYa8cX.js";import{s as m,bH as a,aW as i,v as s,H as l,bi as g,aK as A,aM as C}from"./framework.DDojlQDl.js";import"./app.i6-hyFKY.js";import"./chunks/dayjs.DPscOGnl.js";import"./chunks/vue-i18n.D5iU1Uln.js";import"./chunks/pinia.DkkyVvQY.js";import"./chunks/@vueuse/motion.B7tSKkoB.js";import"./chunks/nprogress.DgNGesC2.js";import"./YunComment.vue_vue_type_style_index_0_lang.lVt8y9cy.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.CUTuRIHR.js";import"./post.D5cvIXgt.js";const v=u("/posts/LeetCode-SQL-notes",async t=>JSON.parse('{"title":"LeetCode SQL 练习笔记","description":"","frontmatter":{"title":"LeetCode SQL 练习笔记","date":"2024-05-02 02:28:12","tags":["LeetCode","SQL"],"categories":["技术笔记","数据库"]},"headers":[{"level":2,"title":"550. 游戏玩法分析 IV 中等","slug":"_550-游戏玩法分析-iv-中等","link":"#_550-游戏玩法分析-iv-中等","children":[{"level":3,"title":"答案","slug":"答案","link":"#答案","children":[]}]},{"level":2,"title":"570. 至少有5名直接下属的经理 中等","slug":"_570-至少有5名直接下属的经理-中等","link":"#_570-至少有5名直接下属的经理-中等","children":[{"level":3,"title":"答案","slug":"答案-1","link":"#答案-1","children":[]}]},{"level":2,"title":"185. 部门工资前三高的所有员工 困难","slug":"_185-部门工资前三高的所有员工-困难","link":"#_185-部门工资前三高的所有员工-困难","children":[{"level":3,"title":"答案","slug":"答案-2","link":"#答案-2","children":[]}]},{"level":2,"title":"181. 超过经理收入的员工","slug":"_181-超过经理收入的员工","link":"#_181-超过经理收入的员工","children":[]},{"level":2,"title":"183. 部门工资最高的员工","slug":"_183-部门工资最高的员工","link":"#_183-部门工资最高的员工","children":[]},{"level":2,"title":"180. 连续出现的数字","slug":"_180-连续出现的数字","link":"#_180-连续出现的数字","children":[]},{"level":2,"title":"178. 分数排名","slug":"_178-分数排名","link":"#_178-分数排名","children":[]},{"level":2,"title":"626. 换座位","slug":"_626-换座位","link":"#_626-换座位","children":[]}],"relativePath":"pages/posts/LeetCode-SQL-notes.md","lastUpdated":1747386466000}'),{lazy:(t,p)=>t.name===p.name}),x={__name:"LeetCode-SQL-notes",setup(t,{expose:p}){var k;const{data:h}=v(),F=y(),r=E(),e=Object.assign(r.meta.frontmatter||{},((k=h.value)==null?void 0:k.frontmatter)||{});return r.meta.frontmatter=e,F.currentRoute.value.data=h.value,C("valaxy:frontmatter",e),globalThis.$frontmatter=e,p({frontmatter:{title:"LeetCode SQL 练习笔记",date:"2024-05-02 02:28:12",tags:["LeetCode","SQL"],categories:["技术笔记","数据库"]}}),(n,c)=>{const d=o;return A(),m(d,{frontmatter:g(e)},{"main-content-md":a(()=>c[0]||(c[0]=[s("h1",{id:"leetcode-数据库刷题笔记",tabindex:"-1"},[l("LeetCode 数据库刷题笔记 "),s("a",{class:"header-anchor",href:"#leetcode-数据库刷题笔记","aria-label":'Permalink to "LeetCode 数据库刷题笔记"'},"​")],-1),s("blockquote",null,[s("p",null,"只做重点的记录。")],-1),s("h2",{id:"_550-游戏玩法分析-iv-中等",tabindex:"-1"},[s("a",{href:"https://leetcode.cn/problems/game-play-analysis-iv/",target:"_blank",rel:"noreferrer"},"550. 游戏玩法分析 IV"),l(" 中等 "),s("a",{class:"header-anchor",href:"#_550-游戏玩法分析-iv-中等","aria-label":'Permalink to "[550. 游戏玩法分析 IV](https://leetcode.cn/problems/game-play-analysis-iv/) 中等"'},"​")],-1),s("hr",null,null,-1),s("p",null,[l("Table: "),s("code",null,"Activity")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"+--------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Column Name  | Type    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+--------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| player_id    | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| device_id    | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| event_date   | date    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| games_played | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+--------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"（player_id，event_date）是此表的主键（具有唯一值的列的组合）。")]),l(`
`),s("span",{class:"line"},[s("span",null,"这张表显示了某些游戏的玩家的活动情况。")]),l(`
`),s("span",{class:"line"},[s("span",null,"每一行是一个玩家的记录，他在某一天使用某个设备注销之前登录并玩了很多游戏（可能是 0）。")])])]),s("button",{class:"collapse"})],-1),s("p",null,[l("编写解决方案，报告在首次登录的第二天再次登录的玩家的 "),s("strong",null,"比率"),l("，"),s("strong",null,"四舍五入到小数点后两位"),l("。换句话说，你需要计算从首次登录日期开始至少连续两天登录的玩家的数量，然后除以玩家总数。")],-1),s("p",null,"结果格式如下所示：",-1),s("p",null,[s("strong",null,"示例 1：")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"输入：")]),l(`
`),s("span",{class:"line"},[s("span",null,"Activity table:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------+-----------+------------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| player_id | device_id | event_date | games_played |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------+-----------+------------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1         | 2         | 2016-03-01 | 5            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1         | 2         | 2016-03-02 | 6            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2         | 3         | 2017-06-25 | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3         | 1         | 2016-03-02 | 0            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3         | 4         | 2018-07-03 | 5            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------+-----------+------------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"输出：")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| fraction  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 0.33      |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"解释：")]),l(`
`),s("span",{class:"line"},[s("span",null,"只有 ID 为 1 的玩家在第一天登录后才重新登录，所以答案是 1/3 = 0.33")])])]),s("button",{class:"collapse"})],-1),s("h3",{id:"答案",tabindex:"-1"},[l("答案 "),s("a",{class:"header-anchor",href:"#答案","aria-label":'Permalink to "答案"'},"​")],-1),s("div",{class:"language-sql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"sql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"SELECT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}},"    ROUND"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"(login_next_day.count_login_next_day "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"/"),s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}}," COUNT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"("),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"DISTINCT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," activity.player_id), "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"2"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},") "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"AS"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," fraction ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"FROM"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"    Activity activity, ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"    (")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"        SELECT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}},"            COUNT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"("),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"*"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},") "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"AS"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," count_login_next_day ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"        FROM"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"            (")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"                SELECT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"                    a.player_id, ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}},"                    MIN"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"(a.event_date) "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"AS"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," first_login ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"                FROM"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"                    Activity a ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"                GROUP BY"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"                    a.player_id ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"                ORDER BY"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"                    a.event_date")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"            ) first_logins, ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"            Activity aa ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"        WHERE"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"            aa.event_date "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," DATE_ADD(first_logins.first_login, INTERVAL "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"1"),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}}," DAY"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},") ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"            AND"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," first_logins.player_id "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," aa.player_id")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"    ) login_next_day;")])])]),s("button",{class:"collapse"})],-1),s("h2",{id:"_570-至少有5名直接下属的经理-中等",tabindex:"-1"},[s("a",{href:"https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/",target:"_blank",rel:"noreferrer"},"570. 至少有5名直接下属的经理"),l(" 中等 "),s("a",{class:"header-anchor",href:"#_570-至少有5名直接下属的经理-中等","aria-label":'Permalink to "[570. 至少有5名直接下属的经理](https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/) 中等"'},"​")],-1),s("p",null,[l("表: "),s("code",null,"Employee")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"+-------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Column Name | Type    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id          | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| name        | varchar |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| department  | varchar |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| managerId   | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"id 是此表的主键（具有唯一值的列）。")]),l(`
`),s("span",{class:"line"},[s("span",null,"该表的每一行表示雇员的名字、他们的部门和他们的经理的id。")]),l(`
`),s("span",{class:"line"},[s("span",null,"如果managerId为空，则该员工没有经理。")]),l(`
`),s("span",{class:"line"},[s("span",null,"没有员工会成为自己的管理者。")])])]),s("button",{class:"collapse"})],-1),s("p",null,[l("编写一个解决方案，找出至少有"),s("strong",null,"五个直接下属"),l("的经理。")],-1),s("p",null,[l("以 "),s("strong",null,"任意顺序"),l(" 返回结果表。")],-1),s("p",null,"查询结果格式如下所示。",-1),s("p",null,[s("strong",null,"示例 1:")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"输入: ")]),l(`
`),s("span",{class:"line"},[s("span",null,"Employee 表:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----+-------+------------+-----------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id  | name  | department | managerId |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----+-------+------------+-----------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 101 | John  | A          | Null      |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 102 | Dan   | A          | 101       |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 103 | James | A          | 101       |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 104 | Amy   | A          | 101       |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 105 | Anne  | A          | 101       |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 106 | Ron   | B          | 101       |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----+-------+------------+-----------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"输出: ")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| name |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| John |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------+")])])]),s("button",{class:"collapse"})],-1),s("h3",{id:"答案-1",tabindex:"-1"},[l("答案 "),s("a",{class:"header-anchor",href:"#答案-1","aria-label":'Permalink to "答案"'},"​")],-1),s("div",{class:"language-sql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"sql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"# Write your MySQL query "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"statement"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," below")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"select"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e.name "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"from"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Employee e")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"where"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e.id "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"in"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," (")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    select"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ee.id "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"from"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Employee ee, Employee eee")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    where"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," eee.managerId "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ee.id #("),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"1"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    group by"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ee.id ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    having"),s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}}," count"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"("),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"distinct"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," eee.id) "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},">="),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}}," 5"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," #("),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"2"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},")")])])]),s("button",{class:"collapse"})],-1),s("p",null,[l("需要注意的是，要查找对于每一个分组的条件，写在"),s("code",null,"(1)"),l("处，对筛选之后分组的结果再进行数量限制，写在"),s("code",null,"(2)"),l("处。与之类似的还有"),s("strong",null,"题目 185"),l("，也可以使用子查询做。")],-1),s("h2",{id:"_185-部门工资前三高的所有员工-困难",tabindex:"-1"},[s("a",{href:"https://leetcode.cn/problems/department-top-three-salaries/",target:"_blank",rel:"noreferrer"},"185. 部门工资前三高的所有员工"),l(" 困难 "),s("a",{class:"header-anchor",href:"#_185-部门工资前三高的所有员工-困难","aria-label":'Permalink to "[185. 部门工资前三高的所有员工](https://leetcode.cn/problems/department-top-three-salaries/) 困难"'},"​")],-1),s("p",null,[l("表: "),s("code",null,"Employee")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"+--------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Column Name  | Type    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+--------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id           | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| name         | varchar |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| salary       | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| departmentId | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+--------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"id 是该表的主键列(具有唯一值的列)。")]),l(`
`),s("span",{class:"line"},[s("span",null,"departmentId 是 Department 表中 ID 的外键（reference 列）。")]),l(`
`),s("span",{class:"line"},[s("span",null,"该表的每一行都表示员工的ID、姓名和工资。它还包含了他们部门的ID。")])])]),s("button",{class:"collapse"})],-1),s("p",null,[l("表: "),s("code",null,"Department")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"+-------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Column Name | Type    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id          | int     |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| name        | varchar |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-------------+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"id 是该表的主键列(具有唯一值的列)。")]),l(`
`),s("span",{class:"line"},[s("span",null,"该表的每一行表示部门ID和部门名。")])])]),s("button",{class:"collapse"})],-1),s("p",null,[l("公司的主管们感兴趣的是公司每个部门中谁赚的钱最多。一个部门的 "),s("strong",null,"高收入者"),l(" 是指一个员工的工资在该部门的 "),s("strong",null,"不同"),l(" 工资中 "),s("strong",null,"排名前三"),l(" 。")],-1),s("p",null,[l("编写解决方案，找出每个部门中 "),s("strong",null,"收入高的员工"),l(" 。")],-1),s("p",null,[l("以 "),s("strong",null,"任意顺序"),l(" 返回结果表。")],-1),s("p",null,"返回结果格式如下所示。",-1),s("p",null,[s("strong",null,"示例 1:")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"输入: ")]),l(`
`),s("span",{class:"line"},[s("span",null,"Employee 表:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+--------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id | name  | salary | departmentId |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+--------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | Joe   | 85000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | Henry | 80000  | 2            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3  | Sam   | 60000  | 2            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 4  | Max   | 90000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 5  | Janet | 69000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 6  | Randy | 85000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 7  | Will  | 70000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+--------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"Department  表:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id | name  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | IT    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | Sales |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"输出: ")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------------+----------+--------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Department | Employee | Salary |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------------+----------+--------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| IT         | Max      | 90000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| IT         | Joe      | 85000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| IT         | Randy    | 85000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| IT         | Will     | 70000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Sales      | Henry    | 80000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Sales      | Sam      | 60000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------------+----------+--------+")])])]),s("button",{class:"collapse"})],-1),s("h3",{id:"答案-2",tabindex:"-1"},[l("答案 "),s("a",{class:"header-anchor",href:"#答案-2","aria-label":'Permalink to "答案"'},"​")],-1),s("div",{class:"language-sql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"sql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"SELECT")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	d.NAME "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"AS"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Department,")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	e.NAME "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"AS"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Employee,")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	e.salary "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"AS"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Salary ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"FROM")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	employee e")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"	LEFT JOIN"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," department d "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"ON"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e.departmentId "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," d.id ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"WHERE")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	e.id "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"IN"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," (")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"	SELECT")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"		e1.id ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"	FROM")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"		employee e1,")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"		employee e2 ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"	WHERE")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"		e1.salary "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"<="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e2.salary ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"		AND"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e1.departmentId "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e2.departmentId ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"	GROUP BY")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"		e1.id ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"	HAVING")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}},"		count"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"( "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"DISTINCT"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e2.salary ) "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"<="),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}}," 3"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	) ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"ORDER BY")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	Department,")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"	Salary "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"DESC")])])]),s("button",{class:"collapse"})],-1),s("div",{class:"language-sql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"sql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"select"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Department, Employee, Salary")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"from"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," (")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    select"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," d.Name "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"as"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Department, e.Name "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"as"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Employee, e.Salary "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"as"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Salary, ")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6182B8","--shiki-dark":"#82AAFF"}},"	dense_rank"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},"() "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"over"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," ("),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"partition"),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}}," by"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," DepartmentId "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"order by"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Salary "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"desc"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},") "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"as"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," rk")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    from"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," Employee "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"as"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e, Department "),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"as"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," d")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"    where"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," e.DepartmentId "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"="),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," d.Id")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},") m")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}},"where"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}}," rk "),s("span",{style:{"--shiki-light":"#39ADB5","--shiki-dark":"#89DDFF"}},"<="),s("span",{style:{"--shiki-light":"#F76D47","--shiki-dark":"#F78C6C"}}," 3"),s("span",{style:{"--shiki-light":"#90A4AE","--shiki-dark":"#EEFFFF"}},";")])])]),s("button",{class:"collapse"})],-1),s("h2",{id:"_181-超过经理收入的员工",tabindex:"-1"},[l("181. 超过经理收入的员工 "),s("a",{class:"header-anchor",href:"#_181-超过经理收入的员工","aria-label":'Permalink to "181. 超过经理收入的员工"'},"​")],-1),s("h2",{id:"_183-部门工资最高的员工",tabindex:"-1"},[l("183. 部门工资最高的员工 "),s("a",{class:"header-anchor",href:"#_183-部门工资最高的员工","aria-label":'Permalink to "183. 部门工资最高的员工"'},"​")],-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"输入：")]),l(`
`),s("span",{class:"line"},[s("span",null,"Employee 表:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+--------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id | name  | salary | departmentId |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+--------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | Joe   | 70000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | Jim   | 90000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3  | Henry | 80000  | 2            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 4  | Sam   | 60000  | 2            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 5  | Max   | 90000  | 1            |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+--------+--------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"Department 表:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id | name  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | IT    |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | Sales |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"输出：")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------------+----------+--------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Department | Employee | Salary |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------------+----------+--------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| IT         | Jim      | 90000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Sales      | Henry    | 80000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| IT         | Max      | 90000  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+------------+----------+--------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"解释：Max 和 Jim 在 IT 部门的工资都是最高的，Henry 在销售部的工资最高。")])])]),s("button",{class:"collapse"})],-1),s("p",null,[l("双字段使用"),s("code",null,"in")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"select d.name as Department, e.name as Employee, e.Salary as Salary")]),l(`
`),s("span",{class:"line"},[s("span",null,"from Employee e , Department d")]),l(`
`),s("span",{class:"line"},[s("span",null,"where e.Departmentid = d.id")]),l(`
`),s("span",{class:"line"},[s("span",null,"and")]),l(`
`),s("span",{class:"line"},[s("span",null,"(e.DepartmentId, Salary)")]),l(`
`),s("span",{class:"line"},[s("span",null,"in")]),l(`
`),s("span",{class:"line"},[s("span",null,"(select Departmentid, max(Salary) from Employee GROUP BY DepartmentId )")])])]),s("button",{class:"collapse"})],-1),s("h2",{id:"_180-连续出现的数字",tabindex:"-1"},[l("180. 连续出现的数字 "),s("a",{class:"header-anchor",href:"#_180-连续出现的数字","aria-label":'Permalink to "180. 连续出现的数字"'},"​")],-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"输入：")]),l(`
`),s("span",{class:"line"},[s("span",null,"Logs 表：")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-----+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| Id | Num |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-----+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | 1   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | 1   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3  | 1   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 4  | 2   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 5  | 1   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 6  | 2   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 7  | 2   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+-----+")]),l(`
`),s("span",{class:"line"},[s("span",null,"输出：")]),l(`
`),s("span",{class:"line"},[s("span",null,"Result 表：")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| ConsecutiveNums |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1               |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+-----------------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"解释：1 是唯一连续出现至少三次的数字。")])])]),s("button",{class:"collapse"})],-1),s("p",null,"对一张表重复关联3次，横向比较。",-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"select distinct l1.num as ConsecutiveNums")]),l(`
`),s("span",{class:"line"},[s("span",null,"from logs l1, logs l2, logs l3")]),l(`
`),s("span",{class:"line"},[s("span",null,"where l1.num = l2.num and l2.num = l3.num and l1.id = l2.id - 1 and l2.id = l3.id - 1")])])]),s("button",{class:"collapse"})],-1),s("h2",{id:"_178-分数排名",tabindex:"-1"},[l("178. 分数排名 "),s("a",{class:"header-anchor",href:"#_178-分数排名","aria-label":'Permalink to "178. 分数排名"'},"​")],-1),s("p",null,[l("MySql8.x 版本以上支持"),s("code",null,"rank()"),l("开窗函数。")],-1),s("p",null,"Oracle 和 SqlServer 也支持，但是没有查具体版本。",-1),s("blockquote",null,[s("p",null,[s("a",{href:"https://blog.csdn.net/u013317445/article/details/100514974",target:"_blank",rel:"noreferrer"},"https://blog.csdn.net/u013317445/article/details/100514974")]),s("p",null,"MySql 之 rank() over(order by)、rank() over(partition by order by)")],-1),s("p",null,"在版本不支持开窗函数的情况下，使用语义分析，**rank **即为前面有多少比自己「大」的数据，根据排名规则（如并列排名，顺序排名等）进行去重等操作，一样可以实现添加排名的功能。",-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"select a.Score as Score,")]),l(`
`),s("span",{class:"line"},[s("span",null,"(select count(distinct b.Score) from Scores b where b.Score >= a.Score) as Rank")]),l(`
`),s("span",{class:"line"},[s("span",null,"from Scores a")]),l(`
`),s("span",{class:"line"},[s("span",null,"order by a.Score DESC")])])]),s("button",{class:"collapse"})],-1),s("h2",{id:"_626-换座位",tabindex:"-1"},[l("626. 换座位 "),s("a",{class:"header-anchor",href:"#_626-换座位","aria-label":'Permalink to "626. 换座位"'},"​")],-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"输入:")]),l(`
`),s("span",{class:"line"},[s("span",null,"Seat 表:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id | student |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | Abbot   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | Doris   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3  | Emerson |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 4  | Green   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 5  | Jeames  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"输出:")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| id | student |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 1  | Doris   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 2  | Abbot   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 3  | Green   |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 4  | Emerson |")]),l(`
`),s("span",{class:"line"},[s("span",null,"| 5  | Jeames  |")]),l(`
`),s("span",{class:"line"},[s("span",null,"+----+---------+")]),l(`
`),s("span",{class:"line"},[s("span",null,"解释:")]),l(`
`),s("span",{class:"line"},[s("span",null,"请注意，如果学生人数为奇数，则不需要更换最后一名学生的座位。")])])]),s("button",{class:"collapse"})],-1),s("p",null,"解法一：",-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"select (")]),l(`
`),s("span",{class:"line"},[s("span",null,"    case")]),l(`
`),s("span",{class:"line"},[s("span",null,"        when mod(id, 2) = 1 and id != counts.counts then id + 1")]),l(`
`),s("span",{class:"line"},[s("span",null,"        when mod(id, 2) = 1 and id = counts.counts then id")]),l(`
`),s("span",{class:"line"},[s("span",null,"        else id - 1")]),l(`
`),s("span",{class:"line"},[s("span",null,"        end) as id, student")]),l(`
`),s("span",{class:"line"},[s("span",null,"from seat,")]),l(`
`),s("span",{class:"line"},[s("span",null,"    (select count(1) as counts")]),l(`
`),s("span",{class:"line"},[s("span",null,"    from seat) counts")]),l(`
`),s("span",{class:"line"},[s("span",null,"order by id asc")])])]),s("button",{class:"collapse"})],-1),s("p",null,"解法二：",-1),s("div",{class:"language-mysql vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"mysql"),s("pre",{class:"shiki shiki-themes material-theme-lighter material-theme-darker vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"select s1.id, coalesce(s2.student, s1.student) as student")]),l(`
`),s("span",{class:"line"},[s("span",null,"from seat s1")]),l(`
`),s("span",{class:"line"},[s("span",null,"left join seat s2")]),l(`
`),s("span",{class:"line"},[s("span",null,"on (s1.id+1)^1-1 = s2.id")])])]),s("button",{class:"collapse"})],-1),s("p",null,"位运算实现相邻两数互换位置。",-1)])),"main-header":a(()=>[i(n.$slots,"main-header")]),"main-header-after":a(()=>[i(n.$slots,"main-header-after")]),"main-nav":a(()=>[i(n.$slots,"main-nav")]),"main-content-before":a(()=>[i(n.$slots,"main-content-before")]),"main-content":a(()=>[i(n.$slots,"main-content")]),"main-content-after":a(()=>[i(n.$slots,"main-content-after")]),"main-nav-before":a(()=>[i(n.$slots,"main-nav-before")]),"main-nav-after":a(()=>[i(n.$slots,"main-nav-after")]),comment:a(()=>[i(n.$slots,"comment")]),footer:a(()=>[i(n.$slots,"footer")]),aside:a(()=>[i(n.$slots,"aside")]),"aside-custom":a(()=>[i(n.$slots,"aside-custom")]),default:a(()=>[i(n.$slots,"default")]),_:3},8,["frontmatter"])}}};export{x as default,v as usePageData};
