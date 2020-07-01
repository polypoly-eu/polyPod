import * as React from "react";
import * as ReactDOM from "react-dom";
import { useTranslation } from 'react-i18next';
import { downloadActiveQuestionnairesMetadata } from "./server/questionnaire-download";
import { QuestionnaireListContext, QuestionnaireListProvider } from './context/questionnaire-list-context';

function MainQuestionnaireCard({ questionnaire }) {
  const {t, i18n} = useTranslation();

  const title = t(questionnaire.title);
  return <>
    <h1>{title}</h1>
    <em>{questionnaire.submissionDeadlineString(i18n.language)}</em>
  </>;
}

function ActiveSurveys() {
  // @ts-ignore
  const {questionnaireList} = React.useContext(QuestionnaireListContext);
  const {t} = useTranslation();

  const activeQuestionnaire = questionnaireList; //.filter(questionnaire =>
                                                 //questionnaire.isActive(),
                                                //);

  return <ul>
    {activeQuestionnaire.map(questionnaire => <li key={questionnaire.id}><MainQuestionnaireCard questionnaire={questionnaire}/></li>)}
  </ul>
}

function UpdateQuestionnaireButton() {
  // @ts-ignore
  const { updateStoredQuestionnaires } = React.useContext(QuestionnaireListContext);

  return <button onClick={() => updateStoredQuestionnaires()}>Refresh</button>;
}

const view = (
  <QuestionnaireListProvider>
    <ActiveSurveys/>
    <UpdateQuestionnaireButton/>
  </QuestionnaireListProvider>
);

ReactDOM.render(
  view,
  document.getElementById("feature")
);

(async function() {
	let result = await downloadActiveQuestionnairesMetadata();
	console.log(result);
})();
