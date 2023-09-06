import type { OptionalHash } from './OptionalHash';
import { describe, it, expectTypeOf } from 'vitest';

describe('OptionalHash', () => {
  it('should optionally append a hash with content to a string', () => {
    type Hash = OptionalHash<'/users'>;

    expectTypeOf<'/users'>().toMatchTypeOf<Hash>();
    expectTypeOf<'/users#something'>().toMatchTypeOf<Hash>();
    expectTypeOf<'/users#'>().toMatchTypeOf<Hash>();
  });
});
