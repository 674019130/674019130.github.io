// @ts-check
import {createParticles,stepParticles,heightAt,crossing} from './fields-model.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const still=()=>reduced.matches || new URLSearchParams(location.search).get('still')==='1';
/** @param {'particles'|'contours'} kind @param {string} selector */
function mount(kind,selector){
 const canvas=/** @type {HTMLCanvasElement} */(document.querySelector(selector));
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const button=/** @type {HTMLButtonElement} */(document.querySelector(`[data-study-pause="${kind}"]`));
 const points=createParticles();let pointer=[.5,.5],active=false,strength=0,paused=false,visible=false,frame=0,last=0,mode=0,blend=0,oldMode=0;
 function size(){const r=canvas.getBoundingClientRect();const scale=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(r.width*scale);canvas.height=Math.round(r.height*scale);ctx.setTransform(scale,0,0,scale,0,0);return [r.width,r.height];}
 let dimensions=size();
 function draw(){
 const [w,h]=dimensions;ctx.clearRect(0,0,w,h);
 if(kind==='particles'){
 for(const p of points){const d=Math.hypot(p.x-pointer[0],(p.y-pointer[1])*.48),ink=strength*Math.exp(-d*d/.055);ctx.fillStyle=`rgba(${Math.round(151-35*ink)},${Math.round(142-62*ink)},${Math.round(156-20*ink)},${.25+ink*.45})`;ctx.beginPath();ctx.arc(p.x*w,p.y*h,.55+ink*.3,0,Math.PI*2);ctx.fill();}
 if(active){ctx.strokeStyle='#a58baf';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(pointer[0]*w-4,pointer[1]*h);ctx.lineTo(pointer[0]*w+4,pointer[1]*h);ctx.moveTo(pointer[0]*w,pointer[1]*h-4);ctx.lineTo(pointer[0]*w,pointer[1]*h+4);ctx.stroke();}
 }else{
 const nx=90,ny=45,grid=new Float32Array((nx+1)*(ny+1));
 for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){const px=x/nx,py=y/ny;grid[y*(nx+1)+x]=heightAt(px,py,oldMode)*(1-blend)+heightAt(px,py,mode)*blend+strength*.55*Math.exp(-((px-pointer[0])**2+(py-pointer[1])**2)/.026);}
 ctx.lineWidth=.65;ctx.strokeStyle='#b78eae';
 for(let level=-.9;level<1;level+=.12){ctx.beginPath();for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
 const i=y*(nx+1)+x,values=[grid[i],grid[i+1],grid[i+nx+2],grid[i+nx+1]],verts=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]],hits=[];
 for(let edge=0;edge<4;edge++){const next=(edge+1)%4,a=values[edge],b=values[next];if((a<level)!==(b<level)){const t=crossing(a,b,level);hits.push([(verts[edge][0]+(verts[next][0]-verts[edge][0])*t)*w/nx,(verts[edge][1]+(verts[next][1]-verts[edge][1])*t)*h/ny]);}}
 for(let k=0;k+1<hits.length;k+=2){ctx.moveTo(hits[k][0],hits[k][1]);ctx.lineTo(hits[k+1][0],hits[k+1][1]);}
 }ctx.stroke();}
 }
 }
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 /** @param {number} now */
 function loop(now){frame=0;if(!last || now-last>32){last=now;strength+=(Number(active)-strength)*.09;blend=Math.min(1,blend+.055);if(kind==='particles')stepParticles(points,pointer,strength);draw();}if(visible && !paused && !still() && !document.hidden)frame=requestAnimationFrame(loop);}
 function sync(){stop();button.disabled=still();button.textContent=paused?'Resume':'Pause';button.setAttribute('aria-pressed',String(paused));draw();if(visible&&!paused&&!still()&&!document.hidden)frame=requestAnimationFrame(loop);}
 function interact(){if(paused)return;active=true;if(still()){strength=1;blend=1;if(kind==='particles')for(let i=0;i<65;i++)stepParticles(points,pointer,strength);draw();}}
 canvas.addEventListener('pointermove',e=>{if(paused)return;const r=canvas.getBoundingClientRect();pointer=[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];interact();});
 canvas.addEventListener('pointerdown',e=>{if(paused)return;const r=canvas.getBoundingClientRect();pointer=[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];canvas.setPointerCapture(e.pointerId);interact();});
 function release(){active=false;if(still()){strength=0;if(kind==='particles')for(let i=0;i<80;i++)stepParticles(points,pointer,0);draw();}}
 canvas.addEventListener('pointerleave',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('blur',release);canvas.addEventListener('pointerup',e=>{if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(e.pointerType==='touch')release();});
 canvas.addEventListener('focus',interact);
 canvas.addEventListener('keydown',e=>{const keys={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,-.06],ArrowDown:[0,.06]};const d=keys[e.key];if(!d || paused)return;e.preventDefault();pointer=pointer.map((v,i)=>Math.max(.02,Math.min(.98,v+d[i])));interact();});
 button.addEventListener('click',()=>{paused=!paused;sync();});
 if(kind==='contours')document.querySelectorAll('[data-landscape]').forEach(b=>b.addEventListener('click',()=>{oldMode=mode;mode=Number(/** @type {HTMLElement} */(b).dataset.landscape);blend=still()||paused?1:0;document.querySelectorAll('[data-landscape]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#landscape-status').textContent=b.textContent;draw();}));
 new ResizeObserver(()=>{dimensions=size();draw();}).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);window.addEventListener('pagehide',stop);window.addEventListener('pageshow',sync);sync();
}
mount('particles','#particle-canvas');mount('contours','#contour-canvas');
