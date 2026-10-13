const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const html=fs.readFileSync(path.join(__dirname,'../wc26_bracket.html'));
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(html)});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}: {})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().startsWith('https://'))requests.push(r.url())});
  await page.route('https://**/*',r=>r.abort());await page.goto(url);
  assert.equal(await page.locator('.match').count(),32);
  assert.equal(await page.locator('.rd-r32').first().isVisible(),true);
  assert.equal(await page.locator('#sec-about').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  fs.mkdirSync(path.join(__dirname,'../test-results'),{recursive:true});
  await page.screenshot({path:path.join(__dirname,'../test-results/desktop.png')});
  const first=page.locator('[data-mid="M74"] .team-row').first();const chosen=await first.getAttribute('data-team');await first.click();
  await page.reload();assert.equal(await page.locator(`[data-mid="M74"] [data-team="${chosen}"]`).getAttribute('aria-pressed'),'true');
  // Keyboard operation and descendant invalidation through a complete tournament.
  await page.locator('[data-mid="M74"] .team-row').first().focus();await page.keyboard.press('Enter');
  for(let id=73;id<=104;id++){
    const rows=page.locator(`[data-mid="M${id}"] .team-row.pickable`);assert.equal(await rows.count(),2);await rows.first().click();
  }
  assert.match(await page.locator('#championSpotlight').innerText(),/Champion pick/i);
  await page.locator('[data-mid="M74"] .team-row').nth(1).click();
  assert.equal(await page.locator('[data-mid="M89"] .winner').count(),0);
  const downloadPromise=page.waitForEvent('download');await page.locator('#exportBtn').click();const download=await downloadPromise;
  const stream=await download.createReadStream();let raw='';for await(const c of stream)raw+=c;assert.equal(JSON.parse(raw).project,'The Dynamic Table');
  page.on('dialog',dialog=>dialog.accept());await page.locator('#resetBtn').click();assert.equal(await page.locator('.team-row.winner').count(),0);
  await page.locator('#entryToggle').click();const input=page.locator('.sc').first();await input.fill('5');
  assert.match(await page.locator('#statusbar').innerText(),/scenario edited/);
  await page.locator('.sort-button[data-k="GF"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('th[aria-sort="descending"]').count(),1);
  assert.equal(requests.length,0,'Core demo must not make external requests');
  for(const width of [390,768]){
    await page.setViewportSize({width,height:844});await page.goto(url);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);
    if(width===390){const box=await page.locator('[data-mid="M74"] .team-row').first().boundingBox();assert(box.height>=44);await page.screenshot({path:path.join(__dirname,'../test-results/mobile.png')});await page.locator('[data-mid="M74"] .team-row').first().click();}
  }
  await page.locator('#pullLiveBtn').click();await page.waitForFunction(()=>!document.querySelector('#pullLiveBtn').disabled);assert.match(await page.locator('#statusbar').innerText(),/unreachable/);
  assert.deepEqual(errors,[]);
  const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('blocked')}});await blocked.goto(url);await blocked.locator('#saveBtn').click();assert.match(await blocked.locator('#toast').innerText(),/blocked/);await blocked.close();
  const corrupt=await browser.newPage();await corrupt.addInitScript(()=>localStorage.setItem('wc26_portfolio_state_v3',JSON.stringify({matches:[{h:'BAD'}]})));await corrupt.goto(url);assert.equal(await corrupt.locator('.match').count(),32);await corrupt.close();
  console.log('Browser checks passed: desktop/mobile/tablet, no background network, full path, keyboard picks, autosave/reload, export, reset, score edits, sorting, blocked storage, corrupt storage, import failure.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exit(1)});
