import {
  ELanguages,
  TLocalizationDescription,
  TLocalizationParams,
  ILocalizationProps,
  TExtractLocalizationParams,
} from "./types";

export class LocalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalizationError";
  }
}

export class Localization {
  public static Language = ELanguages;

  private language: ELanguages;

  constructor(params: TLocalizationParams) {
    this.language = params.language;
  }

  public getLanguage(): ELanguages {
    return this.language || this.getBrowserLanguage();
  }

  public setLanguage(language: ELanguages): void {
    this.language = language;
  }

  public getBrowserLanguage(): ELanguages {
    return (navigator.language || ELanguages.en)
      .substring(0, 2)
      .toLowerCase() as ELanguages;
  }

  public getLocalized<
    L extends TLocalizationDescription,
    P extends ILocalizationProps = TExtractLocalizationParams<L>,
  >(loc: L, props?: P): string {
    if (!loc) {
      throw new LocalizationError("Localization object is not provided");
    }

    const lang = props?.lang || this.getLanguage();

    const locForLang = loc[lang];

    if (!locForLang) {
      throw new LocalizationError("Unsupported language");
    }

    if (typeof locForLang === "function") {
      if (!props) {
        throw new LocalizationError(
          "Additional parameters are not provided for localization",
        );
      }
      return locForLang(props?.templateData);
    }

    return locForLang;
  }
}
