import type {WordEntry} from '../domain/types';
export type Session={queue:WordEntry[];index:number;revealed:boolean;awarded:boolean;correct:number;streak:number};
export function createSession(entries:WordEntry[],random=Math.random):Session{const queue=[...entries];for(let i=queue.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]]}return {queue,index:0,revealed:false,awarded:false,correct:0,streak:0}}
export function revealCurrent(s:Session):Session{return {...s,revealed:true}}
export function awardCurrent(s:Session):Session{return !s.revealed||s.awarded?s:{...s,awarded:true,correct:s.correct+1,streak:s.streak+1}}
export function nextQuestion(s:Session):Session{return {...s,index:Math.min(s.index+1,s.queue.length),revealed:false,awarded:false,streak:s.awarded?s.streak:0}}
export function getCurrent(s:Session){return s.queue[s.index]||null}
