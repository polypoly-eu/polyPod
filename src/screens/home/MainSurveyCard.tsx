import * as React from "react";
import { useTranslation } from 'react-i18next';
import StartSurveyButton from "../../components/buttons/StartSurveyButton";
import Questionnaire from "../../questionnaire/PpQuestionnaire";

//TODO implement questionnaire state
export default function MainSurveyCard(
    { questionnaire }: { questionnaire: Questionnaire }
) {
    const {t, i18n} = useTranslation();

    const title = t(questionnaire.title);
    return <section className="card">
      <header>
        <h1 className="card-title">{title}</h1>
      </header>
      <main>
        <p className="card-content">
          Der Einsendeschluss ist am
          <br/>
          <strong>{questionnaire.submissionDeadlineString(i18n.language)}</strong>
        </p>
      </main>
      <footer>
        <StartSurveyButton questionnaire = {questionnaire} route = "/intro" />
      </footer>
    </section>;
}
