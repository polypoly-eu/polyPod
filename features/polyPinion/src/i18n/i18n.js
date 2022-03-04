import React from "react";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import resources from "./all.js";
import { determineLanguage } from "@polypoly-eu/silly-i18n";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        debug: false,
        resources: resources,
        lng: determineLanguage(),
        fallbackLng: "en",

        interpolation: {
            escapeValue: false,
        },
    });

export { i18n };
