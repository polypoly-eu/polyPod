import { useContext } from "react";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import PolyButton from "./PolyButton";
import React from "react";
import submitAnswers from "../../server/answer-submission";
import { useHistory } from "react-router-dom";

export default function SubmitSurveyButton({ title, onStart = () => {}, onFinished = () => {} }) {
    const { markQuestionnaireSubmitted } = useContext(QuestionnaireListContext);
    const { getQuestionnaire } = useContext(QuestionnaireContext);
    const history = useHistory();

    return (
        <PolyButton
            title={title}
            onPress={() => {
                onStart();
                submitAnswers(getQuestionnaire())
                    .then(() => {
                        markQuestionnaireSubmitted(getQuestionnaire());
                        onFinished();
                        history.push("/survey-submitted");
                    })
                    .catch((ex) => {
                        try {
                            console.error(ex);
                        } catch (_) {
                            /* do nothing */
                        }
                        // Make sure this is called, as otherwise the Loading screen will not disappear.
                        onFinished();
                        history.push("/survey-error");
                    });
            }}
        />
    );
}
