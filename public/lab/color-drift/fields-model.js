// @ts-check
/** @param {number} count */
export function createParticles(count=5200){return Array.from({length:count},(_,i)=>{const x=i*.61803398875%1,y=i*.754877666%1;return {x,y,bx:x,by:y,vx:0,vy:0,px:x,py:y};});}
/** A continuously folded polar surface; springs preserve gesture history.
 * @param {ReturnType<typeof createParticles>} points @param {number[]} pointer @param {number} strength
 * @param {number} time @param {number} speed @param {number} aspect */
export function stepParticles(points,pointer,strength,time=0,speed=0,aspect=.48){
 for(const p of points){
 const dx=p.bx-pointer[0],dy=(p.by-pointer[1])*aspect,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
 const influence=Math.exp(-d*d/.11)*strength;
 const turn=a+influence*(2.3+Math.sin(time*.65+d*16)*.7)+time*.18*influence;
 const radius=.105+speed*.22+.025*Math.sin(time*1.4+a*2)+.027*Math.sin(a*3-time*.8+d*19);
 const r=d+(radius-d)*influence*.96;
 const fold=Math.sin(a*2+time*.9+d*11)*.032*influence;
 const tx=p.bx+(pointer[0]+Math.cos(turn)*r+fold-p.bx)*strength;
 const ty=p.by+(pointer[1]+(Math.sin(turn)*r*.83+fold*.6)/aspect-p.by)*strength;
 p.px=p.x;p.py=p.y;
 p.vx=(p.vx+(tx-p.x)*.035)*.86;p.vy=(p.vy+(ty-p.y)*.035)*.86;p.x+=p.vx;p.y+=p.vy;
 }
}
/** Smooth deterministic value noise. @param {number} x @param {number} y */
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*fx*(fx*(fx*6-15)+10),v=fy*fy*fy*(fy*(fy*6-15)+10);
 const hash=(a,b)=>{const h=Math.sin(a*127.1+b*311.7)*43758.5453;return (h-Math.floor(h))*2-1;};
 const a=hash(ix,iy),b=hash(ix+1,iy),c=hash(ix,iy+1),d=hash(ix+1,iy+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
/** @param {number} x @param {number} y @param {number} mode @param {number} time */
export function heightAt(x,y,mode,time=0){
 const dx=x*4.8+mode*8+time*.025,dy=y*3.5+mode*5;
 const warp=noise(dx*.7+8,dy*.7+time*.04);
 const n=noise(dx+warp*.75,dy+warp*.65)+noise(dx*2.2+3,dy*2.2-7)*.28+noise(dx*4.4,dy*4.4)*.07;
 if(mode===1)return n*.65+Math.sin(dx*2.3+warp*2)*.25;
 if(mode===2)return n*.55+Math.sin(Math.hypot(x-.5,(y-.5)*.7)*19+warp*2-time*.15)*.25;
 return n;
}
/** @param {number} a @param {number} b @param {number} level */
export function crossing(a,b,level){return a===b?.5:Math.max(0,Math.min(1,(level-a)/(b-a)));}
