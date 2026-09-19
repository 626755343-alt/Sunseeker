import {openDB} from 'idb';
import type {Lesson} from '../domain/types';
const db=()=>openDB('sunseeker-lessons',1,{upgrade(x){if(!x.objectStoreNames.contains('lessons'))x.createObjectStore('lessons',{keyPath:'id'})}});
export async function listLessons():Promise<Lesson[]>{return (await (await db()).getAll('lessons')).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
export async function saveLesson(lesson:Lesson){await(await db()).put('lessons',lesson)}
export async function deleteLesson(id:string){await(await db()).delete('lessons',id)}
export async function exportLessons(){return JSON.stringify({schema:1,lessons:await listLessons()},null,2)}
export async function importBackup(file:File){const data=JSON.parse(await file.text());if(data?.schema!==1||!Array.isArray(data.lessons)||!data.lessons.every((l:unknown)=>validLesson(l)))throw new Error('备份格式不正确');for(const l of data.lessons)await saveLesson(l);return data.lessons.length}
function validLesson(v:unknown):v is Lesson{if(!v||typeof v!=='object')return false;const x=v as Lesson;return typeof x.id==='string'&&typeof x.title==='string'&&typeof x.createdAt==='string'&&Array.isArray(x.entries)&&x.entries.every(e=>typeof e.headword==='string'&&typeof e.definition==='string'&&typeof e.ipa==='string'&&typeof e.approved==='boolean')}
