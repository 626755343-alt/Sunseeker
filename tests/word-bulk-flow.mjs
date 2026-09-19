import JSZip from 'jszip';
import {chromium} from 'file:///C:/Users/62675/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const xml=`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
<w:p><w:r><w:t>nonsense: words without meaning</w:t></w:r></w:p>
<w:tbl><w:tr><w:tc><w:p><w:r><w:t>judgmental</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>quick to judge other people</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
</w:body></w:document>`;
const zip=new JSZip();zip.file('word/document.xml',xml);
const docx=await zip.generateAsync({type:'nodebuffer'});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
try{
  await page.route('https://api.dictionaryapi.dev/**',route=>route.abort());
  await page.goto('http://127.0.0.1:8765/');
  await page.getByRole('button',{name:/导入新课程/}).click();
  await page.locator('input[name=title]').fill('Word Bulk Check');
  await page.locator('input[name=pdf]').setInputFiles('D:/xwechat_files/wxid_d9ukj7n3l3an22_cd74/msg/file/2026-09/T1 Gossip词汇卡片(12.24)(3).pdf');
  await page.locator('input[name=word]').setInputFiles({name:'definitions.docx',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',buffer:docx});
  await page.getByRole('button',{name:/开始导入并核对/}).click();
  await page.locator('.entry').first().waitFor({timeout:60000});
  await page.getByText(/联网词典暂不可用/).waitFor({timeout:30000});
  const rows=await page.locator('.entry').evaluateAll(entries=>entries.map(entry=>({word:entry.querySelector('input').value,definition:entry.querySelector('textarea').value,label:entry.querySelector('label:has(textarea)').textContent})));
  const nonsense=rows.find(row=>row.word==='nonsense');const judgmental=rows.find(row=>row.word==='judgmental');
  await page.getByRole('button',{name:/一键确认全部/}).click();
  const confirmed=await page.locator('.entry button.approved').count();
  await page.getByRole('button',{name:/保存题库/}).click();
  const count=await page.locator('.lesson.active small').textContent();
  console.log({nonsense,judgmental,confirmed,count,errors});
  if(!nonsense?.definition.includes('without meaning')||!judgmental?.definition.includes('judge other people')||nonsense?.label?.includes('Word 文档')!==true||judgmental?.label?.includes('Word 文档')!==true||confirmed!==45||!count?.includes('45 道可抽查')||errors.length)process.exitCode=1;
}finally{await browser.close()}
