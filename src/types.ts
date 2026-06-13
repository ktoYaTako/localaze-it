export enum ELanguages {
  ru = "ru",
  en = "en",
}

interface ICommonLocParams {
  lang?: ELanguages;
}

interface ITemplateLocParams<T> extends ICommonLocParams {
  templateData?: T;
}

export type TExtractLocalizationParams<T extends TLocalizationDescription> =
  T extends {
    [K in ELanguages]: (...args: infer P) => string;
  }
    ? ITemplateLocParams<P[0]>
    : ICommonLocParams;

export type TLocalizationFunctionalDescription = (
  ...args: any[]
) => string;

export type TLocalizationDescription = {
  [K in ELanguages]: string | TLocalizationFunctionalDescription;
};

export type TLocalizationParams = {
  language: ELanguages;
};

export interface ILocalizationProps
  extends Partial<ITemplateLocParams<unknown>> {}
