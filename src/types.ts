export type PluralForms = {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

export type LocaleValue<T = any> = string | ((data: T) => string) | PluralForms;

export type LocaleRecord<Langs extends string, T = any> = {
  [K in Langs]: LocaleValue<T>;
};

export interface BaseParams<Langs extends string> {
  capitalized?: boolean;
  lang?: Langs;
}

export interface StringParams<Langs extends string> extends BaseParams<Langs> {}

export interface FunctionParams<
  T,
  Langs extends string,
> extends BaseParams<Langs> {
  templateData: T;
}

export interface PluralParams<Langs extends string> extends BaseParams<Langs> {
  count: number;
}

export type ExtractParams<
  L extends LocaleRecord<string, any>,
  Langs extends string,
> = {
  [K in keyof L]: L[K] extends string
    ? StringParams<Langs>
    : L[K] extends (...args: infer P) => string
      ? FunctionParams<P[0], Langs>
      : L[K] extends PluralForms
        ? PluralParams<Langs>
        : never;
}[keyof L];

export interface LocalizationConfig<Langs extends string> {
  languages: readonly Langs[];
  defaultLanguage: Langs;
  pluralRules?: Partial<Record<Langs, (count: number) => keyof PluralForms>>;
}
