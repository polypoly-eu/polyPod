import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import QuestionCard from "./QuestionCard";
import React from "react";
import NextButton from "../buttons/NextButton";
import PolyTextInput from "../basic/PolyTextInput";

export default function TextQuestion({index, question}) {
    const {getQuestionnaire} = useContext(QuestionnaireContext);
    const {saveQuestionnaireAnswers, triggerUpdate} = useContext(
        QuestionnaireListContext,
    );

    return (
        <QuestionCard
            index={index}
            question={question.description()}
            instruction={question.explanation()}
            AnswerComponent={() => (
                <PolyTextInput
                    initialText={question.answer()}
                    maxLength={question.maxLength}
                    multiline={question.multiline}
                    numberOfLines={question.numberOfLines}
                    oneWord={question.oneWordValidation}
                    onChangeText={text => {
                        question.setAnswer(text);
                        saveQuestionnaireAnswers(getQuestionnaire());
                        // we should not notifyUpdated() here,
                        // otherwise the component will be re-rendered and keyboard will hide
                    }}
                />
            )}
            AcceptComponent={() => <NextButton />}
        />
    );
}