import React, { createContext, useContext, ReactNode } from "react";
import { Localization } from "./Localization";
import { LocalizationConfig } from "./types";

export const LocalizationContext = createContext<Localization<any> | null>(
  null,
);

export function LocalizationProvider<Langs extends string>({
  config,
  initialLanguage,
  children,
}: {
  config: LocalizationConfig<Langs>;
  initialLanguage: Langs;
  children: ReactNode;
}) {
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

  return context;
}
