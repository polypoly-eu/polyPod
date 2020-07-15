import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
// import ResultsSurveyButton from "../../components/buttons/ResultsSurveyButton";
// import ReviewSurveyButton from "../../components/buttons/ReviewSurveyButton";
// import ContinueSurveyButton from "../../components/buttons/ContinueSurveyButton";
import { Link } from "react-router-dom";
import Layout from "../../../polylook/components/layout";
import { CenteredFooter } from "../../../polylook/components/footer";

function IntroHeader({ questionnaire }) {
  const {t, i18n} = useTranslation();

  return (
    <div className="big-header">
      <p>
        {`${t('intro.survey_by')} `}
        <strong>{t(questionnaire.author.name)}</strong>
      </p>
      <h1>
        {t(questionnaire.title).toUpperCase()}
      </h1>
      <p>
        {`${t('intro.published')}: `}
        <strong>{questionnaire.publishedDateString(i18n.language)}</strong>
      </p>
      <p>
        {`${t('intro.expires')}: `}
        <strong>{questionnaire.submissionDeadlineString(i18n.language)}</strong>
      </p>
    </div>
  );
}

function ActionButtons({ questionnaire }) {
  return <CenteredFooter>
    <StartSurveyButton
      questionnaire = {questionnaire}
      route = "/survey"
    />
  </CenteredFooter>

  /* TODO:
     Depending on isActive, hasAnsweredQuestions, hasResults show:

      <ContinueSurveyButton
        title={t('intro.button.continue')}
        questionnaire={questionnaire}
      />
      <ResultsSurveyButton
        title={t('intro.button.results')}
        questionnaire={questionnaire}
      />
      <ReviewSurveyButton
        title={t('intro.button.view')}
        questionnaire={questionnaire}
      />
   */
}

function Description({ questionnaire }) {
  const {t} = useTranslation();

  return <p>
    {t(questionnaire.description)}
  </p>;
}

function Author({ questionnaire }) {
  const {t} = useTranslation();

  return (
    // TODO onPress={() => navigation.navigate(AuthorDetailsScreenRoute)}>
      <Link to="/intro/authordetails" className="call-out-section">
        <strong>{t(questionnaire.author.name)}</strong>
        <p>{t('intro.author')}</p>
      </Link>
  );
}

function SubmissionDate({ questionnaire }) {
  const {t,i18n} = useTranslation();

  return questionnaire.isSubmitted() ? (
    <div>
      {`${t('intro.submitted')}: `}
        {questionnaire.submittedTimeString(i18n.language)}
    </div>
  ) : null;
}

const IntroScreen = function() {
  const {getQuestionnaire} = useContext(QuestionnaireContext);
  const questionnaire = getQuestionnaire();

  return (
    <Layout header={<IntroHeader questionnaire={questionnaire}/>} footer={<ActionButtons questionnaire={questionnaire}/>}>
      <main>
        <Description questionnaire={questionnaire}/>
        <Author questionnaire={questionnaire}/>
        <SubmissionDate questionnaire={questionnaire}/>
      </main>
    </Layout>
  );
};

export const route = 'Intro';
export default IntroScreen;
