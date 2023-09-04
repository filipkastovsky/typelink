declare module '#typelink' {
  /**
   * This is the where all the fun begins, add stuff to this interface to expand your routes.
   *
   * @example
   *
   * ```ts
   * declare module '#typelink' {
   *  interface Routes {
   *   '/users/[userId]': Query<{ details?: "true" | "false" }>
   *  }
   * }
   * ```
   *
   * This will add a route `/users/[userId]` to your application, with an optional query parameter `details` that can be either `"true"` or `"false"`.
   */
  export interface Routes {}
  /**
   * The bread and butter of `@typelink`. This is the type where all of your routes will be collected. Use this type in your application wherever you need to reference a route (links, imperative routing, redirects, etc.).
   *
   * A union of strings, where each string is a route.
   */
  export type Href = keyof Routes;
}

export * from './lib/InferPath';
export * from './lib/Dynamic';
export * from './lib/FromUnion';
export * from './lib/Query';
