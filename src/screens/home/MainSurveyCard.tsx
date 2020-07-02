import * as React from "react";
import { useTranslation } from 'react-i18next';

//TODO implement questionnaire state
export default function MainSurveyCard({ questionnaire }) {
    const {t, i18n} = useTranslation();

    const title = t(questionnaire.title);
    return <>
      <h1>{title}</h1>
      <em>{questionnaire.submissionDeadlineString(i18n.language)}</em>
    </>;
  }