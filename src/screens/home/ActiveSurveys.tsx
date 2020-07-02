import * as React from "react";
import { useTranslation } from 'react-i18next';
import MainSurveyCard from './MainSurveyCard';
import { QuestionnaireListContext, QuestionnaireListProvider } from '../../context/questionnaire-list-context';


export default function ActiveSurveys() {
    const {questionnaireList} = React.useContext(QuestionnaireListContext);
    const {t} = useTranslation();

    const activeQuestionnaire = questionnaireList; //.filter(questionnaire =>
                                                   //questionnaire.isActive(),
                                                  //);

    return <ul>
      {activeQuestionnaire.map(questionnaire => <li key={questionnaire.id}><MainSurveyCard questionnaire={questionnaire}/></li>)}
    </ul>
  }