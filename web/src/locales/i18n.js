import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from "moment";

import TRANSLATIONS_ES_MAIN from "./es/translations.json";
import TRANSLATIONS_EN_MAIN from "./en/translations.json";
import TRANSLATIONS_PT_BR_MAIN from "./pt_br/translations.json";

import TRANSLATIONS_ES_USER from "../modules/User/locales/es/translations.json";
import TRANSLATIONS_EN_USER from "../modules/User/locales/en/translations.json";
import TRANSLATIONS_PT_BR_USER from "../modules/User/locales/pt_br/translations.json";

// A internacionalização desse sistema foi baseada no artigo abaixo:
// https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next/

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        returnEmptyString: false,
        resources: {
            // Para adicionar arquivos de outros módulos, faça
            // por exemplo: { ...TRANSLATIONS_EN_MODULE, ...TRANSLATIONS_EN_USER } 
            en: {
                translation: { ...TRANSLATIONS_EN_MAIN, ...TRANSLATIONS_EN_USER }

            },
            es: {
                translation: { ...TRANSLATIONS_ES_MAIN, ...TRANSLATIONS_ES_USER }
            },
            pt_br: {
                translation: { ...TRANSLATIONS_PT_BR_MAIN, ...TRANSLATIONS_PT_BR_USER }
            }
        }
    });
i18n.init({
    interpolation: {
        format: function (value, format, lng) {
            if (value instanceof Date) {
                return moment(value).format(format);
            }
            if (typeof value === "number") {
                return new Intl.NumberFormat().format(value);
            }
            return value;
        }
    }
});

// O idioma de preferência do usuário é setado em: src/stores/main.js

export { i18n };