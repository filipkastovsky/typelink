import { FromUnion } from './FromUnion';
import { describe, it, expectTypeOf } from 'vitest';

describe('FromUnion', () => {
  it('should extend an interface', () => {
    interface B extends FromUnion<'b'> {}

    expectTypeOf<B>().toMatchTypeOf<{ b: {} }>();
  });
});
