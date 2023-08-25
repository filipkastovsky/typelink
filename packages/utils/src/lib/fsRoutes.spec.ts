import { toRelative, matches, toLink } from './fsRoutes';

describe('toRelative', () => {
  it('should return relative path', () => {
    expect(toRelative('/foo/bar', '/foo/')).toBe('bar');
  });
});

describe('matches', () => {
  it('should match', () => {
    expect(matches('/foo/bar', '/foo/bar')).toBe(true);
  });

  it('should not match', () => {
    expect(matches('/foo/bar', '/foo/baz')).toBe(false);
  });
});

describe('toLink', () => {
  it('should return link', () => {
    expect(toLink('/foo/bar')).toBe('/foo/bar');
  });
});
