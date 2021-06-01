import * as React from "react";
import { useTranslation } from "react-i18next";
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
import InfoButton from "../../components/buttons/InfoButton";
import Questionnaire from "../../questionnaire/PpQuestionnaire";

import "./MainSurveyCard.css";

const StatusHeader = ({ questionnaire }: { questionnaire: Questionnaire }) => {
    const { t } = useTranslation();

    const msConv = {
        day: 86400000,
        hour: 3600000,
        minute: 60000,
    };

    const timeStatus = {
        expired: t("home.tabs.expired"),
        day: (ms: number) => ms / msConv["day"],
        hour: (ms: number) => ms / msConv["hour"],
        minute: (ms: number) => ms / msConv["minute"],
    };

    //This needs test coverage
    const calculateTimeStatus = (distance: number): String => {
        if (distance < 0) return timeStatus.expired;

        const day = Math.floor(timeStatus.day(distance));
        if (day >= 1)
            return `${day} ${day == 1 ? t("general.time.day.one") : t("general.time.day.many")}`;

        const hour = Math.floor(timeStatus.hour(distance));
        if (hour >= 1)
            return `${hour} ${
                hour == 1 ? t("general.time.hour.one") : t("general.time.hour.many")
            }`;

        const minute = Math.floor(timeStatus.minute(distance));
        if (minute >= 1)
            return `${minute} ${
                minute == 1 ? t("general.time.minute.one") : t("general.time.minute.many")
            }`;

        return timeStatus.expired;
    };

    return (
        <header>
            <p className="demo">
                {calculateTimeStatus(
                    new Date(questionnaire.submission_deadline).getTime() - new Date().getTime()
                )}
            </p>
            <div>
                {Math.round(
                    (questionnaire.answeredQuestions().length / questionnaire.questions().length) *
                        100
                )}
                % completed
            </div>
        </header>
    );
};

export default function MainSurveyCard({ questionnaire }: { questionnaire: Questionnaire }) {
    const { t } = useTranslation();

    const title = t(questionnaire.title);

    return (
        <section className="card">
            <StatusHeader questionnaire={questionnaire} />
            <main>
                <h1 className="card-title">{title}</h1>
                <div className="btn-container">
                    <InfoButton />
                    <StartSurveyButton questionnaire={questionnaire} route="/intro" />
                </div>
            </main>
        </section>
    );
}
