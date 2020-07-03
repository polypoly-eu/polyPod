import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import React from "react";
import MultipleChoiceQuestion from "../../components/cards/MultipleChoiceQuestion";


export default function QuestionScreen() {
    const {currentQuestion} = useContext(QuestionnaireContext);

    if (!currentQuestion) {
      return <div />;
    }


    const components = {
        //TextQuestion: TextQuestion,
        MultipleChoiceQuestion: MultipleChoiceQuestion,
        //RangeQuestion: RangeQuestion,
    };

    const Card = components[currentQuestion.screen()];

    return <Card index={currentQuestion.index} question={currentQuestion} />
};