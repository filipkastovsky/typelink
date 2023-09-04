import { FromQuery, type Query } from './Query';
import { describe, it, expectTypeOf } from 'vitest';

describe('Query', () => {
  it('should be declarable with various params', () => {
    expectTypeOf<Query>().toBeObject();
    expectTypeOf<Query<{}>>().toBeObject();
    expectTypeOf<Query<{ foo: string }>>().toBeObject();
    expectTypeOf<Query<[foo: string]>>().toBeObject();
    expectTypeOf<Query<['foo', 'bar']>>().toBeObject();
    expectTypeOf<Query<'foo' | 'bar'>>().toBeObject();
  });

  it('should be revertible using FromQuery', () => {
    type MyQuery = { details?: 'true' | 'false'; userId?: string | string[] };
    expectTypeOf<FromQuery<Query<MyQuery>>>().toEqualTypeOf<MyQuery>();
  });

  it('should be not assignable', () => {
    type MyQuery = { details?: 'true' | 'false' };

    // @ts-expect-error - should not be assignable

    // Also make sure lsp doesn't give any hints here
    const q: Query<MyQuery> = {};
    expectTypeOf(q).toMatchTypeOf<Query<MyQuery>>();
  });
});
