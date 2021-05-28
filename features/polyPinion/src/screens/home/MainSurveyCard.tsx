import * as React from "react";
import { useTranslation } from "react-i18next";
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
import InfoButton from "../../components/buttons/InfoButton"
import Questionnaire from "../../questionnaire/PpQuestionnaire";

import "./MainSurveyCard.css";

//TODO implement questionnaire state
export default function MainSurveyCard({ questionnaire }: { questionnaire: Questionnaire }) {
    const { t, i18n } = useTranslation();

    const title = t(questionnaire.title);
    return (
        <section className="card">
            <header>
            <p>
                    {t("home.message")}
                    <strong> {questionnaire.submissionDeadlineString(i18n.language)}</strong>
                </p>
            </header>
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
