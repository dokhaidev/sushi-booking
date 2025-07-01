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

//  Dictionary đầy đủ
const dictionaries: LanguageDictionary = {
  en: {
    footer: footer_en,
    header: header_en,
  },
  vi: {
    footer: footer_vi,
    header: header_vi,
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
