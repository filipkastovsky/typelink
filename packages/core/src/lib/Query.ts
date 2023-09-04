declare const _q: unique symbol;

/**
 * Query type, use this to define a query on a route. **Use this instead of declaring literals for back-forwards compatibility** (see below).
 *
 * @param T The query object type (is not limited to only objects, as this depends on your router implementation, most likely you will use an object though)
 *
 * @example
 * ```ts
 * interface Routes {
 *  '/': Query<{ details?: "true" | "false", userId?: string | string[] }>
 * '/user': Query<{ userId: string }>
 * }
 * ```
 *
 * @see {@link Q} for a shorthand
 *
 * **Warning:** The underlying implementation of this type is subject to change in the future as we add features. Using `Query` and `FromQuery` will be safe, while other ways of declaring and accessing the query type may break even in patch/minor versions.
 *
 */
export type Query<T = {}> = {
  readonly [_q]: T;
};

/**
 * Extracts the query type from a {@link Query}. **Use this instead of indexed access for back-forwards compatibility** (see below).
 *
 * @param T The query type to extract from
 *
 * @see {@link FromQ} for a shorthand
 *
 * @example
 *  ```ts
 * type MyQuery = Query<{ details?: "true" | "false", userId?: string | string[] }>
 * type MyQueryType = FromQuery<MyQuery>; // { details?: "true" | "false", userId?: string | string[] }
 * ```
 *
 * **Warning:** The underlying implementation of this type is subject to change in the future as we add features. Using `Query` and `FromQuery` will be safe, while other ways of declaring and accessing the query type may break even in patch/minor versions.
 */
export type FromQuery<T extends Query> = T[typeof _q];

/**
 * Shorthand for {@link Query}
 *
 * @see {@link Query} for more information
 */
export type Q<T = {}> = Query<T>;

/**
 * Shorthand for {@link FromQuery}
 *
 * @see {@link FromQuery} for more information
 */
export type FromQ<T extends Q> = FromQuery<T>;
