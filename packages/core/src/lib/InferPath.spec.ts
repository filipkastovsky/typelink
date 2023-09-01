import type { InferPath } from './InferPath';
import { describe, it, expectTypeOf } from 'vitest';

describe('InferPath', () => {
  it('should infer paths from a string literal', () => {
    expectTypeOf<InferPath<'foo' | 'bar'>>().toEqualTypeOf<'/foo' | '/bar'>();
  });

  it('should infer paths from an object type', () => {
    expectTypeOf<InferPath<{ foo: {}; bar: {} }>>().toEqualTypeOf<'/foo' | '/bar'>();
  });

  it('should infer paths from a nested object type', () => {
    expectTypeOf<InferPath<{ foo: { bar: {} } }>>().toEqualTypeOf<'/foo' | '/foo/bar'>();
  });

  it('should infer paths with a custom separator', () => {
    expectTypeOf<InferPath<{ foo: { bar: {} } }, '->', ''>>().toEqualTypeOf<'foo' | 'foo->bar'>();
  });

  it('should infer paths with a custom context prefix', () => {
    expectTypeOf<InferPath<{ foo: { bar: {} } }, '/', 'ctx/'>>().toEqualTypeOf<'ctx/foo' | 'ctx/foo/bar'>();
  });
});
