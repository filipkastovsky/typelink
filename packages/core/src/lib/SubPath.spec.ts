import type { SubPath } from './SubPath';

describe('SubPath', () => {
  it('should return subpaths of a literal path', () => {
    expectTypeOf<SubPath<'foo/bar'>>().toEqualTypeOf<'foo' | 'foo/bar'>();
  });

  it('should return subpaths of a nested literal path', () => {
    expectTypeOf<SubPath<'foo/bar/baz'>>().toEqualTypeOf<'foo' | 'foo/bar' | 'foo/bar/baz'>();
  });

  it('should return subpaths of a literal path with a custom separator', () => {
    expectTypeOf<SubPath<'foo->bar', '->'>>().toEqualTypeOf<'foo' | 'foo->bar'>();
  });

  it('should not accept a leading separator', () => {
    expectTypeOf<SubPath<'/foo'>>().not.toEqualTypeOf<'foo'>();
  });
});
