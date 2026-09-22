import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Fluid} from '../public/lab/color-drift/fluid.js';
test('an untouched field stays empty; a gesture adds localized pigment and velocity',()=>{
 const f=new Fluid(50,32);f.step();assert.equal(f.energy(),0);
 f.splat(.5,.5,.08,-.05,[.8,.08,.5]);assert.ok(f.energy()>0);assert.ok(f.u.some(v=>v>0));assert.ok(f.v.some(v=>v<0));assert.equal(f.r[0],0);
});
test('pigment moves after the pointer stops, fades, and stays finite',()=>{
 const f=new Fluid(50,32);f.splat(.4,.5,.04,-.04,[.8,.08,.5]);const before=f.r.slice(),energy=f.energy();
 for(let i=0;i<100;i++)f.step();assert.notDeepEqual(f.r,before);assert.ok(f.energy()<energy*.4);
 for(const a of [f.u,f.v,f.r,f.g,f.b])assert.ok(a.every(Number.isFinite));
});
test('clear removes pigment and momentum; subsequent gestures work again',()=>{
 const f=new Fluid(50,32);f.splat(.4,.5,.1,.1,[.8,.1,.4]);f.step();f.clear();f.step();assert.equal(f.energy(),0);assert.ok(f.u.every(x=>x===0));f.splat(.6,.4,0,0,[.1,.5,.8]);assert.ok(f.energy()>0);
});

import {createParticles,stepParticles,heightAt,crossing} from '../public/lab/color-drift/fields-model.js';
test('particles respond locally and return to their original field after release',()=>{
 const points=createParticles(400);for(let i=0;i<90;i++)stepParticles(points,[.5,.5],1);
 assert.ok(points.some(p=>Math.hypot(p.x-p.bx,p.y-p.by)>.05));
 for(let i=0;i<240;i++)stepParticles(points,[.5,.5],0);
 assert.ok(points.every(p=>Math.hypot(p.x-p.bx,p.y-p.by)<.0001));
});
test('landscapes differ, are deterministic, and contour interpolation stays on the edge',()=>{
 assert.equal(heightAt(.3,.7,0),heightAt(.3,.7,0));assert.notEqual(heightAt(.3,.7,0),heightAt(.3,.7,1));assert.notEqual(heightAt(.3,.7,1),heightAt(.3,.7,2));assert.equal(crossing(-1,1,0),.5);assert.equal(crossing(1,1,1),.5);
});
test('curl field evolves while held, stays finite through fast gestures, and settles on release',()=>{
 const points=createParticles(600);
 for(let i=0;i<180;i++)stepParticles(points,[.5,.5],1,i/30,.1,.4);
 const held=points.map(p=>[p.x,p.y]);
 for(let i=180;i<240;i++)stepParticles(points,[.5,.5],1,i/30,.1,.4);
 assert.ok(points.some((p,i)=>Math.hypot(p.x-held[i][0],p.y-held[i][1])>.01));
 for(let i=0;i<180;i++)stepParticles(points,[i%2,.5],1,i/30,1,.8);
 assert.ok(points.every(p=>[p.x,p.y,p.vx,p.vy].every(Number.isFinite)));
 for(let i=0;i<300;i++)stepParticles(points,[.5,.5],0,10,0,.8);
 assert.ok(points.every(p=>Math.hypot(p.x-p.bx,p.y-p.by)<.0001));
 assert.notEqual(heightAt(.3,.7,0,0),heightAt(.3,.7,0,4));
});
