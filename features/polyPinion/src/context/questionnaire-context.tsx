import React, { createContext, useState } from "react";

import Questionnaire from "../questionnaire/PpQuestionnaire";
import Question from "../questionnaire/PpQuestion";

export const QuestionnaireContext = createContext<{
    questionnaireHolder: QuestionnaireHolder;
    currentQuestion: Question;
    getQuestionnaire: () => Questionnaire;
    setQuestionnaire: (newQuestionnaire: Questionnaire) => void;
    isFirstQuestion: (question: Question) => boolean;
    isAtFirstQuestion: () => boolean;
    isLastQuestion: (question: Question) => boolean;
    isAtLastQuestion: () => boolean;
    notifyUpdated: () => void;
    switchToNextQuestion: () => void;
    switchToPreviousQuestion: () => void;
    switchToFirstQuestion: () => void;
    setQuestionnaireAndSwitchToFirstUnansweredQuestion: (questionnaire: Questionnaire) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

class QuestionnaireHolder {
    private _questionnaire: Questionnaire;
    constructor(questionnaire: Questionnaire) {
        this._questionnaire = questionnaire;
    }

    copy() {
        return new QuestionnaireHolder(this.questionnaire);
    }
    copyWith(newQuestionnaire: Questionnaire) {
        return new QuestionnaireHolder(newQuestionnaire);
    }

    get questionnaire() {
        return this._questionnaire;
    }
}

const INITIAL_VALUE = new QuestionnaireHolder(new Questionnaire());

export const QuestionnaireProvider: React.FC = ({ children }) => {
    const [questionnaireHolder, setQuestionnaireHolder] = useState(INITIAL_VALUE);
    const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>();

    const switchToNextQuestion = () => {
        const nextQuestion = getQuestionnaire().activeQuestionAfter(currentQuestion);
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
        }
    };

    const switchToPreviousQuestion = () => {
        const previousQuestion = getQuestionnaire().activeQuestionBefore(currentQuestion);
        if (previousQuestion) {
            setCurrentQuestion(previousQuestion);
        }
    };

    const switchToFirstQuestion = () => {
        const firstQuestion = getQuestionnaire().firstActiveQuestion();
        if (firstQuestion) {
            setCurrentQuestion(firstQuestion);
        }
    };

    const setQuestionnaireAndSwitchToFirstUnansweredQuestion = (questionnaire: Questionnaire) => {
        setQuestionnaire(questionnaire);
        const unansweredQuestion = questionnaire.firstUnansweredQuestion();
        if (unansweredQuestion) {
            setCurrentQuestion(unansweredQuestion);
        }
    };

    /**
     * @returns {PpQuestionnaire} - the underlying Questionnaire model
     */
    const getQuestionnaire = () => questionnaireHolder.questionnaire;

    const setQuestionnaire = (newQuestionnaire: Questionnaire) => {
        setQuestionnaireHolder(questionnaireHolder.copyWith(newQuestionnaire));
    };

    /**
     * Let React know that the questionnaire changed,
     * this will trigger re-rendering of all components
     * that use this content
     */
    const notifyUpdated = () => {
        setQuestionnaireHolder(questionnaireHolder.copy());
    };

    /**
     * Return true if a given question is the first question
     * @param question
     * @returns {boolean}
     */
    const isFirstQuestion = (question: Question) => {
        return getQuestionnaire().isFirstQuestion(question);
    };

    /**
     * Return true if a given question is the last question
     * @param question
     * @returns {boolean}
     */
    const isLastQuestion = (question: Question) => {
        return getQuestionnaire().isLastQuestion(question);
    };

    /**
     * Return true if we are currently at the first question
     * @returns {boolean}
     */
    const isAtFirstQuestion = () => {
        return !currentQuestion || isFirstQuestion(currentQuestion);
    };

    /**
     * Return true if we are currently at the first question
     * @returns {boolean}
     */
    const isAtLastQuestion = () => {
        return currentQuestion && isLastQuestion(currentQuestion);
    };

    return (
        <QuestionnaireContext.Provider
            value={{
                questionnaireHolder,
                currentQuestion,
                getQuestionnaire,
                setQuestionnaire,
                isFirstQuestion,
                isAtFirstQuestion,
                isLastQuestion,
                isAtLastQuestion,
                notifyUpdated,
                switchToNextQuestion,
                switchToPreviousQuestion,
                switchToFirstQuestion,
                setQuestionnaireAndSwitchToFirstUnansweredQuestion,
            }}
        >
            {children}
        </QuestionnaireContext.Provider>
    );
};
