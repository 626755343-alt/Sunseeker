import {chromium} from 'file:///C:/Users/62675/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try{
  await page.route('https://api.dictionaryapi.dev/**',route=>route.abort());
  await page.goto('http://127.0.0.1:8765/');
  await page.getByRole('button',{name:/导入新课程/}).click();
  await page.locator('input[name=title]').fill('PDF Only Offline');
  await page.locator('input[name=pdf]').setInputFiles('D:/xwechat_files/wxid_d9ukj7n3l3an22_cd74/msg/file/2026-09/T1 Gossip词汇卡片(12.24)(3).pdf');
  await page.getByRole('button',{name:/开始导入并核对/}).click();
  await page.locator('.entry').first().waitFor({timeout:60000});
  await page.getByText(/联网词典暂不可用/).waitFor({timeout:30000});
  const first=page.locator('.entry').first();
  const word=await first.locator('input').first().inputValue();
  await first.locator('textarea').fill('');
  await first.getByRole('button',{name:'确认入题'}).click();
  await page.getByRole('button',{name:/保存题库/}).click();
  await page.getByText('PDF Only Offline').first().waitFor();
  await page.getByRole('button',{name:/开始随机抽查/}).click();
  await page.getByRole('button',{name:/揭晓答案/}).click();
  const displayed=await page.locator('.question h1').textContent();
  const audioOnly=await page.getByText('本题只抽查发音').isVisible();
  const noDefinition=await page.locator('.answer p').count()===0;
  console.log({word,displayed,audioOnly,noDefinition,errors});
  if(displayed!==word||!audioOnly||!noDefinition||errors.length)process.exitCode=1;
}finally{await browser.close()}
