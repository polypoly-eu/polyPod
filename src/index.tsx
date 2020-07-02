import * as React from "react";
import * as ReactDOM from "react-dom";
import { QuestionnaireListContext, QuestionnaireListProvider } from './context/questionnaire-list-context';
import ActiveSurveys from "./screens/home/ActiveSurveys";

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

