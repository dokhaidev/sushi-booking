import { Locale } from "./config";

export type Translations = {
  [key: string]: string | Translations;
};

export type Namespace = "footer" | "header";

export type NamespacedTranslations = Record<Namespace, Translations>;

export type LanguageDictionary = Record<Locale, NamespacedTranslations>;
