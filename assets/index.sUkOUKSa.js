import{_ as g}from"./ValaxyMain.vue_vue_type_style_index_0_lang.CjQLfBGS.js";import{u as $}from"./chunks/@vueuse/motion.B7tSKkoB.js";import{o as b}from"./index.BtG5bGVz.js";import{M as k,aS as w,u as f,aK as u,av as I,v as s,b9 as p,F as j,aV as B,s as y,bi as _,bH as n,aW as a,I as L,aM as R}from"./framework.DDojlQDl.js";import{E as Y}from"./app.CIAkCWmS.js";import"./chunks/dayjs.DPscOGnl.js";import{f as z,a as S,u as D}from"./chunks/vue-router.CAdTcK3X.js";import"./YunComment.vue_vue_type_style_index_0_lang.Do970eH_.js";import"./index.C5okkQwF.js";import"./chunks/vue-i18n.D5iU1Uln.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.CUTuRIHR.js";import"./post.C0zJ9ES1.js";import"./animation.5i5Ck-Uc.js";import"./chunks/pinia.DkkyVvQY.js";import"./chunks/nprogress.DgNGesC2.js";const E=["href","title"],M={class:"yun-link-left"},V={class:"yun-link-avatar size-16 overflow-hidden flex-center"},N=["src","alt"],C={class:"yun-link-info",m:"l-2"},F={class:"yun-link-blog",font:"serif black"},O={class:"yun-link-desc"},P=k({__name:"YunLinkItem",props:{i:{},errorImg:{},link:{}},setup(r){const o=r;function l(e){b(e,o.errorImg)}const m=w();return $(m,{initial:{opacity:0,translateY:40},enter:{opacity:1,translateY:0,transition:{type:"spring",duration:400,damping:8,delay:o.i*50}}}),(e,i)=>(u(),f("li",{ref_key:"itemRef",ref:m,class:"yun-link-item inline-flex",style:I({"--primary-color":e.link.color})},[s("a",{class:"yun-link-url",p:"x-4 y-2",href:e.link.url,title:e.link.name,alt:"portrait",rel:"friend",target:"_blank"},[s("div",M,[s("div",V,[s("img",{class:"size-full object-center object-cover m-0! max-w-unset!",loading:"lazy",src:e.link.avatar,alt:e.link.name,onError:l},null,40,N)])]),s("div",C,[s("div",F,p(e.link.blog),1),s("div",O,p(e.link.desc),1)])],8,E)],4))}}),H={class:"yun-links"},J={class:"yun-link-items",flex:"center wrap"},K=k({__name:"YunLinks",props:{links:{},random:{type:Boolean},errorImg:{}},setup(r){const o=r,{data:l}=Y(o.links,o.random);return(m,e)=>{const i=P;return u(),f("div",H,[s("ul",J,[(u(!0),f(j,null,B(_(l),(c,d)=>(u(),y(i,{key:d,i:d,link:c,"error-img":m.errorImg},null,8,["i","link","error-img"]))),128))])])}}}),T=z("/links",async r=>JSON.parse('{"title":"我的小伙伴们","description":"云游的小伙伴们","frontmatter":{"title":"我的小伙伴们","keywords":"链接","description":"云游的小伙伴们","links":"https://www.yunyoujun.cn/friends/links.json","random":true},"headers":[],"relativePath":"pages/links/index.md","lastUpdated":1744783260000}'),{lazy:(r,o)=>r.name===o.name}),ln={__name:"index",setup(r,{expose:o}){var d;const{data:l}=T(),m=D(),e=S(),i=Object.assign(e.meta.frontmatter||{},((d=l.value)==null?void 0:d.frontmatter)||{});e.meta.frontmatter=i,m.currentRoute.value.data=l.value,R("valaxy:frontmatter",i),globalThis.$frontmatter=i;const c={title:"我的小伙伴们",keywords:"链接",description:"云游的小伙伴们",links:"https://www.yunyoujun.cn/friends/links.json",random:!0};return o({frontmatter:c}),(t,U)=>{const h=K,v=g;return u(),y(v,{frontmatter:_(i)},{"main-content-md":n(()=>[L(h,{links:c.links,random:c.random},null,8,["links","random"])]),"main-header":n(()=>[a(t.$slots,"main-header")]),"main-header-after":n(()=>[a(t.$slots,"main-header-after")]),"main-nav":n(()=>[a(t.$slots,"main-nav")]),"main-content-before":n(()=>[a(t.$slots,"main-content-before")]),"main-content":n(()=>[a(t.$slots,"main-content")]),"main-content-after":n(()=>[a(t.$slots,"main-content-after")]),"main-nav-before":n(()=>[a(t.$slots,"main-nav-before")]),"main-nav-after":n(()=>[a(t.$slots,"main-nav-after")]),comment:n(()=>[a(t.$slots,"comment")]),footer:n(()=>[a(t.$slots,"footer")]),aside:n(()=>[a(t.$slots,"aside")]),"aside-custom":n(()=>[a(t.$slots,"aside-custom")]),default:n(()=>[a(t.$slots,"default")]),_:3},8,["frontmatter"])}}};export{ln as default,T as usePageData};
