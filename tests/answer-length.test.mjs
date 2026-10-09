import {test} from 'node:test';
import assert from 'node:assert/strict';
import {matchTokens,nearestLevel} from '../public/lab/answer-length/model.js';
test('surviving repeated words remain one-to-one and in reading order',()=>{
 const before=['the','light','and','the','light','in','the','room'];
 const after=['the','light','in','the','room'];
 const pairs=matchTokens(before,after);
 assert.equal(pairs.length,5);
 assert.equal(new Set(pairs.map(p=>p[0])).size,pairs.length);
 pairs.forEach(([a,b],i)=>{assert.equal(before[a],after[b]);if(i){assert.ok(a>pairs[i-1][0]);assert.ok(b>pairs[i-1][1]);}});
});
test('Chinese glyph continuity works in both shortening and expansion',()=>{
 const a=Array.from('腾出地面，让光进来。'),b=Array.from('让光进来。');
 assert.equal(matchTokens(a,b).length,b.length);
 assert.equal(matchTokens(b,a).length,b.length);
 assert.deepEqual(matchTokens([],b),[]);
});
test('drag chooses the nearest content height and stays bounded beyond the endpoints',()=>{
 const heights=[52,85,174,302];
 assert.equal(nearestLevel(-90,heights),0);
 assert.equal(nearestLevel(999,heights),3);
 assert.equal(nearestLevel(166,heights),2);
 assert.equal(nearestLevel(84,heights),1);
});
