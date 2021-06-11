import * as React from "react";
import { useTranslation } from "react-i18next";
import Questionnaire from "../../questionnaire/PpQuestionnaire";

import "./StatusHeader.css";

export default function StatusHeader ({ questionnaire }: { questionnaire: Questionnaire }) {
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
    const calculateTimeStatus = (distance: number): string => {
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

    const answeredQuestions = Math.round(
        (questionnaire.answeredQuestions().length / questionnaire.questions().length) *
            100
    );

    const QuestionsCompleted = () => {
        if (answeredQuestions === 0){
            return <div>New</div>
        } if (answeredQuestions === 100) {
            return <div>Ready to submit</div>
        }
        else {
            return <div>{answeredQuestions}% completed</div>
        }

    }

    return (
        <header className={answeredQuestions !== 0 && answeredQuestions !== 100 ? "questionnaire-started" : ""}>
            <p className="demo">
                {calculateTimeStatus(
                    new Date(questionnaire.submission_deadline).getTime() - new Date().getTime()
                )}
            </p>
            <QuestionsCompleted />
        </header>
    );
};