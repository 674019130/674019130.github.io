// @ts-check
export {};
const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#field'));
const pause = /** @type {HTMLButtonElement} */ (document.querySelector('#pause'));
const status = /** @type {HTMLElement} */ (document.querySelector('#status'));
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
const palettes = [[.77,.38,.9,1,.42,.65], [.24,.7,.73,.48,.57,.97], [.96,.58,.25,.93,.36,.49]];
let palette = 0, paused = false, visible = true, elapsed = 6, previous = 0, frame = 0, lost = false;
let pointer = [.5,.5], target = [.5,.5];
const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
const vertex = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fragment = `precision highp float;
uniform vec2 resolution, pointer; uniform float time; uniform vec3 colorA, colorB;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+7.4;a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/resolution; vec2 p=(uv-.5)*vec2(2.5,1.8);
p+=(pointer-.5)*.13; float t=time*.13;
vec2 q=vec2(fbm(p*1.9+vec2(t,-t*.5)),fbm(p*1.9+vec2(4.3,-t*.6)));
vec2 r=vec2(fbm(p*2.+q*2.4+vec2(t*.4,3.1)),fbm(p*2.+q*2.4+vec2(7.2,-t*.3)));
float n=fbm(p*2.6+r*3.); float curve=p.y+.23*sin(p.x*3.8+t)+.36*(q.x-.5);
float body=exp(-curve*curve*15.)*exp(-p.x*p.x*1.25);
float folds=.35+.65*smoothstep(.25,.77,n);
float ribbon=exp(-pow((curve+.13*(n-.5))/.09,2.))*.13;
float alpha=(body*folds*.58+ribbon)*smoothstep(0.,.18,uv.x)*smoothstep(0.,.18,1.-uv.x)*smoothstep(0.,.16,uv.y)*smoothstep(0.,.16,1.-uv.y);
vec3 color=mix(colorA,colorB,smoothstep(-.8,.8,p.x+(r.y-.5)*1.3));
float grain=(hash(gl_FragCoord.xy)-.5)*.018;
gl_FragColor=vec4(color+grain,alpha);
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
 pause.textContent=paused?'Resume':'Pause';pause.setAttribute('aria-pressed',String(paused));
 status.textContent=!ready || lost?'Still color preview.':fixed?'Still color — reduced motion.':paused?'Color paused.':'Move your pointer gently through the color.';
 if(ready && !lost && !isStill() && visible && !document.hidden)frame=requestAnimationFrame(loop);
}
pause.addEventListener('click',()=>{paused=!paused;schedule();});
document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{
 palette=Number(/** @type {HTMLElement} */(button).dataset.palette);
 document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const c=palettes[palette];if (!ready || lost) canvas.parentElement.style.background=`radial-gradient(ellipse at 40% 50%, rgba(${c.slice(0,3).map(v=>Math.round(v*255)).join(',')},.22), transparent 55%)`;
 draw();
}));
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
