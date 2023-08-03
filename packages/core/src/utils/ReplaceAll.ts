/**
 * In a given string literal, replace all occurrences of a given pattern with a replacement
 *
 * @param TString The string literal to replace occurrences in
 * @param TMatch The pattern to match
 * @param TReplace The replacement
 */
export type ReplaceAll<
  TString extends string,
  TMatch extends string,
  TReplace extends string
> = TString extends `${infer Prefix}${TMatch}${infer Postfix}`
  ? ReplaceAll<`${Prefix}${TReplace}${Postfix}`, TMatch, TReplace>
  : TString;
