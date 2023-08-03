import type { ReplaceAll } from './ReplaceAll';

describe('ReplaceAll', () => {
  it('should replace all occurrences of a pattern in a string literal', () => {
    expectTypeOf<ReplaceAll<'foo bar baz', ' ', '-'>>().toEqualTypeOf<'foo-bar-baz'>();
  });

  it('should replace all occurrences of a pattern in a string literal with a wildcard', () => {
    expectTypeOf<ReplaceAll<'foo[bar]baz[qux]quux', `[${string}]`, ' '>>().toEqualTypeOf<'foo baz quux'>();
  });
});
