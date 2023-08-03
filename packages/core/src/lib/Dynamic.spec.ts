import type { Dynamic } from './Dynamic';

describe('Dynamic', () => {
  it('should accept arbitrary values in a matched pattern', () => {
    expectTypeOf<Dynamic<'/foo/[param]', Dynamic.Square>>().toMatchTypeOf<`/foo/${string}`>();
  });

  it('should accept multiple arbitrary values in a matched pattern', () => {
    expectTypeOf<Dynamic<'/foo/[param]/[param2]', Dynamic.Square>>().toMatchTypeOf<`/foo/${string}/${string}`>();
  });
});
