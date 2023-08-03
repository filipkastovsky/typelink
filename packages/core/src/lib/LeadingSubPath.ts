import type { SubPath } from './SubPath';

/**
 * Given a path, returns a string literal union of all possible subpaths, excluding the trivial `""`,
 *
 * @param T The path to infer subpaths from
 * @param TSep The separator to use between path segments (defaults to "`/`")
 *
 * @example From a string literal union:
 * ```
 * type Foo = LeadingSubPath<"/foo/bar">; // "/foo/bar"
 * ```
 * Internally uses {@link SubPath}
 */
export type LeadingSubPath<T extends string, TSep extends string = '/'> = Exclude<SubPath<T, TSep>, ''>;
