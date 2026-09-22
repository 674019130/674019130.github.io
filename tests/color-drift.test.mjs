import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/lab/color-drift/script.js',import.meta.url),'utf8').replace('export {};','');
function harness({reduced=false,search='',gpu=true}={}){
 const frames=new Map(),nodes=new Map(),events={},windowEvents={};let id=0,intersection;
 const node=()=>({dataset:{},style:{},listeners:{},parentElement:{dataset:{},style:{}},addEventListener(k,f){this.listeners[k]=f},setAttribute(k,v){this[k]=v},getBoundingClientRect(){return {width:600,height:400,left:0,top:0}}});
 const get=s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)};
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,createShader:()=>({}),createProgram:()=>({})},{get:(o,k)=>o[k]??(()=>{})});
 get('#field').getContext=()=>gpu?gl:null;
 const buttons=[0,1,2].map(i=>{const n=node();n.dataset.palette=String(i);return n});
 const document={hidden:false,querySelector:get,querySelectorAll:()=>buttons,addEventListener(k,f){events[k]=f}};
 const motion={matches:reduced,addEventListener(k,f){this.change=f}};
 vm.runInNewContext(source,{document,location:{search},URLSearchParams,devicePixelRatio:2,matchMedia:()=>motion,Float32Array,IntersectionObserver:class{constructor(f){intersection=f}observe(){}},ResizeObserver:class{observe(){}},window:{addEventListener(k,f){windowEvents[k]=f}},requestAnimationFrame:f=>{frames.set(++id,f);return id},cancelAnimationFrame:i=>frames.delete(i)});
 return {get,buttons,frames,document,events,windowEvents,motion,intersect:v=>intersection([{isIntersecting:v}])};
}
test('color motion preserves pause across visibility, viewport and palette changes',()=>{
 const h=harness();assert.equal(h.frames.size,1);
 h.get('#pause').listeners.click();assert.equal(h.frames.size,0);
 h.buttons[1].listeners.click();assert.equal(h.buttons[1]['aria-pressed'],'true');assert.equal(h.frames.size,0);
 h.document.hidden=true;h.events.visibilitychange();h.document.hidden=false;h.events.visibilitychange();assert.equal(h.frames.size,0);
 h.get('#pause').listeners.click();assert.equal(h.frames.size,1);
 h.intersect(false);assert.equal(h.frames.size,0);h.intersect(true);assert.equal(h.frames.size,1);
 h.windowEvents.pagehide();assert.equal(h.frames.size,0);h.windowEvents.pageshow();assert.equal(h.frames.size,1);
});
test('still previews, reduced motion and unavailable GPU never start a render loop',()=>{
 for(const options of [{reduced:true},{search:'?still=1'},{gpu:false}]){const h=harness(options);assert.equal(h.frames.size,0);assert.equal(h.get('#pause').disabled,true);h.buttons[2].listeners.click();assert.equal(h.frames.size,0);}
});
test('context loss cancels motion and restores with the existing pause preference',()=>{
 const h=harness();h.get('#pause').listeners.click();let prevented=false;
 h.get('#field').listeners.webglcontextlost({preventDefault(){prevented=true}});assert.ok(prevented);assert.equal(h.frames.size,0);
 h.get('#field').listeners.webglcontextrestored();assert.equal(h.frames.size,0);assert.equal(h.get('#pause').textContent,'Resume');
});
