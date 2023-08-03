import type { ReplaceAll } from '../utils/ReplaceAll';

export namespace Dynamic {
  /**
   * A pattern used commonly with meta-frameworks using file system routing eg. NextJS, Sveltekit, SolidStart...
   */
  export type Square = `[${string}]`;
  /**
   * A pattern used in the OpenAPI specification
   */
  export type OpenAPI = `{${string}}`;
  /**
   * A pattern used by Express, React Router...
   */
  export type Express = `:${string}`;
}

/**
 * Makes a path dynamic by replacing all occurrences of a given pattern with a wildcard
 *
 * @param TPath The path to make dynamic
 * @param TPattern The pattern to match, you can either use any of the provided, or your own
 * @example
 * ```
 * type Foo = Dynamic<'foo/[bar]/baz', Dynamic.Square>; // 'foo/{anything}/baz'
 * ```
 */
export type Dynamic<TPath extends string, TPattern extends string> = ReplaceAll<TPath, TPattern, string>;
