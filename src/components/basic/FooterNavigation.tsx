import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export default function FooterNavigation() {
    const {
      isAtFirstQuestion,
      isAtLastQuestion,
      getQuestionnaire,
      switchToNextQuestion,
      switchToPreviousQuestion,
    } = useContext(QuestionnaireContext);
    const history = useHistory();
    const {t} = useTranslation();

    const goToNext = () => {
      if (isAtLastQuestion()) {
        history.push("/survey-completed");
      } else {
        switchToNextQuestion();
      }
    };

    const goToPrevious = () => {
      switchToPreviousQuestion();
    };

    const noQuestions = getQuestionnaire().activeQuestions().length;
    const noAnsweredQuestions = getQuestionnaire().answeredQuestions().length;

    return (
      <div>
            {noAnsweredQuestions}
            {t('generic.footer.progress.of')}
            {noQuestions}
            {t('generic.footer.progress.answered')}
          <button
            disabled={isAtFirstQuestion()}
            onClick={goToPrevious}>
                previous
          </button>
          <button onClick={goToNext} >
            next
          </button>
      </div>
    );
  }