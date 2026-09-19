import{chromium}from'file:///C:/Users/62675/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('https://api.dictionaryapi.dev/**',route=>route.abort());await page.goto('http://127.0.0.1:8765/');await page.getByRole('button',{name:/核对 T1 样本/}).click();await page.getByText(/联网词典暂不可用/).waitFor({timeout:25000});
const rows=await page.locator('.entry').evaluateAll(es=>es.map(e=>({word:e.querySelector('input').value,ipa:e.querySelectorAll('input')[1].value,definition:e.querySelector('textarea').value,label:e.querySelector('label:has(textarea)').textContent})));
await page.screenshot({path:'tests/offline-review.png'});
console.log('total',rows.length,'defined',rows.filter(r=>r.definition).length,'with IPA',rows.filter(r=>r.ipa).length);
console.log('PPT',rows.find(r=>r.word==='hostile'));console.log('OFFLINE',rows.find(r=>r.word==='progesterone'));console.log('pageErrors',errors);
if(rows.length!==45||rows.filter(r=>r.definition).length!==45||rows.filter(r=>r.ipa).length!==45||!rows.find(r=>r.word==='hostile')?.definition.includes('very unfriendly')||!rows.find(r=>r.word==='progesterone')?.definition.includes('steroid hormone'))process.exitCode=1;
await browser.close();
