import React, { createContext, useContext, ReactNode } from "react";
import { Localization } from "./Localization";
import { ELanguages } from "./types";

export const LocalizationContext = createContext<Localization | null>(null);

export function LocalizationProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: ELanguages;
  children: ReactNode;
}) {
  const [localization] = React.useState(
    () => new Localization({ language: initialLanguage }),
  );

  return (
    <LocalizationContext.Provider value={localization}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization(): Localization {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }

  return context;
}
