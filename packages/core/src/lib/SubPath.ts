/**
 * Given a path, returns a string literal union of all possible subpaths
 *
 * If the path starts with a separator, the first subpath will be the empty string. Use {@link LeadingSubPath} to exclude it.
 *
 * @param T The path to infer subpaths from
 * @param TSep The separator to use between path segments (defaults to "`/`")
 *
 * @example From a string literal union:
 * ```
 * type Foo = SubPath<"foo/bar">; // "foo" | "foo/bar"
 * type Foo2 = SubPath<"foo/bar/baz">; // "foo" | "foo/bar" | "foo/bar/baz"
 * ```
 */
export type SubPath<T extends string, TSep extends string = '/'> = T extends `${infer TPath}${TSep}${infer TRest}`
  ? TPath | `${TPath}${TSep}${TRest}` | `${TPath}/${SubPath<TRest, TSep>}`
  : never;
