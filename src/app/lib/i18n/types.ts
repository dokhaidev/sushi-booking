import { Locale } from "./config";

export type Translations = {
  [key: string]: string | Translations;
};

export type Namespace =
  | "footer"
  | "header"
  | "home"
  | "combos"
  | "about"
  | "menu"
  | "myStory"
  | "favourite"
  | "callToAction";

export type NamespacedTranslations = Record<Namespace, Translations>;

export type LanguageDictionary = Record<Locale, NamespacedTranslations>;
