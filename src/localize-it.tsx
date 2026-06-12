import React, { createContext, useContext, ReactNode } from "react";
import { Localization } from "./Localization";
import { LocalizationConfig } from "./types";

export const LocalizationContext = createContext<Localization<any> | null>(
  null,
);

interface LocalizationProviderProps<Langs extends string> {
  config: LocalizationConfig<Langs>;
  initialLanguage: Langs;
  children: ReactNode;
}

export function LocalizationProvider<Langs extends string>({
  config,
  initialLanguage,
  children,
}: LocalizationProviderProps<Langs>) {
  const [localization] = React.useState(
    () => new Localization(config, initialLanguage),
  );

  return (
    <LocalizationContext.Provider value={localization}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization<Langs extends string>(): Localization<Langs> {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }

  return context as Localization<Langs>;
}
