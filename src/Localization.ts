import { capitalize } from "./utils";
import {
  LocalizationConfig,
  LocaleRecord,
  PluralForms,
  ExtractParams,
  BaseParams,
  LocaleValue,
} from "./types";

class LocalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalizationError";
  }
}

type ValidateExactKeys<T, K extends readonly string[]> = Exclude<keyof T, K[number]> extends never
  ? K[number] extends keyof T
    ? T
    : never
  : never;

export class Localization<Langs extends string = string> {
  private config: LocalizationConfig<Langs>;
  private currentLanguage: Langs;
  private pluralRules: Record<Langs, (count: number) => keyof PluralForms>;

  constructor(config: LocalizationConfig<Langs>, language: Langs) {
    this.config = config;
    this.currentLanguage = language;

    this.pluralRules = {
      ...this.getDefaultPluralRules(),
      ...config.pluralRules,
    } as Record<Langs, (count: number) => keyof PluralForms>;
  }

  private getDefaultPluralRules(): Partial<
    Record<Langs, (count: number) => keyof PluralForms>
  > {
    return {
      en: (count) => (count === 1 ? "one" : "other"),
      ru: (count) => {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod100 >= 11 && mod100 <= 19) return "many";
        switch (mod10) {
          case 1:
            return "one";
          case 2:
          case 3:
          case 4:
            return "few";
          default:
            return "many";
        }
      },
    } as Partial<Record<Langs, (count: number) => keyof PluralForms>>;
  }

  private getPluralForm(count: number, pluralObj: PluralForms): string {
    const absoluteCount = Math.abs(count);
    const rule = this.pluralRules[this.currentLanguage];

    if (!rule) {
      console.warn(
        `No plural rules found for language ${this.currentLanguage}, using 'other'`,
      );
      return pluralObj.other;
    }

    const form = rule(absoluteCount);
    const result = pluralObj[form];

    if (!result) {
      console.warn(
        `Plural form '${form}' not found for language ${this.currentLanguage}, falling back to 'other'`,
      );
      return pluralObj.other;
    }

    return result;
  }

  private resolveValue(value: LocaleValue, params?: any): string {
    if (typeof value === "function") {
      return value(params?.templateData);
    }

    if (typeof value === "object" && "one" in value && "other" in value) {
      if (!params || typeof params.count !== "number") {
        throw new LocalizationError(`Count parameter required for plural form`);
      }
      return this.getPluralForm(params.count, value);
    }

    return value;
  }

  getLocalized<T extends Partial<Record<Langs, LocaleValue>>>(
    localeObj: ValidateExactKeys<T, readonly Langs[]>,
    params?: ExtractParams<ValidateExactKeys<T, readonly Langs[]>, Langs>,
  ): string {
    if (!localeObj) {
      throw new LocalizationError("Locale object is required");
    }

    const lang =
      (params as BaseParams<Langs> | undefined)?.lang || this.currentLanguage;

    if (!this.config.languages.includes(lang)) {
      console.warn(`Language "${lang}" not supported, falling back to default`);
      const fallbackLang = this.config.defaultLanguage;

      if (!localeObj[fallbackLang]) {
        throw new LocalizationError(
          `No translation found for language ${lang} or default ${fallbackLang}`,
        );
      }
      return this.resolveValue(localeObj[fallbackLang], params);
    }

    const value = localeObj[lang];

    if (!value) {
      throw new LocalizationError(`No translation found for language ${lang}`);
    }

    let result = this.resolveValue(value, params);

    if ((params as BaseParams<Langs> | undefined)?.capitalized) {
      result = capitalize(result);
    }

    return result;
  }

  setLanguage(language: Langs): void {
    if (!this.config.languages.includes(language)) {
      throw new LocalizationError(`Language ${language} is not supported`);
    }
    this.currentLanguage = language;
  }

  getLanguage(): Langs {
    return this.currentLanguage;
  }

  getBrowserLanguage(): Langs | null {
    const browserLang = (navigator.language || "")
      .substring(0, 2)
      .toLowerCase();
    const matchedLang = this.config.languages.find(
      (lang) => lang.toLowerCase() === browserLang,
    );
    return matchedLang || null;
  }
}
