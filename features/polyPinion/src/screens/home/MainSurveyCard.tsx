import * as React from "react";
import { useTranslation } from "react-i18next";
import StatusHeader from "./StatusHeader";
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
import InfoButton from "../../components/buttons/InfoButton";
import Questionnaire from "../../questionnaire/PpQuestionnaire";

import "./MainSurveyCard.css";

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
