"use client";

import { Locale, defaultLocale } from "./config";
import { Namespace, Translations, LanguageDictionary } from "./types";
import { useParams } from "next/navigation";
import { useMemo } from "react";

// Import các dictionary dùng đường dẫn tương đối
import footer_en from "../../locales/en/footer.json";
import header_en from "../../locales/en/header.json";
import footer_vi from "../../locales/vi/footer.json";
import header_vi from "../../locales/vi/header.json";
import home_vi from "../../locales/vi/homePage/home.json";
import home_en from "../../locales/en/homePage/home.json";
import combos_vi from "../../locales/vi/homePage/combos.json";
import combos_en from "../../locales/en/homePage/combos.json";
import about_vi from "../../locales/vi/homePage/about.json";
import about_en from "../../locales/en/homePage/about.json";
import menu_vi from "../../locales/vi/homePage/menu.json";
import menu_en from "../../locales/en/homePage/menu.json";
import myStory_vi from "../../locales/vi/homePage/myStory.json";
import myStory_en from "../../locales/en/homePage/myStory.json";
import favourite_vi from "../../locales/vi/homePage/favourite.json";
import favourite_en from "../../locales/en/homePage/favourite.json";
import callToAction_vi from "../../locales/vi/homePage/callToAction.json";
import callToAction_en from "../../locales/en/homePage/callToAction.json";

//  Dictionary đầy đủ
const dictionaries: LanguageDictionary = {
  en: {
    footer: footer_en,
    header: header_en,
    home: home_en,
    combos: combos_en,
    about: about_en,
    menu: menu_en,
    myStory: myStory_en,
    favourite: favourite_en,
    callToAction: callToAction_en,
  },
  vi: {
    footer: footer_vi,
    header: header_vi,
    home: home_vi,
    combos: combos_vi,
    about: about_vi,
    menu: menu_vi,
    myStory: myStory_vi,
    favourite: favourite_vi,
    callToAction: callToAction_vi,
  },
};

export function useTranslation(ns: Namespace = "footer") {
  const params = useParams();
  const lang: Locale = (params.lang as Locale) || defaultLocale;

  return useMemo(() => {
    const dictionary =
      dictionaries[lang]?.[ns] ?? dictionaries[defaultLocale][ns];

    const t = (
      key: string,
      params?: Record<string, string | number>
    ): string => {
      let value: string | Translations | undefined;
      const keys = key.split(".");
      let current: string | Translations = dictionary;

      for (const k of keys) {
        if (typeof current === "object" && current !== null && k in current) {
          current = current[k];
        } else {
          current = key; // fallback
          break;
        }
      }

      if (typeof current !== "string") {
        current = key;
      }

      value = current as string;

      if (params) {
        for (const [param, paramValue] of Object.entries(params)) {
          value = value.replace(`{{${param}}}`, String(paramValue));
        }
      }

      return value;
    };

    return { t, lang };
  }, [lang, ns]);
}
