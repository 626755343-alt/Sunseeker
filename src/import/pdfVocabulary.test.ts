import {describe,it,expect} from 'vitest';
import {parseVocabularyLines} from './pdfVocabulary';
describe('PDF vocabulary',()=>{it('extracts numbered candidates and preserves collapsed phrases for review',()=>{const rows=parseVocabularyLines(['Gossip 词汇卡片 (45词)','1. hostile','6.commonmyth','7. idletalk'],1);expect(rows.map(x=>x.headword)).toEqual(['hostile','commonmyth','idletalk']);expect(rows[1].status).toBe('review');expect(rows[1].sourceLine).toContain('commonmyth')})});
