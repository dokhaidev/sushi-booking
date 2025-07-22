import { Locale } from "./config";

export type Translations = {
  [key: string]: string | Translations;
};

export type TranslateFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

export type Namespace =
  | "footer"
  | "header"
  | "home"
  | "combos"
  | "about"
  | "menu"
  | "myStory"
  | "favourite"
  | "callToAction"
  | "product"
  | "aboutHero"
  | "introduction"
  | "history"
  | "philosophy"
  | "chefs"
  | "restaurant"
  | "core"
  | "contactHero"
  | "contactInfo"
  | "contactFAQ"
  | "contactTestimonials"
  | "contactMap"
  | "loginPage"
<<<<<<< HEAD
  | "register"
  | "reservation"
  | "orderSummary";

=======
  | "register";
>>>>>>> 8771f3ca2b021c2908e8bbdc0fb8ed7197c48b72

export type NamespacedTranslations = Record<Namespace, Translations>;

export type LanguageDictionary = Record<Locale, NamespacedTranslations>;
