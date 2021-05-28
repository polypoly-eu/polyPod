import ActiveSurveys from "./ActiveSurveys";
import React from "react";
import { useTranslation } from "react-i18next";
import "./HomeScreen.css";

export default function HomeScreen() {
    const { t } = useTranslation();
    return (
        <main className="home">
            <ActiveSurveys />
            <div className="new-surveys-area">
                <button className="new-surveys" >{t("home.notification.title")}</button>
            </div>
        </main>
    );
}
