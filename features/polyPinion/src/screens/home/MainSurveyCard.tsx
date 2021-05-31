import * as React from "react";
import { useTranslation } from "react-i18next";
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
import InfoButton from "../../components/buttons/InfoButton"
import Questionnaire from "../../questionnaire/PpQuestionnaire";

import "./MainSurveyCard.css";

export default function MainSurveyCard({ questionnaire }: { questionnaire: Questionnaire }) {
    const { t, i18n } = useTranslation();

    const title = t(questionnaire.title);

    let countdownDate = new Date(questionnaire.submissionDeadlineString(i18n.language)).getTime();

    const countdown = () => {
        let now = new Date().getTime();
        let distance = countdownDate - now;

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        document.querySelector(".demo").innerHTML = days + "day " + hours + "hours "
        + minutes + "minutes ";

        if (distance < 0) {
            clearInterval(distance);
            document.querySelector(".demo").innerHTML = "Expired";
          }
    };

    setInterval(countdown, 1000);
    



    return (
        <section className="card">
            <header>
            {/* <p>
                {t("home.message")}
                <strong> {questionnaire.submissionDeadlineString(i18n.language)}</strong>
            </p> */}
            <p className="demo"></p>

                <div>{questionnaire.answeredQuestions().length} of {questionnaire.questions().length}</div>
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
