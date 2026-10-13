const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../wc26_bracket.html'),'utf8');
function engine(){
  const els={};
  for(const [,id,json] of html.matchAll(/<script id="([^"]+)" type="application\/json">([\s\S]*?)<\/script>/g)) els[id]={textContent:json};
  let code=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(x=>x[2].includes('const DEFAULT_SNAPSHOT'))[2];
  code=code.slice(0,code.indexOf('  loadSaved();'))+`\n globalThis.api={state,compute,rankGroup,breakTie,greedyAnnexe,ROUND32,LINKS,KO_IDS,DEFAULT_MATCHES,validSavedMatches,applyFinishedKO,entrantsForMatch,winnerOf,loserOf,cleanInvalidPicks,parseAnnexeLine};})();`;
  const context={document:{getElementById:id=>els[id]},window:{matchMedia:()=>({matches:false})},console,Set,Date};
  vm.createContext(context); vm.runInContext(code,context);context.api.compute();return context.api;
}
test('sample contains 12 groups, 72 valid games, and 32 unique qualifiers',()=>{
 const a=engine();assert.equal(a.DEFAULT_MATCHES.length,72);assert(a.validSavedMatches(a.DEFAULT_MATCHES));
 const c=a.compute();assert.equal(Object.keys(c.groups).length,12);assert.equal(c.qualifiedThirds.length,8);
 const teams=a.ROUND32.flatMap(m=>a.entrantsForMatch(m.id).map(e=>e.id));assert.equal(new Set(teams).size,32);
 for(const g of Object.values(c.groups)){assert.equal(g.length,4);assert(g.every(t=>t.mp===3));assert.equal(g.reduce((s,t)=>s+t.gf,0),g.reduce((s,t)=>s+t.ga,0));}
});
test('full simulated path resolves final and third-place match; upstream changes clear stale picks',()=>{
 const a=engine();for(const id of a.KO_IDS){const es=a.entrantsForMatch(id);assert(es.every(e=>e.kind==='team'));a.state.picks[id]=es[0].id;}
 assert(a.winnerOf('M104'));assert(a.loserOf('M101'));assert.equal(a.entrantsForMatch('M103')[0].id,a.loserOf('M101').id);
 const old=a.winnerOf('M104').id;const es=a.entrantsForMatch('M74');a.state.picks.M74=es[1].id;a.cleanInvalidPicks();
 assert.notEqual(a.winnerOf('M104')?.id,old);assert.equal(a.state.picks.M89,undefined);
});
test('imported later-round results cannot lock matches formed only by user picks',()=>{
 const a=engine();for(const id of ['M74','M77'])a.state.picks[id]=a.entrantsForMatch(id)[0].id;
 const es=a.entrantsForMatch('M89');assert.equal(a.applyFinishedKO(es[0].team.code,es[1].team.code,2,0,null,null),0);assert.equal(a.state.ko.M89,undefined);
});
test('confirmed scores handle reversed home/away order and shootout winners',()=>{
 const a=engine();const es=a.entrantsForMatch('M74');const h=es[0].team.code,v=es[1].team.code;
 assert.equal(a.applyFinishedKO(v,h,1,1,3,4),1);assert.equal(a.state.ko.M74.w,h);assert.equal(a.state.ko.M74.ph,4);assert.equal(a.winnerOf('M74').id,es[0].id);
});
test('draw without a resolved shootout does not invent a winner',()=>{
 const a=engine(),es=a.entrantsForMatch('M74');assert.equal(a.applyFinishedKO(es[0].team.code,es[1].team.code,1,1,null,null),0);assert.equal(a.winnerOf('M74'),null);
});
test('saved fixtures reject malformed scores, missing games, and foreign teams',()=>{
 const a=engine();for(const mutate of [m=>m.pop(),m=>m[0].hs=-1,m=>m[0].hs='2',m=>m[0].h='INVALID']){const m=JSON.parse(JSON.stringify(a.DEFAULT_MATCHES));mutate(m);assert.equal(a.validSavedMatches(m),false);}
});
test('provisional third-place allocations stay unique for all 495 combinations',()=>{
 const a=engine(),groups='ABCDEFGHIJKL';let count=0;
 function combos(prefix,start){if(prefix.length===8){const m=a.greedyAnnexe(prefix).map;assert.equal(new Set(Object.values(m)).size,8);assert(Object.values(m).every(x=>prefix.includes(x[1])));for(const [s,t]of Object.entries(m))assert.notEqual(s[1],t[1]);count++;return;}for(let i=start;i<groups.length;i++)combos(prefix+groups[i],i+1);}
 combos('',0);assert.equal(count,495);
});
