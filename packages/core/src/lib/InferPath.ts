/**
 * Given a type, returns a string literal union of all possible paths from its keys
 *
 * @param T The type to infer paths from
 * @param TSep The separator to use between path segments (defaults to "`/`")
 * @param TCtx The context to prefix the path with (defaults to "`TSep`")
 *
 *
 * @example From a string literal union:
 * ```
 * type Foo = InferPath<"foo" | "bar">; // "/foo" | "/bar"
 * ```
 *
 * @example From an object type:
 * ```
 *  type Bar = InferPath<{ foo: {}, bar: {} }>; // "foo" | "bar"
 * type Bar2 = InferPath<{ foo: { bar: {} } }>; // "/foo" | "/foo/bar"
 * ```
 *
 * @example With a custom separator and context:
 *
 * ```
 * type Baz = InferPath<{ foo: { bar: {} } }, "->", "">; // "foo" | "foo->bar"
 * ```
 */
export type InferPath<T, TSep extends string = '/', TCtx extends string = TSep> = T extends string
  ? `${TCtx}${T}`
  : T extends {}
  ? {
      [P in keyof T]: InferPath<P, TSep, TCtx> | InferPath<T[P], TSep, `${TCtx}${P & string}${TSep}`>;
    }[keyof T]
  : never;
