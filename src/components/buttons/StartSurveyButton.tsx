import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { Link } from "react-router-dom";
import React from "react";



export default function StartSurveyButton({questionnaire,
}) {
    //@ts-ignore
    const {setQuestionnaireAndSwitchToFirstUnansweredQuestion} = useContext(
        QuestionnaireContext
      );
      return <Link onClick={() => {
        setQuestionnaireAndSwitchToFirstUnansweredQuestion(questionnaire);}} to="/survey">Start Survey</Link>
}