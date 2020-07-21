import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import React from "react";
import QuestionCard from "./QuestionCard";
import NextButton from "../buttons/NextButton";
import PolyRange from "../basic/PolyRange";

export default function RangeQuestion({ index, question }) {
    const { getQuestionnaire } = useContext(QuestionnaireContext);
    const { saveQuestionnaireAnswers } = useContext(QuestionnaireListContext);

    return (
        <QuestionCard
            index={index}
            question={question.description()}
            instruction={question.explanation()}
            AnswerComponent={() => (
                <PolyRange
                    options={question.values()}
                    checked={(option) => option === question.value()}
                    limits={question.labels}
                    onChecked={(checkbox) => {
                        if (checkbox.checked) {
                            question.setValue(checkbox.item);
                        } else {
                            question.setValue(null);
                        }
                        saveQuestionnaireAnswers(getQuestionnaire());
                    }}
                />
            )}
            AcceptComponent={() => <NextButton />}
        />
    );
}
