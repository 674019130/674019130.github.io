// @ts-check
/** @param {number} count */
export function createParticles(count=2600){return Array.from({length:count},(_,i)=>{const x=(i*.61803398875%1),y=(i*.754877666%1);return {x,y,bx:x,by:y,vx:0,vy:0};});}
/** @param {ReturnType<typeof createParticles>} points @param {number[]} pointer @param {number} strength */
export function stepParticles(points,pointer,strength){
 for(const p of points){const dx=p.bx-pointer[0],dy=(p.by-pointer[1])*.48,d=Math.hypot(dx,dy),influence=Math.exp(-d*d/ .07)*strength,a=Math.atan2(dy,dx)+influence*1.5;
 const r=d+( .15-d)*influence*.8;
 const tx=pointer[0]+Math.cos(a)*r,ty=pointer[1]+Math.sin(a)*r/.48;
 p.vx=(p.vx+(tx-p.x)*.065)*.78;p.vy=(p.vy+(ty-p.y)*.065)*.78;p.x+=p.vx;p.y+=p.vy;
 }
}
/** @param {number} x @param {number} y @param {number} mode */
export function heightAt(x,y,mode){
 if(mode===1)return Math.sin(x*12+y*3)*.55+Math.sin(y*9-x*3)*.24+Math.cos(x*23+y*7)*.12;
 if(mode===2)return Math.sin(Math.hypot(x-.52,(y-.5)*.7)*29)*.52+Math.sin(x*8+y*5)*.16;
 return Math.sin(x*9+y*2)*.42+Math.cos(y*10-x*3)*.34+Math.sin(x*17+y*14)*.15;
}
/** Linear interpolation of a contour's crossing of an edge.
 * @param {number} a @param {number} b @param {number} level */
export function crossing(a,b,level){return a===b?.5:Math.max(0,Math.min(1,(level-a)/(b-a)));}
