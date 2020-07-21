import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import QuestionCard from "./QuestionCard";
import React from "react";
import PolyCheckboxGroup from "../basic/PolyCheckboxGroup";
import NextButton from "../buttons/NextButton";

export default function MultipleChoiceQuestion({ index, question }) {
    const { getQuestionnaire } = useContext(QuestionnaireContext);
    const { saveQuestionnaireAnswers } = useContext(QuestionnaireListContext);

    return (
        <QuestionCard
            index={index}
            question={question.description()}
            instruction={question.explanation()}
            AnswerComponent={() => (
                <PolyCheckboxGroup
                    detoxindex={index}
                    options={question.choices()}
                    label={(choice) => choice.value()}
                    value={(choice) => choice.id}
                    checked={(choice) => choice.isSelected()}
                    disabled={(choice) => !choice.enabled}
                    onChecked={(checkbox) => {
                        checkbox.item.selected(checkbox.checked);
                        saveQuestionnaireAnswers(getQuestionnaire());
                        // notifyUpdated() is required to re-render the UI and checkbox states

                        // triggerUpdate();
                    }}
                />
            )}
            AcceptComponent={() => <NextButton />}
        />
    );
}
