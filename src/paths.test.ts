import { describe, expect, it } from 'vitest';
import { publicAssetPath } from './paths';

describe('publicAssetPath', () => {
  it('keeps bundled assets inside a GitHub Pages project path', () => {
    expect(publicAssetPath('offline-lexicon.json', '/Sunseeker/')).toBe('/Sunseeker/offline-lexicon.json');
  });
});
