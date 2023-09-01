import type { LeadingSubPath } from './LeadingSubPath';
import { describe, it, expectTypeOf } from 'vitest';

describe('LeadingSubPath', () => {
  it('should return subpaths of a literal path', () => {
    expectTypeOf<LeadingSubPath<'foo/bar'>>().toEqualTypeOf<'foo' | 'foo/bar'>();
  });

  it('should return subpaths of a nested literal path', () => {
    expectTypeOf<LeadingSubPath<'foo/bar/baz'>>().toEqualTypeOf<'foo' | 'foo/bar' | 'foo/bar/baz'>();
  });

  it('should return subpaths of a literal path with a custom separator', () => {
    expectTypeOf<LeadingSubPath<'foo->bar', '->'>>().toEqualTypeOf<'foo' | 'foo->bar'>();
  });

  it('should accept a leading separator', () => {
    expectTypeOf<LeadingSubPath<'/foo'>>().toEqualTypeOf<'/foo'>();
  });
});
