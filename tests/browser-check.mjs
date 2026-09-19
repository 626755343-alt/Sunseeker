import { chromium } from 'file:///C:/Users/62675/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1280,height:720}});
page.on('console',m=>{if(m.type()==='error')console.log('BROWSER ERROR',m.text())});
await page.goto(process.env.BASE_URL||'http://127.0.0.1:5173/');
await page.screenshot({path:'tests/home.png'});
console.log('HOME',await page.locator('h1').first().innerText());
await page.getByRole('button',{name:/导入新课程|导入 T1 资料/}).first().click();
await page.locator('input[name=title]').fill('T1 Gossip');
await page.locator('input[name=pdf]').setInputFiles('D:/xwechat_files/wxid_d9ukj7n3l3an22_cd74/msg/file/2026-09/T1 Gossip词汇卡片(12.24)(3).pdf');
if(process.env.CHECK_PPT)await page.locator('input[name=ppt]').setInputFiles('D:/共享/S5最新课件——Ci/T1/T1 Gossip输入课❤️.pptx');
if(process.env.DEBUG_PPT){const ev=await page.evaluate(async()=>{const {extractPptDefinitions}=await import('/src/import/pptDefinitions.ts');return extractPptDefinitions(document.querySelector('input[name=ppt]').files[0])});console.log('EVIDENCE',JSON.stringify(ev.filter(x=>x.slide>=60),null,2));}
await page.getByRole('button',{name:/开始导入并核对/}).click();
await page.getByText(/核对词条/).waitFor({timeout:30000}).catch(()=>{});
console.log('STATUS',await page.locator('.toast').allTextContents());
console.log('ROWS',await page.locator('.entry').count());
console.log('WORDS',(await page.locator('.entry input').evaluateAll(es=>es.filter(e=>e.closest('.entry-top')).map(e=>e.value))).slice(0,18));
console.log('DEFINITIONS',(await page.locator('.entry textarea').evaluateAll(es=>es.map(e=>e.value).filter(Boolean))).slice(0,12));
console.log('MATCHED',await page.locator('.entry').evaluateAll(es=>es.map(e=>({word:e.querySelector('input').value,definition:e.querySelector('textarea').value})).filter(x=>x.definition).length));
console.log('KEY',await page.locator('.entry').evaluateAll(es=>es.map(e=>({word:e.querySelector('input').value,definition:e.querySelector('textarea').value})).filter(x=>['common myth','hostile'].includes(x.word))));
if(process.env.WRITE_SAMPLE){const rows=await page.locator('.entry').evaluateAll(es=>es.map(e=>({headword:e.querySelector('input').value,definition:e.querySelector('textarea').value,sourcePage:Number(e.querySelector('.source').textContent.match(/PDF 第 (\d+)/)?.[1]||1),sourceSlide:Number(e.querySelector('.source').textContent.match(/PPT 第 (\d+)/)?.[1]||0)||null})));writeFileSync('public/t1-starter.json',JSON.stringify({title:'T1 Gossip',entries:rows},null,2));}
await page.screenshot({path:'tests/review.png',fullPage:true});
await browser.close();
