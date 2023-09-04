import type { Href, Routes } from '#typelink';
import type { Query } from './Query';

export namespace Dynamic {
  /**
   * A pattern used commonly with meta-frameworks using file system routing eg. NextJS, Sveltekit, SolidStart...
   */
  export type Square = ['[', ']'];
  /**
   * A pattern used commonly with meta-frameworks using file system routing eg. NextJS, Sveltekit, SolidStart...
   */
  export const square: Square = ['[', ']'];
  /**
   * A pattern used in the OpenAPI specification
   */
  export type OpenAPI = ['{', '}'];
  /**
   * A pattern used in the OpenAPI specification
   */
  export const openAPI: OpenAPI = ['{', '}'];

  /**
   * Given a path, returns a string literal union of all possible dynamic segments
   *
   * @param TPath The path to parse
   * @param TPre The pattern used to denote the start of a dynamic segment
   * @param TPost The pattern used to denote the end of a dynamic segment
   * @param TSep The separator used between path segments (defaults to "`/`")
   * @param TCtx The context to aggregate the paths in (defaults to empty union - `never`)
   */
  type Parse<
    TPath extends string,
    TPre extends string,
    TPost extends string,
    TSep extends string = '/',
    TCtx extends string = never
  > = TPath extends `${string}${TSep}${TPre}${infer TParam}${TPost}${infer TRest}`
    ? Parse<`${TRest}`, TPre, TPost, TSep, TCtx | TParam>
    : TCtx;

  /**
   * Given a path, returns a record of all possible dynamic segments
   *
   * @param TPath The path to parse
   * @param TPre The pattern used to denote the start of a dynamic segment
   * @param TPost The pattern used to denote the end of a dynamic segment
   * @param TSep The separator used between path segments (defaults to "`/`")
   * @returns A record of all possible dynamic segments
   */
  type Params<TPath extends string, TPre extends string, TPost extends string, TSep extends string = '/'> = Record<
    Parse<TPath, TPre, TPost, TSep, never>,
    string
  >;

  /**
   * Given a path, returns a record of all possible query params
   *
   * @param TRoutes Record of all routes, defaults to global `Routes`
   * @param TPath The path to lookup in TRoutes
   */
  type QueryParams<TRoutes extends Record<string, any>, TPath extends keyof TRoutes> = TRoutes[TPath] extends Query<
    infer P
  >
    ? P
    : {};

  /**
   * A dynamic param interpolation factory
   *
   * @param pattern Tuple to describe the pattern used to denote a dynamic segment, eg. `['[', ']']`
   * @param TPattern Tuple to describe the pattern used to denote a dynamic segment, eg. `['[', ']']`
   * @param TRoutes Record of all routes, defaults to global `Routes`
   * @param TPath Union of valid paths
   * @returns A type-safe function that takes a path and a params object and returns a path with the params interpolated, **any params not interpolated will be added as query params**.
   *
   * **Warning:** This function does exactly 0 validation, it is up to you to ensure the params are valid
   */
  export function create<
    TPattern extends [string, string],
    TRoutes extends Record<string, any> = Routes,
    TPath extends string = Href
  >(pattern: TPattern) {
    return <T extends TPath>(path: T, params: Params<T, TPattern[0], TPattern[1]> & QueryParams<TRoutes, TPath>) => {
      let final: string = path;
      const query = new URLSearchParams();

      for (const key in params) {
        const expression = `${pattern[0]}${key}${pattern[1]}`;
        const param = params[key as keyof typeof params];

        if (final.includes(expression)) {
          final = final.replace(`${pattern[0]}${key}${pattern[1]}`, param);
          continue;
        }

        if (Array.isArray(param)) param.forEach((p) => query.append(key, p));
        else query.append(key, param);
      }

      // Sort query params to ensure consistent ordering (possible cache hit ratio improvement)
      query.sort();

      return (`${query}` ? `${final}?${query}` : final) as T;
    };
  }
}
