import ActiveSurveys from "./ActiveSurveys";
import React from "react";
import { useTranslation } from "react-i18next";
import "./HomeScreen.css";

export default function HomeScreen() {
    const { t } = useTranslation();
    return (
        <main className="home">
            <ActiveSurveys />
            <button>{t("home.notification.title")}</button>
        </main>
    );
}
