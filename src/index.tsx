import * as React from "react";
import * as ReactDOM from "react-dom";
import { QuestionnaireListContext, QuestionnaireListProvider } from './context/questionnaire-list-context';
import ActiveSurveys from "./screens/home/ActiveSurveys";
import { QuestionnaireProvider } from "./context/questionnaire-context";
import AppNavigator from "./screens/navigation/AppNavigator";

function UpdateQuestionnaireButton() {
  const { updateStoredQuestionnaires } = React.useContext(QuestionnaireListContext);

  return <button onClick={() => updateStoredQuestionnaires()}>Refresh</button>;
}

const view = (
  <QuestionnaireListProvider>
    <QuestionnaireProvider>
      <AppNavigator />
    </QuestionnaireProvider>
  </QuestionnaireListProvider>
);

ReactDOM.render(
  view,
  document.getElementById("feature")
);

