import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import React from "react";


export default function QuestionScreen() {
    const {currentQuestion} = useContext(QuestionnaireContext);

    if (!currentQuestion) {
      return <div />;
    }


    return (
      <div>{currentQuestion.description()}</div>
    );
  };