import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

function QuestionnaireProgress({ questionnaire }) {
    const { t } = useTranslation();

    const numberOfQuestions = questionnaire.activeQuestions().length;
    const numberOfAnsweredQuestions = questionnaire.answeredQuestions().length;

    return (
        <div className="questionnaire-progress">
            <div>
                <strong>{numberOfAnsweredQuestions}</strong>
                {` ${t("generic.footer.progress.of")} `}
                <strong>{numberOfQuestions}</strong>
                {` ${t("generic.footer.progress.answered")} `}
            </div>
            <progress max={numberOfQuestions} value={numberOfAnsweredQuestions} />
        </div>
    );
}

export default function FooterNavigation() {
    const {
        isAtFirstQuestion,
        isAtLastQuestion,
        getQuestionnaire,
        switchToNextQuestion,
        switchToPreviousQuestion,
    } = useContext(QuestionnaireContext);
    const history = useHistory();

    const goToNext = () => {
        if (isAtLastQuestion()) {
            history.push("/survey-completed");
        } else {
            switchToNextQuestion();
        }
    };

    return (
        <div className="questionnaire-footer">
            <QuestionnaireProgress questionnaire={getQuestionnaire()} />
            <button
                className="alt"
                disabled={isAtFirstQuestion()}
                onClick={switchToPreviousQuestion}
            >
                <img src="./icons/chevron.svg" alt="previous" className="chevron-up" />
            </button>
            <button onClick={goToNext} className="alt">
                <img src="./icons/chevron.svg" alt="next" className="chevron-down" />
            </button>
        </div>
    );
}
