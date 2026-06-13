import { ELanguages, Localization } from "./index";

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

const loc = new Localization({ language: ELanguages.ru });

loc.getLocalized(fakeLoc);
loc.getLocalized(fakeLoc1);
loc.getLocalized(correctLoc);
