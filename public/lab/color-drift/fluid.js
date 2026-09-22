// @ts-check
// A small incompressible 2D velocity field with semi-Lagrangian dye advection.
export class Fluid {
 constructor(w=160,h=100){
  this.w=w;this.h=h;this.n=w*h;
  this.u=new Float32Array(this.n);this.v=new Float32Array(this.n);
  this.r=new Float32Array(this.n);this.g=new Float32Array(this.n);this.b=new Float32Array(this.n);
  this.tmp=new Float32Array(this.n);this.tmp2=new Float32Array(this.n);
  this.pressure=new Float32Array(this.n);this.div=new Float32Array(this.n);this.curl=new Float32Array(this.n);
 }
 /** @param {Float32Array} a @param {number} x @param {number} y */
 sample(a,x,y){x=Math.max(.5,Math.min(this.w-1.5,x));y=Math.max(.5,Math.min(this.h-1.5,y));const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,i=iy*this.w+ix;return (a[i]*(1-fx)+a[i+1]*fx)*(1-fy)+(a[i+this.w]*(1-fx)+a[i+this.w+1]*fx)*fy;}
 /** @param {number} x @param {number} y @param {number} dx @param {number} dy @param {number[]} color */
 splat(x,y,dx,dy,color){
  x*=this.w;y*=this.h;const radius=4;
  for(let yy=Math.max(1,Math.floor(y-radius*3));yy<Math.min(this.h-1,y+radius*3);yy++)for(let xx=Math.max(1,Math.floor(x-radius*3));xx<Math.min(this.w-1,x+radius*3);xx++){
   const i=yy*this.w+xx,k=Math.exp(-((xx-x)**2+(yy-y)**2)/(radius*radius));
   this.u[i]+=Math.max(-7,Math.min(7,dx*this.w))*k;this.v[i]+=Math.max(-7,Math.min(7,dy*this.h))*k;
   this.r[i]=Math.min(2,this.r[i]+color[0]*k*.65);this.g[i]=Math.min(2,this.g[i]+color[1]*k*.65);this.b[i]=Math.min(2,this.b[i]+color[2]*k*.65);
  }
 }
 step(){
  const {w,h,n,u,v,tmp,tmp2,pressure,div,curl}=this;
  // Preserve small eddies as the pointer pushes through the dye.
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;curl[i]=.5*(v[i+1]-v[i-1]-u[i+w]+u[i-w]);}
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const i=y*w+x;let gx=Math.abs(curl[i+1])-Math.abs(curl[i-1]),gy=Math.abs(curl[i+w])-Math.abs(curl[i-w]);const len=Math.hypot(gx,gy)+.0001;gx/=len;gy/=len;u[i]+=gy*curl[i]*.17;v[i]-=gx*curl[i]*.17;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;tmp[i]=this.sample(u,x-u[i],y-v[i])*.99;tmp2[i]=this.sample(v,x-u[i],y-v[i])*.99;}
  u.set(tmp);v.set(tmp2);pressure.fill(0);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;div[i]=-.5*(u[i+1]-u[i-1]+v[i+w]-v[i-w]);}
  for(let k=0;k<14;k++)for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;pressure[i]=(div[i]+pressure[i-1]+pressure[i+1]+pressure[i-w]+pressure[i+w])*.25;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;u[i]-=.5*(pressure[i+1]-pressure[i-1]);v[i]-=.5*(pressure[i+w]-pressure[i-w]);}
  for(const a of [this.r,this.g,this.b]){
   for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;tmp[i]=this.sample(a,x-u[i],y-v[i])*.981;}
   a.set(tmp);
  }
  for(let i=0;i<n;i++){if(!Number.isFinite(u[i]))u[i]=0;if(!Number.isFinite(v[i]))v[i]=0;}
 }
 clear(){for(const a of [this.u,this.v,this.r,this.g,this.b,this.tmp,this.tmp2,this.pressure,this.div,this.curl])a.fill(0);}
 energy(){let e=0;for(let i=0;i<this.n;i++)e+=this.r[i]+this.g[i]+this.b[i];return e;}
}
