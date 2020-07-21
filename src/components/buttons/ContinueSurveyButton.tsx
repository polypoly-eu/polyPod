import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import PolyButton from "./PolyButton";
import { useHistory } from "react-router-dom";

export default function ContinueSurveyButton({ title = "generic.button.continue", questionnaire }) {
    const history = useHistory();
    const { setQuestionnaire, setQuestionnaireAndSwitchToFirstUnansweredQuestion } = useContext(
        QuestionnaireContext
    );

    const answeredAmount = questionnaire.answeredQuestions().length;
    const totalAmount = questionnaire.activeQuestions().length;

    return (
        <PolyButton
            title={title}
            onPress={() => {
                if (answeredAmount < totalAmount) {
                    setQuestionnaireAndSwitchToFirstUnansweredQuestion(questionnaire);
                    history.push("/survey");
                } else {
                    setQuestionnaire(questionnaire);
                    history.push("/survey-completed");
                }
            }}
        />
    );
}
