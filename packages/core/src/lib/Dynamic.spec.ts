import { Dynamic } from './Dynamic';

describe('Dynamic', () => {
  it('should mask underlying type', () => {
    type Path = '/foo/[param]/[param2]';
    const dyn = Dynamic.create<Path, Dynamic.Square>(Dynamic.square);

    expectTypeOf<ReturnType<typeof dyn>>().toMatchTypeOf<Path>();
  });

  it('should replace param values', () => {
    type Path =
      | '/foo/[param1]'
      | '/foo/[param1]/[param2]'
      | '/foo/[param1]/[param2]/[param3]'
      | '/[param0]/'
      | '/foo/bar/[param2]';
    const dyn = Dynamic.create<Path, Dynamic.Square>(Dynamic.square);

    expect(dyn('/foo/[param1]', { param1: 'bar' })).toBe('/foo/bar');
    expect(dyn('/foo/[param1]/[param2]', { param1: 'bar', param2: 'baz' })).toBe('/foo/bar/baz');
    expect(dyn('/foo/[param1]/[param2]/[param3]', { param1: 'bar', param2: 'baz', param3: 'qux' })).toBe(
      '/foo/bar/baz/qux'
    );
    expect(dyn('/[param0]/', { param0: 'foo' })).toBe('/foo/');
    expect(dyn('/foo/bar/[param2]', { param2: 'baz' })).toBe('/foo/bar/baz');
    expect;
  });
});
