import {describe,it,expect} from 'vitest';
import {createSession,revealCurrent,awardCurrent,nextQuestion,getCurrent} from './session';
const entries=['a','b'].map((headword,id)=>({id:String(id),headword,definition:'definition',ipa:'',audioUrl:null,approved:true,sourcePage:1,sourceSlide:1,sourceLine:'',excluded:false}));
describe('quiz',()=>{it('hides answer, awards once, and advances without repeat',()=>{let s=createSession(entries,()=>0.2);expect(s.revealed).toBe(false);expect(getCurrent(s)?.definition).toBe('definition');s=revealCurrent(s);s=awardCurrent(s);s=awardCurrent(s);expect(s.correct).toBe(1);const first=getCurrent(s)?.id;s=nextQuestion(s);expect(getCurrent(s)?.id).not.toBe(first);expect(s.revealed).toBe(false)})});
