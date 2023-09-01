import Href from '#typelink';

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
   * A dynamic param interpolation factory
   *
   * @param TPath Union of valid paths
   * @param TPattern Tuple to describe the pattern used to denote a dynamic segment, eg. `['[', ']']`
   * @param pattern Tuple to describe the pattern used to denote a dynamic segment, eg. `['[', ']']`
   * @returns A type-safe function that takes a path and a params object and returns a path with the params interpolated
   */
  export function create<TPattern extends [string, string], TPath extends string = Href>(pattern: TPattern) {
    return <T extends TPath>(path: T, params: Params<T, TPattern[0], TPattern[1]>) => {
      let final: string = path;
      for (const key in params) {
        final = final.replace(`${pattern[0]}${key}${pattern[1]}`, params[key as keyof typeof params]);
      }
      return final as T;
    };
  }
}
