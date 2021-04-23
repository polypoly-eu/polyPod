import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import PolyButton from "./PolyButton";
import React from "react";
import { useHistory } from "react-router-dom";

export default function NextButton() {
    const { isAtLastQuestion, switchToNextQuestion } = useContext(QuestionnaireContext);
    const { triggerUpdate } = useContext(QuestionnaireListContext);

    const history = useHistory();

    return (
        <PolyButton
            title="generic.button.okay"
            inverted
            onPress={() => {
                triggerUpdate();
                if (isAtLastQuestion()) {
                    history.push("/survey-completed");
                } else {
                    switchToNextQuestion();
                }
            }}
        />
    );
}
