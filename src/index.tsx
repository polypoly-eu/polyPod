import * as React from "react";
import * as ReactDOM from "react-dom";
import { QuestionnaireListProvider } from './context/questionnaire-list-context';
import { QuestionnaireProvider } from "./context/questionnaire-context";
import AppNavigator from "./screens/navigation/AppNavigator";

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

