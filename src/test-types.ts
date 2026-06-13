import { Localization } from "./Localization";
import { LocalizationConfig } from "./types";

const LANGUAGES = ["ru", "en"] as const;
type TLanguages = (typeof LANGUAGES)[number];

const fakeLoc = {
  ger: "1",
  ru: "123",
  en: "dwdw",
};

const fakeLoc1 = {
  en: "dwdw",
};

const correctLoc = {
  ru: "123",
  en: "456",
};

const localizationConfig: LocalizationConfig<TLanguages> = {
  languages: LANGUAGES,
  defaultLanguage: "ru",
};

const loc = new Localization(localizationConfig, "ru");

// Это должно вызвать ошибку типизации - передаем объект с ключами, которых нет в LANGUAGES
loc.getLocalized(fakeLoc);

// Это должно вызвать ошибку типизации - передаем объект с ключами, который не соответсвует LANGUAGES
loc.getLocalized(fakeLoc1);

// Это должно работать без ошибок
loc.getLocalized(correctLoc);
