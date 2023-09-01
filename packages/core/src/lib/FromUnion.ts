/**
 * Converts a union of strings into keys for `@typelink`'s `Routes` interface.
 *
 * @param TPaths - A union of strings.
 */
export type FromUnion<TPaths extends string> = Record<TPaths, {}>;
