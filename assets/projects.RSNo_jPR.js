import{T as P,u as C,l as B,e as S,f as T}from"./app.CIAkCWmS.js";import{_ as V}from"./YunComment.vue_vue_type_style_index_0_lang.Do970eH_.js";import{_ as H}from"./YunSponsor.vue_vue_type_style_index_0_lang.Bf60CKLO.js";import{M as h,u as n,aK as t,av as Y,v as s,at as w,aS as L,q as v,t as _,b9 as j,F as p,aV as $,s as b,aW as I,aQ as F,bi as k,I as g,bH as x,H as M}from"./framework.DDojlQDl.js";import{u as N}from"./chunks/@vueuse/motion.B7tSKkoB.js";import{c as R}from"./index.BRXJGymZ.js";import"./chunks/dayjs.DPscOGnl.js";import{u as z}from"./chunks/vue-i18n.D5iU1Uln.js";import"./chunks/vue-router.CAdTcK3X.js";import"./chunks/pinia.DkkyVvQY.js";import"./chunks/nprogress.DgNGesC2.js";import"./index.C5okkQwF.js";const D=["href"],U=h({__name:"YunProjectLinkItem",props:{item:{}},setup(f){return(e,l)=>(t(),n("a",{class:"yun-project-link-item inline-flex items-center justify-center flex-1 p-2 h-full text-white",href:e.item.url,target:"_blank",style:Y({"--c-brand":e.item.color})},[s("div",{class:w(e.item.icon)},null,2)],12,D))}}),W={key:0,class:"mt-4"},q=["href"],E={text:"lg",font:"bold",m:"2"},J=["innerHTML"],K={flex:"~ center",class:"absolute left-0 right-0 bottom-0 h-10"},Q=h({__name:"YunProjectCard",props:{i:{},project:{}},setup(f){const e=f,l=L();N(l,{initial:{opacity:0,y:50},enter:{opacity:1,y:0,transition:{delay:e.i*50,type:"spring",ease:R.easeIn,damping:8,duration:400}}});const u=v(()=>{const o={color:e.project.textColor};if(e.project.color&&(typeof e.project.gradient>"u"||e.project.gradient)){const c=new P(e.project.color);o["--un-gradient-stops"]=`${c.spin(55).toHexString()}, ${e.project.color}`,o.color||(o.color=c.isDark()?"white":"black")}else o.backgroundColor=e.project.color||"rgba(255,255,255,0.9)",o.color||(o.color="black");return o}),r=v(()=>e.project.github?`https://github.com/${e.project.github}`:`https://github.com/YunYouJun/${e.project.name}`),m=v(()=>e.project.npm?`https://www.npmjs.com/package/${e.project.npm}`:""),a=v(()=>e.project.url||r.value),d=v(()=>[{url:a.value,icon:"i-ri-global-line",color:"#6eb7f9"},{url:e.project.docs,icon:"i-ri-book-line",color:"#443ed1"},{url:r.value,icon:"i-ri-github-line",color:"black"},{url:m.value,icon:"i-ri-npmjs-line",color:"red"}]);return(o,c)=>{const i=U;return t(),n("div",{ref_key:"cardRef",ref:l,flex:"~ col center",class:"m-2 w-90 transform rounded shadow-md grayscale-30",bg:"opacity-80 gradient-to-br",p:"x-2 b-12",hover:"shadow-lg grayscale-0",style:Y(u.value)},[o.project.emoji?(t(),n("div",W,j(o.project.emoji),1)):_("v-if",!0),s("a",{href:a.value,target:"_blank",class:"text-unset"},[s("h2",E,j(o.project.name||"忘记叫啥了"),1)],8,q),s("small",{class:"block",p:"2",text:"center",innerHTML:o.project.desc||"说点什么好呢"},null,8,J),s("div",K,[(t(!0),n(p,null,$(d.value,y=>(t(),n(p,{key:y.icon},[y.url?(t(),b(i,{key:0,item:y},null,8,["item"])):_("v-if",!0)],64))),128))])],4)}}}),A={class:"w-full flex justify-center",text:"xl",font:"black",m:"b-2 t-4"},G=h({__name:"YunProjectCollection",props:{title:{},projects:{}},setup(f){return(e,l)=>{const u=Q;return t(),n(p,null,[s("div",A,j(e.title),1),(t(!0),n(p,null,$(e.projects,(r,m)=>(t(),b(u,{key:m,project:r,i:m},null,8,["project","i"]))),128))],64)}}}),O=h({__name:"YunProjectToggleButton",props:{active:{type:Boolean}},setup(f){return(e,l)=>(t(),n("button",{class:w(["bg-white-90 m-2 inline-flex items-center justify-center rounded px-2 gap-2 h-8",{"bg-blue-500 text-white":e.active,"hover:bg-$va-c-bg-soft":!e.active}])},[I(e.$slots,"default")],2))}}),X={flex:"~ col center"},Z={class:"mb-3 text-2xl"},ee={flex:"~ wrap",justify:"center"},te={class:"inline-flex"},oe={class:"inline-flex"},ne={flex:"~ wrap",justify:"center"},re=h({__name:"YunProjects",setup(f){const e=C(),{t:l}=z(),u=F(e.value.projects),r=L("all");return(m,a)=>{const d=O,o=G;return t(),n("div",X,[s("h2",Z,j(k(e).title||k(l)("title.projects")),1),s("div",ee,[g(d,{active:r.value==="all",onClick:a[0]||(a[0]=c=>r.value="all")},{default:x(()=>a[1]||(a[1]=[M(" 全部 ")])),_:1},8,["active"]),(t(!0),n(p,null,$(u,(c,i)=>(t(),b(d,{key:i,active:i===r.value,onClick:y=>r.value=i},{default:x(()=>[s("span",te,j(c.emoji),1),s("span",oe,j(c.title),1)]),_:2},1032,["active","onClick"]))),128))]),s("div",ne,[(t(!0),n(p,null,$(u,(c,i)=>(t(),n(p,{key:i},[r.value==="all"||r.value===i?(t(),b(o,{key:0,title:c.title,projects:u[i].collection},null,8,["title","projects"])):_("v-if",!0)],64))),128))])])}}}),se={flex:"~ col"},ve=h({__name:"projects",setup(f){const e=B(),l=C();return(u,r)=>{const m=re,a=H,d=V,o=S,c=T;return t(),n(p,null,[g(o,null,{default:x(()=>[s("div",se,[g(m),_(" <YunLayoutLeft /> "),_(" <RouterView /> "),_(" <YunLayoutRight /> "),g(a,{class:"mt-4"}),k(e).comment.enable&&k(l).comment!==!1?(t(),b(d,{key:0,class:"max-w-4xl m-auto"})):_("v-if",!0)])]),_:1}),g(c)],64)}}});export{ve as default};
