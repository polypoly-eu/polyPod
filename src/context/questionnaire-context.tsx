import React, {createContext, useState} from 'react';

import Questionnaire from '../questionnaire/PpQuestionnaire';

export const QuestionnaireContext = createContext({});

class QuestionnaireHolder {
  private _questionnaire: any;
  constructor(questionnaire) {
    this._questionnaire = questionnaire;
  }

  copy() {
    return new QuestionnaireHolder(this.questionnaire);
  }
  copyWith(newQuestionnaire) {
    return new QuestionnaireHolder(newQuestionnaire);
  }

  get questionnaire() {
    return this._questionnaire;
  }
}

const INITIAL_VALUE = new QuestionnaireHolder(new Questionnaire());

export const QuestionnaireProvider = ({children}) => {
  const [questionnaireHolder, setQuestionnaireHolder] = useState(INITIAL_VALUE);
  const [currentQuestion, setCurrentQuestion] = useState();

  const switchToNextQuestion = () => {
    const nextQuestion = getQuestionnaire().activeQuestionAfter(
      currentQuestion,
    );
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    }
  };

  const switchToPreviousQuestion = () => {
    const previousQuestion = getQuestionnaire().activeQuestionBefore(
      currentQuestion,
    );
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

  const setQuestionnaireAndSwitchToFirstUnansweredQuestion = questionnaire => {
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

  const setQuestionnaire = newQuestionnaire => {
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
  const isFirstQuestion = question => {
    return getQuestionnaire().isFirstQuestion(question);
  };

  /**
   * Return true if a given question is the last question
   * @param question
   * @returns {boolean}
   */
  const isLastQuestion = question => {
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
      }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
