/**
 * A string that may or may not have a hash (and content after the hash)
 *
 * @example
 * ```ts
 * type A = OptionalHash<'/users'> // '/users' | '/users#something' | '/users#'
 * ```
 *
 * @param TStr The string to append the hash to
 */
export type OptionalHash<TStr extends string> = TStr | `${TStr}#${string}`;
