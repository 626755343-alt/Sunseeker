export type WordCandidate={id:string;raw:string;headword:string;sourcePage:number;sourceLine:string;status:'review'|'approved'|'excluded'};
export type DefinitionEvidence={text:string;slide:number;source:'shape'|'image';confidence:number};
export type WordEntry={id:string;headword:string;definition:string;definitionSource?:'ppt'|'word'|'dictionary'|'online'|'offline'|'manual';definitionUrl?:string|null;lookupState?:'pending'|'found'|'missing'|'error';ipa:string;audioUrl:string|null;approved:boolean;sourcePage:number;sourceSlide:number|null;sourceLine:string;excluded:boolean};
export type Lesson={id:string;title:string;createdAt:string;entries:WordEntry[]};
