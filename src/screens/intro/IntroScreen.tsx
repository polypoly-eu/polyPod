import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
import ResultsSurveyButton from "../../components/buttons/ResultsSurveyButton";
import ReviewSurveyButton from "../../components/buttons/ReviewSurveyButton";
import ContinueSurveyButton from "../../components/buttons/ContinueSurveyButton";

const IntroScreen = function() {
    const {t, i18n} = useTranslation();
    const {getQuestionnaire} = useContext(QuestionnaireContext);
    const questionnaire = getQuestionnaire();

    const getDetails = () => {
      return (
        <div >
            {`${t('intro.survey_by')} `}
            {t(questionnaire.author.name)}
            {t(questionnaire.title).toUpperCase()}
            {`${t('intro.published')}: `}
            {questionnaire.publishedDateString(i18n.language)}
            {`${t('intro.expires')}: `}
            {questionnaire.submissionDeadlineString(i18n.language)}
        </div>
      );
    };

    const getAuthor = () => {
      return (
          // TODO onPress={() => navigation.navigate(AuthorDetailsScreenRoute)}>
          <div>
              {t(questionnaire.author.name)}
              {t('intro.author')}
          </div>
      );
    };

    const getActionButtons = () => {
      return /* questionnaire.isActive()*/ true ? (
        questionnaire.hasAnsweredQuestions() ? (
          createContinueSurveyButton()
        ) : (
          createSurveyButton()
        )
      ) : questionnaire.hasResult() ? (
        <>
          {createResultsSurveyButton()}
          {createReviewSurveyButton()}
        </>
      ) : (
        createReviewSurveyButton()
      );
    };

    const createResultsSurveyButton = () => (
      <ResultsSurveyButton
        title={t('intro.button.results')}
        questionnaire={questionnaire}
      />
    );

    const createReviewSurveyButton = () => (
      <ReviewSurveyButton
        title={t('intro.button.view')}
        questionnaire={questionnaire}
      />
    );

    const createContinueSurveyButton = () => (
      <ContinueSurveyButton
        title={t('intro.button.continue')}
        questionnaire={questionnaire}
      />
    );

    const createSurveyButton = () => (
      <StartSurveyButton
        questionnaire = {questionnaire}
        route = "/survey"
      />
    );

    const createSubmittedDate = () => {
      return (
        <div>
          {`${t('intro.submitted')}: `}
            {questionnaire.submittedTimeString(i18n.language)}
        </div>
      );
    };

    return (

        <div>
          {getDetails()}
            {t(questionnaire.description)}
          {getAuthor()}
            {questionnaire.isSubmitted() && createSubmittedDate()}
            {getActionButtons()}
          </div>
    );
  };

  export const route = 'Intro';
  export default IntroScreen;