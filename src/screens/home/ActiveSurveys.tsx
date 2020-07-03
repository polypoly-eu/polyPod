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

    // TODO: Adjust the link targets
    return <main>
      <nav className="tabs">
        <ul>
          <li className="tabs-active"><a href="/">Featured</a></li>
          <li><a href="/">Übermittelt</a></li>
          <li><a href="/">Abgelaufen</a></li>
        </ul>
      </nav>
      {activeQuestionnaire.map(questionnaire => <MainSurveyCard key={questionnaire.id} questionnaire={questionnaire}/>)}
    </main>
  }
