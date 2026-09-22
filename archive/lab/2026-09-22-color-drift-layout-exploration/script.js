// @ts-check
export {};
const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#field'));
const pause = /** @type {HTMLButtonElement} */ (document.querySelector('#pause'));
const status = /** @type {HTMLElement} */ (document.querySelector('#status'));
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
const palettes = [[.77,.38,.9,1,.42,.65], [.24,.7,.73,.48,.57,.97], [.96,.58,.25,.93,.36,.49]];
let palette = 0, paused = false, visible = true, elapsed = 3, previous = 0, frame = 0, lost = false;
let pointer = [.5,.5], target = [.5,.5];
const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
const vertex = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fragment = `precision highp float;
uniform vec2 resolution, pointer; uniform float time; uniform vec3 colorA, colorB;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+7.4;a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/resolution;
vec2 p=(uv-.5)*vec2(2.3,1.65);p+=(pointer-.5)*.055;
float t=time*.32;
// Backward-warp the field around two moving vortices. Shape evolves, not just texture.
vec2 c1=vec2(-.3+.13*sin(t*.7),-.08+.13*cos(t*.6));
vec2 c2=vec2(.38+.14*cos(t*.5),.16*sin(t*.8));
vec2 d=p-c1;float a=2.0*sin(t*.65+.8)*exp(-dot(d,d)*2.6);
p=c1+mat2(cos(a),-sin(a),sin(a),cos(a))*d;
d=p-c2;a=-1.8*cos(t*.52)*exp(-dot(d,d)*3.2);
p=c2+mat2(cos(a),-sin(a),sin(a),cos(a))*d;
vec2 q=vec2(fbm(p*2.3+vec2(t*.2,-t*.18)),fbm(p*2.3+vec2(5.,t*.16)))-.5;
p+=q*.38;
float arc=p.y-.06-.27*sin(p.x*3.5+t*.6)+.055*fbm(p*9.+t*.15);
float width=.16+.065*sin(t*.8+p.x*4.);
float core=exp(-pow(arc/width,2.))*exp(-pow((p.x-.12)/.68,4.));
float veil=exp(-pow(arc/(width*2.6),2.))*exp(-p.x*p.x*1.9);
float detail=fbm(p*6.+vec2(t*.2,0.));
float filaments=.5+.5*sin(arc*46.+detail*5.);
float density=core*(.47+.25*detail)+veil*(.12+.14*filaments);
float edges=smoothstep(0.,.13,uv.x)*smoothstep(0.,.12,1.-uv.x)*smoothstep(0.,.12,uv.y)*smoothstep(0.,.12,1.-uv.y);
vec3 color=mix(vec3(.71,.35,.92),vec3(1.,.24,.63),smoothstep(-.6,.5,p.x+.22*sin(t)));
float grain=(hash(gl_FragCoord.xy)-.5)*.015;
gl_FragColor=vec4(color+grain,clamp(density*edges,0.,.86));
}`;
/** @type {WebGLProgram|null} */ let program = null;
/** @param {number} type @param {string} source */
function shader(type, source) {
 if (!gl) throw Error('WebGL unavailable');
 const s=gl.createShader(type); if (!s) throw Error('Shader unavailable');
 gl.shaderSource(s,source);gl.compileShader(s);
 if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw Error('Shader compilation failed');
 return s;
}
function init(){
 if (!gl) return false;
 try {
 program=gl.createProgram(); if (!program) return false;
 gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
 if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return false;
 gl.useProgram(program); const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const position=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 canvas.parentElement.style.background='';canvas.parentElement.dataset.ready='true'; return true;
 } catch { return false; }
}
let ready=init();
function isStill(){return paused || motion.matches || params.get('still')==='1';}
function draw(){
 if (!gl || !program || !ready || lost) return;
 const rect=canvas.getBoundingClientRect(), scale=Math.min(devicePixelRatio,1.5);
 const width=Math.max(1,Math.round(rect.width*scale)),height=Math.max(1,Math.round(rect.height*scale));
 if(canvas.width!==width || canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
 gl.uniform2f(gl.getUniformLocation(program,'resolution'),width,height);
 gl.uniform2f(gl.getUniformLocation(program,'pointer'),pointer[0],pointer[1]);
 gl.uniform1f(gl.getUniformLocation(program,'time'),elapsed);
 gl.uniform3fv(gl.getUniformLocation(program,'colorA'),palettes[palette].slice(0,3));
 gl.uniform3fv(gl.getUniformLocation(program,'colorB'),palettes[palette].slice(3));gl.drawArrays(gl.TRIANGLES,0,6);
}
/** @param {number} now */
function loop(now){
 frame=0;
 if (previous && now-previous<32){frame=requestAnimationFrame(loop);return;}
 if(previous) elapsed+=Math.min((now-previous)/1000,.1);
 previous=now;pointer=pointer.map((v,i)=>v+(target[i]-v)*.045);draw();
 if(!isStill() && visible && !document.hidden && ready && !lost)frame=requestAnimationFrame(loop);
}
function schedule(){
 cancelAnimationFrame(frame);frame=0;previous=0;draw();
 const fixed=motion.matches || params.get('still')==='1';pause.disabled=!ready || fixed;
 pause.textContent=paused?'Resume motion':'Pause motion';
 document.documentElement.dataset.motionPaused=String(isStill() || document.hidden);pause.setAttribute('aria-pressed',String(paused));
 status.textContent=!ready || lost?'Still color preview.':fixed?'Still color — reduced motion.':paused?'Color paused.':'Motion is on.';
 if(ready && !lost && !isStill() && visible && !document.hidden)frame=requestAnimationFrame(loop);
}
pause.addEventListener('click',()=>{paused=!paused;schedule();});
const stage=/** @type {HTMLElement} */(document.querySelector('.composition'));
stage.addEventListener('pointermove',e=>{if(isStill())return;const r=stage.getBoundingClientRect();target=[(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height];});
stage.addEventListener('pointerleave',()=>{target=[.5,.5];});
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});observer.observe(stage);
const resize=new ResizeObserver(()=>draw());resize.observe(canvas);
motion.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;canvas.parentElement.dataset.ready='false';schedule();});
canvas.addEventListener('webglcontextrestored',()=>{lost=false;ready=init();schedule();});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);previous=0;});
window.addEventListener('pageshow',schedule);schedule();

// Original deterministic point fields and contour paths, rendered as accessible decoration.
const svgNS='http://www.w3.org/2000/svg';
const particles=document.querySelector('#particles');
if(particles){
 for(let group=0;group<3;group++){
  const g=document.createElementNS(svgNS,'g');
  for(let ring=0;ring<15;ring++)for(let j=0;j<64;j++){
   const angle=j/64*Math.PI*2+ring*.047, r=43+ring*3.4;
   const spread=group===0?1:group===1?1.45:1.8;
   const jitter=Math.sin(j*37.4+ring*12.7);
   const x=140+group*300+Math.cos(angle)*r*spread+jitter*group*9;
   const y=125+Math.sin(angle)*r*.8+Math.sin(angle*3+ring*.3)*group*7;
   const dot=document.createElementNS(svgNS,'circle');
   dot.setAttribute('cx',String(x));dot.setAttribute('cy',String(y));dot.setAttribute('r',group===0?'.72':'.55');
   dot.setAttribute('fill',group===0?'#b26b9f':'#b4a9b6');dot.setAttribute('opacity',String((.2+.45*(1-ring/15))/(1+group*.55)));g.append(dot);
  } particles.append(g);
 }
}
const contours=document.querySelector('#contours');
if(contours){for(let ring=0;ring<13;ring++){
 let d='';for(let j=0;j<=180;j++){
 const a=j/180*Math.PI*2, r=25+ring*15+9*Math.sin(a*3+ring*.3)+7*Math.cos(a*5-ring*.16);
 const x=235+Math.cos(a)*r*1.2,y=130+Math.sin(a)*r*.8;
 d+=(j?'L':'M')+x.toFixed(2)+','+y.toFixed(2);
 }const path=document.createElementNS(svgNS,'path');path.setAttribute('d',d+'Z');path.setAttribute('fill','none');path.setAttribute('stroke','#c2a3c3');path.setAttribute('stroke-width','.6');path.setAttribute('opacity','.45');contours.append(path);
}}
