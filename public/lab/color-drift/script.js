// @ts-check
import { Fluid } from './fluid.js';
const canvas=/** @type {HTMLCanvasElement} */(document.querySelector('#field'));
const stage=/** @type {HTMLElement} */(document.querySelector('.composition'));
const pause=/** @type {HTMLButtonElement} */(document.querySelector('#pause'));
const status=/** @type {HTMLElement} */(document.querySelector('#status'));
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const params=new URLSearchParams(location.search);
const fluid=new Fluid(180,110);
const context=canvas.getContext('2d');
canvas.width=fluid.w;canvas.height=fluid.h;
const pixels=context?.createImageData(fluid.w,fluid.h);
const palettes=[[.8,.08,.48],[.05,.45,.6],[.85,.32,.08]];
let palette=0,paused=false,visible=true,frame=0,lastTime=0,phase=0;
/** @type {number[]|null} */let previous=null;
const still=()=>motion.matches || params.get('still')==='1';
function paint(){
 if(!context || !pixels)return;
 for(let i=0;i<fluid.n;i++){
  const r=fluid.r[i],g=fluid.g[i],b=fluid.b[i],strength=Math.max(r,g,b);
  pixels.data[i*4]=255*r/(strength||1);pixels.data[i*4+1]=255*g/(strength||1);pixels.data[i*4+2]=255*b/(strength||1);pixels.data[i*4+3]=255*(1-Math.exp(-strength*1.5));
 }context.putImageData(pixels,0,0);
}
function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
/** @param {number} now */
function loop(now){
 frame=0;
 if(!lastTime || now-lastTime>=32){fluid.step();paint();lastTime=now;}
 if(!paused && !still() && visible && !document.hidden && fluid.energy()>.03)frame=requestAnimationFrame(loop);else lastTime=0;
}
function start(){if(!frame && !paused && !still() && visible && !document.hidden && context)frame=requestAnimationFrame(loop);}
function sync(){
 stop();pause.disabled=still() || !context;pause.textContent=paused?'Resume':'Pause';pause.setAttribute('aria-pressed',String(paused));
 status.textContent=!context?'Canvas unavailable.':still()?'Still mode: gestures leave a static trace.':paused?'Paused. Resume to stir the color.':'Move your pointer through the canvas, or drag with a finger.';
 start();
}
/** @param {PointerEvent} event */
function input(event){
 if(paused || !context)return;
 if(event.pointerType==='touch' && !stage.hasPointerCapture(event.pointerId))return;
 const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
 if(x<0 || x>1 || y<0 || y>1){previous=null;return;}
 const dx=previous?x-previous[0]:0,dy=previous?y-previous[1]:0;
 const steps=Math.min(16,Math.max(1,Math.ceil(Math.hypot(dx*fluid.w,dy*fluid.h)/2)));
 phase+=Math.hypot(dx,dy)*3;
 const base=palettes[palette],mix=.5+.5*Math.sin(phase);
 const color=palette===0?[base[0]-.3*mix,base[1]+.06*mix,base[2]+.35*mix]:base;
 for(let i=1;i<=steps;i++)fluid.splat(x-dx*(1-i/steps),y-dy*(1-i/steps),dx*1.5/steps,dy*1.5/steps,color);
 previous=[x,y];paint();start();
}
stage.addEventListener('pointermove',input);
stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){stage.setPointerCapture(event.pointerId);previous=null;}input(event);});
function leave(){previous=null;}
stage.addEventListener('pointerleave',leave);stage.addEventListener('pointercancel',leave);stage.addEventListener('lostpointercapture',leave);stage.addEventListener('pointerup',event=>{if(event.pointerType==='touch'){if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);leave();}});
pause.addEventListener('click',()=>{paused=!paused;previous=null;sync();});
document.querySelector('#clear')?.addEventListener('click',()=>{stop();fluid.clear();previous=null;paint();});
document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{palette=Number(/** @type {HTMLElement} */(button).dataset.palette);document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
motion.addEventListener('change',()=>{previous=null;sync();});
document.addEventListener('visibilitychange',()=>{previous=null;sync();});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(stage);
window.addEventListener('pagehide',stop);window.addEventListener('pageshow',sync);
// An honest static gesture sample in the Lab thumbnail; the full page starts empty.
if(params.get('preview')==='1'){for(let i=0;i<45;i++){const x=.24+i*.012,y=.5+Math.sin(i*.12)*.13;fluid.splat(x,y,.009,Math.cos(i*.12)*.012,palettes[0]);fluid.step();}paint();}
sync();
