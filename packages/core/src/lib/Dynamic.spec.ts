import '../base.d.ts';
import { Dynamic } from './Dynamic';
import { describe, it, expectTypeOf, expect } from 'vitest';
import { Href } from '#typelink';
import { Query } from './Query';

// We declare a route as otherwise `never` would be returned in "should default to global `Routes`" test which would fail
declare module '#typelink' {
  interface Routes {
    '/foo/[param]/[param2]': {};
  }
}

describe('Dynamic', () => {
  it('should mask underlying type', () => {
    type Path = '/foo/[param]/[param2]';
    const dyn = Dynamic.create<Dynamic.Square, {}, Path>(Dynamic.square);

    expectTypeOf<ReturnType<typeof dyn>>().toMatchTypeOf<Path>();
  });

  it('should default to global `Routes`', () => {
    const dyn = Dynamic.create<Dynamic.Square>(Dynamic.square);
    expectTypeOf<ReturnType<typeof dyn>>().toMatchTypeOf<Href>();
  });

  it('should replace param values', () => {
    type Path =
      | '/foo/[param1]'
      | '/foo/[param1]/[param2]'
      | '/foo/[param1]/[param2]/[param3]'
      | '/[param0]/'
      | '/foo/bar/[param2]';
    const dyn = Dynamic.create<Dynamic.Square, {}, Path>(Dynamic.square);

    expect(dyn('/foo/[param1]', { param1: 'bar' })).toBe('/foo/bar');
    expect(dyn('/foo/[param1]/[param2]', { param1: 'bar', param2: 'baz' })).toBe('/foo/bar/baz');
    expect(dyn('/foo/[param1]/[param2]/[param3]', { param1: 'bar', param2: 'baz', param3: 'qux' })).toBe(
      '/foo/bar/baz/qux'
    );
    expect(dyn('/[param0]/', { param0: 'foo' })).toBe('/foo/');
    expect(dyn('/foo/bar/[param2]', { param2: 'baz' })).toBe('/foo/bar/baz');
  });

  it('should replace query params', () => {
    const path = '/foo';

    type MyParams = { qParam0: string; qParam1?: string; qParamArray?: string[] };

    const dyn = Dynamic.create<Dynamic.Square, { [path]: Query<MyParams> }, typeof path>(Dynamic.square);

    expect(dyn('/foo', { qParam0: 'qux', qParam1: 'quux', qParamArray: ['bar', 'baz'] })).toBe(
      '/foo?qParam0=qux&qParam1=quux&qParamArray=bar&qParamArray=baz'
    );
  });

  it('should replace query params and path params', () => {
    const path = '/foo/[param]/[param2]';
    const dyn = Dynamic.create<Dynamic.Square, { [path]: Query<{ qParam0: string; qParam1?: string }> }, typeof path>(
      Dynamic.square
    );

    expect(dyn('/foo/[param]/[param2]', { param: 'bar', param2: 'baz', qParam0: 'qux', qParam1: 'quux' })).toBe(
      '/foo/bar/baz?qParam0=qux&qParam1=quux'
    );
  });
});
