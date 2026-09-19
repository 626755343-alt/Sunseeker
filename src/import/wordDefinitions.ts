import JSZip from 'jszip';
import type {WordCandidate} from '../domain/types';
import {normalizeTerm} from './matchDefinitions';

const elements=(node:Element,name:string)=>Array.from(node.childNodes).filter((child):child is Element=>child.nodeType===1&&(child as Element).localName===name);
const descendants=(node:Element,name:string)=>Array.from(node.getElementsByTagNameNS('*',name));
const text=(node:Element)=>descendants(node,'t').map(part=>part.textContent||'').join('').replace(/\s+/g,' ').trim();
const clean=(value:string)=>value.replace(/^\s*\d+[.)、]\s*/,'').replace(/^\s*(?:n|v|adj|adv)\s*\.\s*/i,'').trim();
const useful=(value:string)=>/^[\x00-\x7F\s“”‘’–—]+$/.test(value)&&((value.match(/[A-Za-z]+/g)||[]).length>=2);

export function matchWordDefinitions(xml:string,words:WordCandidate[]):Map<string,string>{
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror'))throw new Error('Word 文档内容无法解析');
  const body=descendants(doc.documentElement,'body')[0];
  if(!body)throw new Error('Word 文档缺少正文');
  const lines:{term:string;definition:string}[]=[];
  const paragraphs:string[]=[];
  for(const block of Array.from(body.children)){
    if(block.localName==='p')paragraphs.push(text(block));
    if(block.localName==='tbl')for(const row of descendants(block,'tr')){
      const cells=elements(row,'tc').map(text).filter(Boolean);
      if(cells.length>=2)lines.push({term:cells[0],definition:cells.slice(1).join(' ')});
    }
  }
  for(let i=0;i<paragraphs.length;i++){
    const line=paragraphs[i];
    const split=line.match(/^(.{1,90}?)\s*(?:[:：]|\s+[—–-]\s+)\s*(.+)$/);
    if(split)lines.push({term:split[1],definition:split[2]});
    if(i+1<paragraphs.length)lines.push({term:line,definition:paragraphs[i+1]});
  }
  const result=new Map<string,string>();
  for(const word of words){
    const wanted=normalizeTerm(word.headword);
    const match=lines.find(item=>normalizeTerm(clean(item.term))===wanted&&useful(clean(item.definition)));
    if(match)result.set(word.id,clean(match.definition));
  }
  return result;
}

export async function extractWordDefinitions(file:File,words:WordCandidate[]):Promise<Map<string,string>>{
  if(!/\.docx$/i.test(file.name))throw new Error('请使用 .docx 格式的 Word 文档');
  const zip=await JSZip.loadAsync(await file.arrayBuffer());
  const xml=await zip.file('word/document.xml')?.async('text');
  if(!xml)throw new Error('Word 文档中没有可读取的正文');
  return matchWordDefinitions(xml,words);
}
