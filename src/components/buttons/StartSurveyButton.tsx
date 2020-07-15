import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { Link } from "react-router-dom";
import React from "react";
import Questionnaire from "../../questionnaire/PpQuestionnaire";

export default function StartSurveyButton(
    { questionnaire, route }: { questionnaire : Questionnaire, route : string }
) {
    const {setQuestionnaireAndSwitchToFirstUnansweredQuestion} = useContext(
        QuestionnaireContext
    );
    return (
        <Link className="button inverted"
        onClick={() => setQuestionnaireAndSwitchToFirstUnansweredQuestion(questionnaire)}
        to={route}>
            Start
        </Link>
    )
}
